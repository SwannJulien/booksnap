# Couvertures de livres (*covers*)

> Où sont stockées les images de couverture, comment elles sont retrouvées, et
> ce qui leur arrive quand un livre est modifié ou supprimé.
>
> Les noms de tables, de classes et de champs sont laissés en anglais : ce sont
> ceux du code et de la base.

---

## Table des matières

- [1. Vue d'ensemble](#1-vue-densemble)
- [2. Le stockage : la table `cover`](#2-le-stockage--la-table-cover)
- [3. La clé : l'ISBN](#3-la-clé--lisbn)
- [4. L'API HTTP](#4-lapi-http)
- [5. Le cycle de vie d'une couverture](#5-le-cycle-de-vie-dune-couverture)
- [6. Côté frontend](#6-côté-frontend)
- [7. Les couvertures du jeu de données (*seed*)](#7-les-couvertures-du-jeu-de-données-seed)
- [8. Limites connues](#8-limites-connues)

---

## 1. Vue d'ensemble

Les images de couverture sont stockées **dans PostgreSQL**, en `bytea`, dans une
table dédiée. Aucun service externe n'intervient : les octets sont servis par le
backend Spring, depuis la même base que le reste des données.

Trois acteurs, et savoir qui fait quoi évite beaucoup de confusion :

| Acteur | Rôle | Où |
|---|---|---|
| **Table `cover`** | Détient les octets de l'image, indexés par ISBN. | `server/sql/schema.sql` |
| **`CoverService`** | Lit, écrit, supprime, déplace et copie une couverture. Porte la validation (type, taille). | `domain/cover/service/` |
| **`BookServiceImpl`** | Fait **suivre** la couverture quand l'ISBN d'un livre change, et la supprime avec le livre. | `domain/book/service/` |
| **`CoverController`** (frontend) | Cache par vue des images déjà téléchargées, sous forme d'*object URLs*. | `web/src/controllers/cover-controller.js` |

Attention à l'homonymie : `CoverController` désigne **deux choses différentes**,
le contrôleur REST Spring (`domain/cover/api/CoverController.java`) et le
*reactive controller* Lit côté navigateur.

---

## 2. Le stockage : la table `cover`

```sql
CREATE TABLE cover (
    isbn VARCHAR(13) PRIMARY KEY,
    image BYTEA NOT NULL,
    content_type TEXT NOT NULL,
    created_by TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

Deux décisions structurantes :

- **Une table à part, pas une colonne sur `book`.** Lister le catalogue ne doit
  jamais charger les octets des images. Un livre et sa couverture ne sont
  chargés ensemble nulle part.
- **`byte[]` mappé en `bytea`, pas `@Lob`.** Sur PostgreSQL, `@Lob` fait passer
  Hibernate par les *large objects* (OID), avec les complications de gestion qui
  vont avec. Un `byte[]` simple suffit.

L'entité `Cover` étend `Auditable`, comme `Book` : elle hérite donc des quatre
colonnes d'audit. `last_modified_date` sert aussi d'**ETag** (voir §4).

> ⚠️ Comme pour le reste du schéma, `schema.sql` ne s'exécute qu'à la **première
> création du volume** `booksnap-db-data`. Sur une base existante, il faut jouer
> le `CREATE TABLE` à la main. Voir `.claude/CLAUDE.md`.

---

## 3. La clé : l'ISBN

Une couverture est indexée par l'**ISBN du livre**, jamais par son `book.id`.
L'ISBN retenu suit toujours le même ordre de priorité :

```
ISBN-13 si présent, sinon ISBN-10
```

Cette règle est appliquée de façon identique des deux côtés :

| Où | Fonction |
|---|---|
| Backend | `BookServiceImpl.primaryIsbn(Book)` |
| Backend (SQL) | `COALESCE(NULLIF(isbn13, ''), NULLIF(isbn10, ''))` |
| Frontend | `getPrimaryIsbn(bookData)` dans `web/src/api/bookService.js` |

**Conséquences à connaître :**

- Un livre **sans ISBN ne peut pas avoir de couverture**. L'interface le signale
  explicitement (« A book needs an ISBN before it can have a cover ») plutôt que
  d'échouer en silence.
- La table `book` n'a **aucune contrainte d'unicité** sur `isbn10` / `isbn13`, il
  n'est donc pas possible de poser une clé étrangère vers `cover`. Le lien reste
  conventionnel — mais il est **joignable en SQL**, ce qui suffit pour auditer :

```sql
-- Livres sans couverture
SELECT b.id, b.title
FROM book b
LEFT JOIN cover c
       ON c.isbn = COALESCE(NULLIF(b.isbn13, ''), NULLIF(b.isbn10, ''))
WHERE c.isbn IS NULL;

-- Couvertures orphelines (plus aucun livre ne pointe dessus)
SELECT c.isbn
FROM cover c
WHERE NOT EXISTS (
    SELECT 1 FROM book b
    WHERE COALESCE(NULLIF(b.isbn13, ''), NULLIF(b.isbn10, '')) = c.isbn
);
```

---

## 4. L'API HTTP

Base : `api/v1/covers` — `domain/cover/api/CoverController.java`.

| Méthode | Route | Corps | Réponse |
|---|---|---|---|
| `POST` | `/api/v1/covers?isbn={isbn}` | octets bruts de l'image | `201` |
| `GET` | `/api/v1/covers/{isbn}` | — | `200` + octets, `304`, ou `404` |
| `DELETE` | `/api/v1/covers/{isbn}` | — | `204` |

### POST — envoyer une couverture

Le corps est l'image **brute** (pas de `multipart`). L'en-tête `Content-Type`
envoyé par le client est celui qui sera stocké et re-servi plus tard.

Validation, dans `CoverServiceImpl` :

| Règle | Sinon |
|---|---|
| `isbn` non vide | `400` |
| Corps non vide | `400` |
| Taille ≤ `booksnap.cover.max-size-bytes` (2 Mo par défaut) | `400` |
| `Content-Type` commençant par `image/` | `400` |

Un `Content-Type` absent est interprété comme `image/jpeg`. Un `POST` sur un
ISBN qui a déjà une couverture la **remplace** : c'est la seule opération qui
écrase une image existante.

### GET — récupérer une couverture

La réponse porte le `Content-Type` réellement stocké, un `ETag` dérivé de
`last_modified_date`, et `Cache-Control: no-cache`.

Autrement dit : le navigateur revalide à chaque fois, mais ne retélécharge les
octets que si l'image a changé — sinon il reçoit un `304` sans corps. Une
couverture remplacée est donc visible immédiatement, sans cache périmé.

Un ISBN sans couverture renvoie un vrai `404` (`CoverNotFoundException`), ce qui
permet au client de distinguer « pas de couverture » d'une véritable panne.

### DELETE — supprimer une couverture

**Idempotent** : un ISBN sans couverture est déjà dans l'état demandé, la réponse
est `204` et non `404`.

À noter : dans le fonctionnement normal de l'application, la suppression est
automatique (voir §5). Cet endpoint sert à retirer une couverture *seule*.

---

## 5. Le cycle de vie d'une couverture

| Événement | Ce qui arrive à la couverture |
|---|---|
| Création d'un livre | Envoyée après la création, sous l'ISBN du livre. |
| Modification d'un livre, image inchangée | Rien. Aucun envoi inutile. |
| Modification d'un livre, nouvelle image | Remplacée sous l'ISBN courant. |
| **Changement d'ISBN** | **Déplacée** vers le nouvel ISBN. |
| **Suppression d'un livre** | **Supprimée**, sauf si partagée. |
| ISBN vidé complètement | **Rien** — délibérément conservée. |

### Création

`BookService.createBook` (`web/src/api/bookService.js`) crée d'abord le livre,
puis envoie la couverture **seulement si la création a réussi** (`201`). Un échec
d'envoi n'annule pas le livre : il est remonté dans `response.coverError` et
affiché dans la modale de succès (« The book was created, but its cover could not
be saved »).

### Remplacement lors d'une modification

Le composant `cover-upload-bks` affiche la couverture **existante** quand on
modifie un livre. Il faut donc distinguer « l'utilisateur a choisi une nouvelle
image » de « on affiche celle déjà stockée » — sans quoi chaque enregistrement
renverrait les mêmes octets.

C'est le rôle de `hasNewCover()`, qui n'est vrai que si un fichier a été choisi
via le sélecteur. Le formulaire propage l'information dans l'événement
`book-submit`, sous la clé `coverChanged`.

### Changement d'ISBN — la couverture suit

Une couverture étant indexée par ISBN, changer l'ISBN d'un livre lui ferait
perdre son image. `BookServiceImpl.followCover(...)` s'en charge, **côté serveur,
dans la même transaction** que la mise à jour du livre :

- si **aucun autre livre** n'utilise l'ancien ISBN → la couverture est
  **déplacée** (`moveCoverImage`) ;
- si un autre livre l'utilise encore → elle est **copiée** (`copyCoverImage`), et
  l'originale reste en place.

Le garde-fou est la requête `BookRepository.countOtherBooksSharingIsbn(...)`.

Deux règles à retenir :

- **Un déplacement n'écrase jamais** une couverture déjà présente sur l'ISBN de
  destination. Une couverture appartient à une *édition*, et l'ISBN identifie
  l'édition : si la destination a déjà son image, c'est elle qui est correcte.
  Seul un `POST` explicite remplace une image.
- **Vider l'ISBN d'un livre ne supprime pas sa couverture.** Une suppression
  définitive n'a lieu que lorsque l'image est supplantée (déplacée sur une autre
  clé) ou que le livre disparaît. Effacer un champ est trop ambigu pour détruire
  une donnée — et
  cela permet de retrouver l'image en restaurant l'ISBN.

### Suppression d'un livre

`BookServiceImpl.deleteBookById(...)` relit l'ISBN **avant** de supprimer le
livre, puis supprime la couverture — sauf si un autre livre partage le même ISBN.
Là aussi, tout se joue dans une seule transaction.

---

## 6. Côté frontend

### Affichage : `CoverController`

`web/src/controllers/cover-controller.js` est un *reactive controller* Lit,
instancié **par vue** (`catalog-view`, `borrowing-view`). Il maintient une `Map` :

```
isbn → object URL | 'loading' | null
```

| Méthode | Rôle |
|---|---|
| `fetchForBooks(books)` | Télécharge les couvertures manquantes, une requête par ISBN inconnu. |
| `get(isbn)` | Renvoie l'*object URL* prête à l'emploi, ou `null`. |
| `invalidate(isbn)` | Révoque l'*object URL* et retire l'entrée, pour forcer un nouveau téléchargement. |

`hostDisconnected` révoque toutes les *object URLs* : sans cela, elles fuiraient
à chaque changement de vue.

`invalidate(isbn)` est **indispensable** après une modification : sans elle, la
liste continuerait d'afficher l'ancienne image (ou une URL révoquée) jusqu'au
rechargement complet de la page. `catalog-view` l'appelle après un remplacement
d'image, après un changement d'ISBN (sur les deux clés) et après une suppression.

Les trois états sont distingués à l'affichage par `book-table-bks` :
`undefined` / `'loading'` → squelette, `null` → cadre vide, URL → `<img>`.

### Envoi : `cover-upload-bks`

`web/src/features/cover/cover-upload-bks/` accepte deux sources :

1. un **fichier** choisi par l'utilisateur — **JPEG uniquement**, validé sur le
   type MIME *et* l'extension ; un refus émet un événement `cover-error` ;
2. une **URL externe**, celle renvoyée par OpenLibrary après un scan d'ISBN. Les
   octets sont alors téléchargés par le navigateur puis renvoyés à notre backend :
   rien ne pointe vers OpenLibrary après la création.

`getCover()` renvoie le fichier s'il y en a un, sinon l'URL. `hasNewCover()`
indique si un fichier a été choisi (voir §5).

### Couche API

`web/src/api/cover.js` expose `getCover(isbn)` et `uploadCover(source, isbn)`.
Conformément aux conventions du projet, les erreurs portent un `error.status`.
`getCover` traite le `404` comme un cas normal et résout avec `{ blob: null }`.

---

## 7. Les couvertures du jeu de données (*seed*)

`server/sql/covers.sql` contient les couvertures des 10 livres du *seed*,
encodées en base64, une instruction `INSERT` commentée par livre. Le fichier est
monté en `04-covers.sql`, donc **après** `03-seed.sql`.

Les images proviennent de l'API Open Library Covers (format *medium*, ~180 px de
large — largement suffisant pour un affichage à 40×60 px en table et 68×100 px en
carte mobile).

Comme les autres fichiers d'init, il ne s'exécute qu'à la **première création du
volume**. Pour le charger sur une base existante :

```bash
docker exec -i booksnap-postgres sh -c \
  'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f -' < server/sql/covers.sql
```

Les `INSERT` sont en `ON CONFLICT (isbn) DO NOTHING` : le fichier est rejouable.

> Les ISBN de cinq livres du *seed* ont été corrigés : ils appartenaient à
> d'autres ouvrages (bon éditeur, mauvais titre), ce qui affichait des
> couvertures sans rapport. Chaque ISBN de remplacement a été vérifié sur les
> métadonnées **et** visuellement sur l'image.

---

## 8. Limites connues

| Limite | Détail |
|---|---|
| **Aucune authentification** | Les trois endpoints sont ouverts, comme **toute** l'API (`SecurityConfig` est en `anyRequest().permitAll()`). N'importe qui peut donc remplacer ou supprimer une couverture. |
| `DELETE` sans appelant | La suppression et le déplacement étant gérés côté serveur, aucun écran n'appelle l'endpoint. Il faudrait un bouton « Remove cover » dans le formulaire d'édition. |
| ISBN vidé → ligne orpheline | Cas assumé (§5) : la couverture est conservée plutôt que détruite. |
| `updateBook` ne vérifie pas les doublons d'ISBN | Contrairement à `addBook`, qui lève `BookAlreadyExistsException`. Deux livres peuvent donc partager une clé de couverture. Les garde-fous `countOtherBooksSharingIsbn` gèrent la situation sans casse, mais le trou reste à combler. |
| Pas de redimensionnement | L'image est stockée telle qu'envoyée. Seule la taille maximale est contrôlée. |
