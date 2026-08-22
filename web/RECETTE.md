# Recette manuelle du front

> Ce document décrit **le comportement de l'application avant toute conversion
> en TypeScript**. C'est ce qui lui donne sa valeur de référence : si un
> parcours ne se comporte plus comme décrit ici, c'est la conversion qui est en
> cause, pas la checklist.

[← TS-001](../docs/implementations/migration-typescript/phase-0-socle-typescript/outillage/TS-001-checklist-de-recette-manuelle.md)
· [Tests automatisés](test/README.md)

---

## État

**Jouée intégralement le 2026-08-22**, sur le front encore entièrement en
JavaScript, avant la conversion du moindre fichier. Les douze parcours ont été
exécutés à la main et observés conformes à ce qui est décrit ici.

Une seule exception, signalée sur place : le cas de la copie `damaged` de
[R-07](#r-07--prêt-puis-retour), que les fixtures ne permettent pas d'atteindre.

Les messages cités entre `>` sont des **relevés à l'écran**, pas des
reformulations. Ils se comparent au caractère près.

---

## Avant de commencer

```bash
docker compose up -d db                 # la base seule
# puis démarrer le backend DEPUIS L'IDE — pas de Maven sur le PATH
cd web && npm run dev                   # http://localhost:3000
```

### Repartir d'un état connu

```bash
server/scripts/reset-dev-db.sh
```

Vide les tables métier, recharge Dewey, recharge les fixtures. **C'est l'état
de départ que toute cette checklist suppose.**

> ⚠️ Ne **jamais** jouer `server/sql/reset.sql` seul : il tronque les tables
> Dewey que Flyway ne repeuplera pas — `V2` est déjà enregistrée comme
> appliquée — et laisse `cover` intacte, ce qui fera échouer un `covers.sql`
> ultérieur sur `cover_pkey`. Voir `.claude/CLAUDE.md`.

### Un mot sur les statuts de copie

`copy.status` est écrit par des **triggers de base**, pas par le front. Un
statut qui semble anormal pendant la recette vient peut-être de la base et non
de la conversion en cours.

---

## Index des parcours

C'est cette colonne qui rend la **recette partielle** possible : après une story
de conversion, rejouer les seuls parcours dont le périmètre recoupe le dossier
converti.

| # | Parcours | Exerce |
|---|---|---|
| [R-01](#r-01--navigation) | Navigation entre les huit vues | `booksnap-app`, les 8 `views/` |
| [R-02](#r-02--recherche-et-filtres) | Recherche, filtres genre et statut, pagination | `views/catalog-view`, `components/search-bar-bks`, `controllers/search-controller`, `api/book`, `api/genre`, `api/copy`, `utils/bookMapper` |
| [R-03](#r-03--ajout-par-isbn) | Ajout d'un livre par ISBN | `views/add-book-view`, `features/book/book-form-bks`, `features/book/create-book-bks`, `api/openLibrary`, `api/bookService`, `components/spinner-bks` |
| [R-04](#r-04--ajout-manuel-et-cascade-dewey) | Ajout manuel, cascade Dewey | `views/add-book-view`, `features/book/book-form-bks`, `api/dewey`, `api/bookService` |
| [R-05](#r-05--modification-puis-suppression-dun-livre) | Modifier puis supprimer un livre | `views/catalog-view`, `features/book/book-table-bks`, `features/book/update-book-modal-bks`, `features/book/delete-book-modal-bks`, `api/book` |
| [R-06](#r-06--cycle-de-vie-dune-copie) | Copie : création, section, QR, suppression | `views/catalog-view`, `features/copy/*`, `api/copy`, `components/modal-bks`, `components/dropdown-bks` |
| [R-07](#r-07--prêt-puis-retour) | Prêt à un élève, puis retour | `views/catalog-view`, `views/borrowing-view`, `features/borrowing/*`, `api/borrowing`, `api/user`, `utils/dateFormatter` |
| [R-08](#r-08--réservation) | Réserver un livre entièrement sorti | `views/catalog-view`, `views/borrowing-view`, `features/hold/hold-modal-bks`, `api/hold` |
| [R-09](#r-09--scan-dun-qr-code) | Scanner le QR d'une copie | `views/scan-qrcode-view`, `features/scanner/barcode-scanner-bks`, `features/borrowing/*`, `api/borrowing` |
| [R-10](#r-10--couverture) | Téléverser une couverture, refuser un non-JPEG | `features/cover/cover-upload-bks`, `controllers/cover-controller`, `api/cover` |
| [R-11](#r-11--backend-arrêté) | Backend arrêté | tous les `api/`, toutes les vues |
| [R-12](#r-12--conflit-409) | Copie déjà empruntée (409) | `api/borrowing`, `features/borrowing/*`, `views/catalog-view` |

**R-01, R-11 et R-12 se rejouent après toute story de conversion**, quel que
soit son périmètre.

---

## R-01 — Navigation

**Exerce :** `booksnap-app`, `views/home-view`, `views/add-book-view`,
`views/scan-qrcode-view`, `views/catalog-view`, `views/borrowing-view`,
`views/analytics-view`, `views/settings-view`

Les huit routes sont déclarées dans `booksnap-app.js` : `/`, `/add`, `/scan`,
`/catalog`, `/borrowings`, `/analytics`, `/settings`, `/account`. Quatre vues
sont des **placeholders** d'une quinzaine de lignes — `home`, `analytics`,
`settings`, `account` : il n'y a rien à y vérifier au-delà du rendu et du menu.

1. Ouvrir `/`.
2. Cliquer successivement sur les huit entrées du menu.
3. Utiliser le **bouton Précédent** du navigateur.
4. Recharger la page (F5) depuis `/catalog`.

**On observe :**
- Chaque clic change la vue affichée dans le `<main>` sans rechargement complet.
- L'entrée cliquée reçoit la classe `active`, et **une seule à la fois** — le
  routeur retire la classe de toutes les entrées avant de la poser.
- Le retour arrière remet la vue précédente **et** l'`active` correspondante.
- Un rechargement direct sur `/catalog` affiche bien le catalogue.
- Une URL inconnue tombe sur la route `(.*)`

> Les vues `/add`, `/catalog`, `/borrowings`, `/scan` sont chargées en
> `import()` dynamique par le routeur. Un premier affichage légèrement différé
> est normal.

---

## R-02 — Recherche et filtres

**Exerce :** `views/catalog-view`, `components/search-bar-bks`,
`controllers/search-controller`, `api/book`, `api/genre`, `api/copy`,
`utils/bookMapper`, `controllers/cover-controller`

1. Aller sur `/catalog`.
2. Taper `Harry` dans le champ de recherche.
3. Taper `fan` dans le champ genre, attendre, choisir une proposition.
4. Choisir `Available` dans le filtre de disponibilité.
5. Effacer le genre avec sa croix, puis la disponibilité avec la sienne.
6. Parcourir les pages. La pagination montre corrèctement les livres des pages suivantes.

**On observe :**
- La recherche est **débouncée** : la liste ne se rafraîchit pas à chaque frappe.
- Le champ genre ne propose rien en dessous de **3 caractères** ; au-delà, une
  liste déroulante apparaît sous le champ.
- Choisir un genre referme la liste et remplit le champ avec le genre choisi.
- Une croix n'apparaît sur le champ genre **que** lorsqu'un genre est
  sélectionné ; idem pour la disponibilité.
- Effacer un filtre relance la recherche et élargit les résultats.
- Le filtre de disponibilité est peuplé par l'API (`available`, `borrowed`,
  `on_hold`), affiché en clair — `On hold`, pas `on_hold`.
- Les couvertures se chargent après les lignes, sans décaler la liste.

> ⚠️ Point de vigilance connu : le `select[name='availability']` a déjà été
> cassé **deux fois** par l'ordre de `sharedStyles` dans `static styles`. Si sa
> taille ou son padding paraissent différents des autres champs, c'est ce
> bug-là. Voir `.claude/CLAUDE.md`. **Aucun test automatisé ne l'attrape.**

---

## R-03 — Ajout par ISBN

**Exerce :** `views/add-book-view`, `features/book/book-form-bks`,
`features/book/create-book-bks`, `api/openLibrary`, `api/bookService`,
`components/spinner-bks`, `components/button-bks`

1. Aller sur `/add`.
2. Saisir un ISBN existant chez OpenLibrary — p. ex. `9780747532699`.
3. Lancer la recherche.
4. Compléter ce qui manque, puis valider la création.
5. Aller sur `/catalog` et rechercher le livre créé.

**On observe :**
- Un `spinner-bks` pendant l'appel à OpenLibrary.
- Le formulaire se **pré-remplit** : titre, auteur, et ce qu'OpenLibrary
  renvoie. Les champs restent modifiables.
- La couverture OpenLibrary s'affiche en aperçu.
- Un ISBN inconnu d'OpenLibrary laisse le formulaire vide et n'affiche aucun message, laissant l'utilisateur dans l'inconnue.
- Après création, le livre est retrouvable dans le catalogue.

---

## R-04 — Ajout manuel et cascade Dewey

**Exerce :** `views/add-book-view`, `features/book/book-form-bks`, `api/dewey`,
`api/bookService`

La cascade a **trois niveaux**, servis par trois endpoints distincts :
classes → divisions d'une classe → catégories d'une division.

1. Aller sur `/add`, sans passer par l'ISBN.
2. Remplir titre et auteur à la main.
3. Ouvrir le sélecteur Dewey : choisir une **classe**.
4. Choisir une **division**.
5. Choisir une **catégorie**.
6. Revenir en arrière : changer la classe une fois la catégorie choisie.
7. Valider la création.

**On observe :**
- Les divisions ne sont chargées **qu'après** le choix d'une classe, et les
  catégories qu'après le choix d'une division.
- Le sélecteur de division est vide ou désactivé tant qu'aucune classe n'est
  choisie.
- Changer la classe enlève le selecteur de catégorie. Il n'apparait plus àa l'écran. Et le sélecteur de division affiche la division mère c'est à dire la même que la classe. C'est le point qui
  casse le plus facilement. Vérifier qu'aucune valeur périmée ne subsiste.
- Le livre créé porte bien le code Dewey complet.
- Les noms d'auteur sont enregistrés **tels que saisis** : la casse n'est plus
  normalisée par le back (colonnes `citext` depuis `V4`). Saisir `j.k. rowling`
  et vérifier qu'il ressort tel quel, et qu'il ne crée pas de doublon avec
  `J.K. Rowling`.

---

## R-05 — Modification puis suppression d'un livre

**Exerce :** `views/catalog-view`, `features/book/book-table-bks`,
`features/book/update-book-modal-bks`, `features/book/delete-book-modal-bks`,
`components/dropdown-bks`, `components/modal-bks`, `api/book`

Les actions de ligne passent par un `dropdown-bks` qui émet
`dropdown-selected-option` avec `{ action, data }` ; la vue fait le `switch`.

1. Sur `/catalog`, ouvrir le menu d'actions d'une ligne.
2. Choisir la modification, changer le titre, valider.
3. Rouvrir le menu, choisir la suppression, **annuler**.
4. Rouvrir, supprimer, confirmer.

**On observe :**
- La modale s'ouvre pré-remplie avec les valeurs de la ligne.
- Après validation, **la ligne du tableau reflète le nouveau titre** sans
  rechargement de page. C'est précisément ce qu'un champ de classe masquant
  casserait en silence.
- Annuler la suppression referme la modale et **ne supprime rien**.
- Après confirmation, la ligne disparaît du tableau.
- Supprimer un livre qui a des copies. Il est possible de supprimer un livre qui à des copies. Un message d'alerte est présenté: "Are you sure you want to delete 'Harry Potter and the Sorcerer's Stone'?

This action cannot be undone.

All 1 associated copies will be permanently removed from the library system."

---

## R-06 — Cycle de vie d'une copie

**Exerce :** `views/catalog-view`, `features/copy/copy-table-bks`,
`features/copy/copy-section-modal-bks`, `features/copy/copy-qr-modal-bks`,
`features/copy/delete-copy-modal-bks`, `api/copy`, `components/modal-bks`

1. Sur `/catalog`, déplier les copies d'un livre en clickant sur le bouton arrow down en las Actions
2. Créer une copie.
3. Changer sa section.
4. Afficher son QR code.
5. Supprimer la copie.

**On observe :**
- La copie créée apparaît au statut `available`.
- Le changement de section se reflète dans le tableau après validation.
- Le QR code s'affiche dans une modale et est **lisible** — c'est lui que R-09
  scannera.
- La suppression demande confirmation, puis retire la ligne.
- Une copie `borrowed` ne peut pas être supprimée. Mais aucun message ne l'indique. La modale de confirmation de suppression s'ouvre. On click sur supprimer. La modale se ferme. Mais la copie est toujours là même après avoir fais un refresh de la page. Par contre, on peut supprimer correctemennt un livre dont ses copies sont Borrowed.

---

## R-07 — Prêt puis retour

**Exerce :** `views/catalog-view`, `views/borrowing-view`,
`features/borrowing/loan-modal-bks`, `features/borrowing/return-modal-bks`,
`api/borrowing`, `api/user`, `utils/dateFormatter`,
`controllers/cover-controller`, `components/dropdown-bks`

1. Sur `/catalog`, choisir un livre ayant une copie `available`.
2. Ouvrir la modale de prêt.
3. Chercher un élève par son nom, le sélectionner.
4. Valider le prêt.
5. Aller sur `/borrowings` : retrouver le prêt.
6. Le rendre depuis `/borrowings`.

**On observe :**
- La recherche d'élève filtre au fil de la frappe et ne propose que des élèves
  existants.
- Après validation : **la modale se ferme, la ligne passe à `borrowed`, et le
  nom de l'élève apparaît dans la colonne.**
- Sur `/borrowings`, le prêt figure avec sa date d'échéance, **formatée** — pas
  un ISO brut. C'est `utils/dateFormatter`.
- Un prêt en retard porte un **badge rouge `Late(N days)`** — `N` étant le
  nombre de jours de retard — et **sa date d'échéance s'affiche en rouge**.
  Les prêts à l'heure n'ont ni badge ni date colorée : c'est le contraste qui
  se vérifie, pas le badge seul.
- Après le retour, la copie **redevient `available`** — écrit par un trigger, pas
  par le front.
- Une copie `damaged` avant le prêt **reste `damaged`** après le retour
  (`borrowing.pre_borrow_copy_status`). **Non joué :** les fixtures ne
  contiennent aucune copie `damaged` — les 20 copies de `seed.sql` sont
  `available`. Ce cas demande un `UPDATE copy SET status = 'damaged'` à la
  main, sur une colonne que les triggers possèdent.

---

## R-08 — Réservation

**Exerce :** `views/catalog-view`, `views/borrowing-view`,
`features/hold/hold-modal-bks`, `api/hold`, `api/borrowing`

Une réservation porte sur un **livre**, pas sur une copie : aucune copie ne lui
est attachée tant qu'aucune ne se libère.

1. Choisir un livre et emprunter **toutes** ses copies (R-07 autant de fois que
   nécessaire).
2. Réserver ce livre pour un autre élève.
3. Vérifier la réservation sur `/borrowings`
4. Rendre une copie.

**On observe :**
- La réservation n'est proposée que lorsque **toutes** les copies sont sorties.
- La réservation créée est au statut `pending`, **sans copie attachée**.
- Après le retour d'une copie, la plus ancienne réservation `pending` du livre
  passe `active`, une copie lui est attachée, et cette copie passe `on_hold`.
- Une copie `on_hold` **ne peut pas être empruntée par un autre élève** que
  celui pour qui elle est mise de côté.

---

## R-09 — Scan d'un QR code

**Exerce :** `views/scan-qrcode-view`, `features/scanner/barcode-scanner-bks`,
`features/borrowing/loan-modal-bks`, `features/borrowing/return-modal-bks`,
`api/borrowing`

1. Afficher le QR d'une copie `available` (R-06) sur un second écran ou
   l'imprimer.
2. Aller sur `/scan`, autoriser la caméra.
3. Scanner le QR.
4. Recommencer avec une copie `borrowed`.

**On observe :**
- Le navigateur demande l'accès à la caméra ; le flux vidéo s'affiche.
- Un scan réussi ouvre la modale correspondant à l'état de la copie : **prêt**
  si `available`, **retour** si `borrowed`.
- Refuser l'accès caméra n'affiche aucun message et laisse l'écran vide.
- Quitter `/scan` **libère la caméra** — la LED s'éteint. Une caméra qui reste
  allumée après navigation est une régression de `disconnectedCallback`.

> Aucun test automatisé ne couvre ce parcours : `barcode-scanner-bks` se monte
> sous happy-dom mais ZXing et `getUserMedia` n'y tournent pas.

---

## R-10 — Couverture

**Exerce :** `features/cover/cover-upload-bks`, `controllers/cover-controller`,
`api/cover`, `features/book/book-form-bks`

Le champ n'accepte que du JPEG : `accept="image/jpeg,image/jpg,.jpg,.jpeg"`, et
la validation est refaite en JS sur `file.type` **et** sur l'extension.

1. Ouvrir le formulaire d'un livre sans couverture.
2. Téléverser un `.jpg` valide.
3. Enregistrer, revenir au catalogue.
4. Rouvrir et **remplacer** la couverture par un autre `.jpg`.
5. Tenter un `.png`, puis un `.pdf`.

**On observe :**
- Un aperçu local s'affiche dès la sélection, avant enregistrement.
- Après enregistrement, la couverture apparaît dans le catalogue.
- **Le remplacement affiche bien la nouvelle image**, pas l'ancienne : le
  contrôleur invalide son cache d'`objectURL` pour cet ISBN. Une ancienne image
  qui persiste est une régression de `cover-controller.invalidate()`.
- Un fichier non-JPEG est **refusé** avec le message
  `Only JPEG images (.jpg, .jpeg) are allowed`, et **aucun aperçu ne s'affiche**.
- Le sélecteur de fichiers ne propose par défaut que des JPEG, mais le refus
  doit fonctionner même en forçant « tous les fichiers ».

---

## R-11 — Backend arrêté

**Exerce :** tous les modules `api/`, toutes les vues

1. Arrêter le backend depuis l'IDE. **Laisser la base tournante.**
2. Recharger `/catalog`.
3. Aller sur `/borrowings`, puis `/add`.
4. Tenter une recherche, puis une création.
5. Redémarrer le backend et recharger.

**On observe :** les trois vues ne se comportent **pas** de la même façon.

- `/catalog` affiche :

  > Error loading books: Failed to fetch books: TypeError: Failed to fetch.

- `/borrowings` affiche :

  > Error loading borroweds: Failed to fetch.

  > ⚠️ « borroweds » est une **faute de frappe présente dans le code
  > d'aujourd'hui**. Elle fait partie de la référence : la reproduire telle
  > quelle après conversion. La corriger est un changement de comportement —
  > légitime, mais **pas pendant une story de conversion**, où le diff doit
  > rester une pure ré-annotation.

- `/add` **n'affiche aucun message.** L'échec est silencieux. C'est le
  comportement actuel, donc la référence ; ce n'est pas une régression tant
  qu'on le retrouve à l'identique. C'est en revanche le meilleur candidat à une
  story de correction, **après** la migration.

Ces trois messages sont le point le plus fragile de la migration : les
`catch (error)` deviennent `catch (error: unknown)` et le texte affiché change
facilement sans qu'aucun type ne s'y oppose. **Les reproduire au caractère
près** après la conversion d'`api/book`, `api/borrowing` et `api/bookService`.

- La console ne part pas en boucle de requêtes.
- Après redémarrage, un rechargement suffit à retrouver un état normal.

---

## R-12 — Conflit 409

**Exerce :** `api/borrowing`, `features/borrowing/loan-modal-bks`,
`features/borrowing/return-modal-bks`, `views/catalog-view`

C'est le comportement que `api/borrowing.js` protège en attachant
`error.status` à l'`Error` levée. [TS-006](../docs/implementations/migration-typescript/phase-1-socle-de-types/types-du-domaine/TS-006-erreur-api-typee.md)
remplace cette convention par une classe `ApiError` : **ce parcours est la
recette de cette story**.

1. Ouvrir `/catalog` dans **deux onglets**, sur le même livre.
2. Dans l'onglet A, prêter une copie `available` à un élève.
3. Dans l'onglet B — **sans recharger** — prêter la même copie.
4. Recommencer avec un retour : rendre la même copie depuis les deux onglets.

**On observe :**
- L'onglet B reçoit un **409** et affiche un message spécifique au conflit,
  distinct d'une erreur générique.
- Message exact, reprenant le titre du livre :

  > Astrophysics for People in a Hurry is no longer available.
  > Someone else borrowed this copy a moment ago.

- **La liste de l'onglet B ne se rafraîchit pas d'elle-même.** Elle ne se met à
  jour qu'*après* la tentative d'emprunt qui a échoué. C'est le comportement
  actuel, et donc la référence : ni un bug à corriger pendant la migration, ni
  une régression si on le retrouve à l'identique.
- L'état final en base est cohérent : **un seul** prêt créé, pas deux.

### Le même conflit, côté retour

Le retour se comporte **différemment de l'emprunt** — c'est l'asymétrie à
préserver.

- Onglet A, le retour aboutit et une confirmation s'affiche :

  > Astrophysics for People in a Hurry has been returned.
  > The copy is back on the shelf and can be borrowed again.

  **La liste se rafraîchit toute seule** et le prêt disparaît de
  `/borrowings` — là où l'emprunt, lui, ne rafraîchit rien.

- Onglet B, la modale de confirmation s'ouvre **normalement** : elle demande
  toujours si l'on veut rendre le livre X emprunté par Y. Le front ne sait pas
  encore que la copie est rendue.

- En confirmant, une **seconde modale** annonce le conflit :

  > Astrophysics for People in a Hurry is not out on loan.
  > Somebody has returned it already, so there is nothing to check in.

C'est bien un 409 traité, pas une 500. **Les deux modales font partie de la
référence** : une conversion qui n'en afficherait qu'une — en fermant la
première ou en escamotant la seconde — serait une régression, même si le
message final est identique.

> Les trois cas de `returnBorrowing` — 409, erreur sans message, succès — sont
> couverts par `test/api/borrowing.spec.ts`. Ce parcours vérifie ce que le test
> ne voit pas : ce que l'utilisateur lit à l'écran.

---

## Ce que cette recette ne couvre pas

- Le **responsive** : la vue `borrowing-view` a un affichage en cartes sur
  mobile qui n'est jamais exercé ici.
- Les vues **placeholder** (`home`, `analytics`, `settings`, `account`)
  au-delà de leur rendu et du menu.
- `npm run analyze` et `custom-elements.json`.
- **Le cas de la copie `damaged`** de [R-07](#r-07--prêt-puis-retour) : les
  20 copies de `seed.sql` sont `available`, et `copy.status` appartient aux
  triggers. L'atteindre demande un `UPDATE copy SET status = 'damaged'` à la
  main, sur une colonne que le code applicatif n'écrit jamais.

### Deux comportements relevés, à ne pas corriger en migrant

Ils sont dans la référence parce qu'ils existent aujourd'hui, pas parce qu'ils
sont souhaitables. Les corriger est légitime — **dans une story à part, après
la migration**, jamais dans un diff de conversion.

| Où | Quoi |
|---|---|
| [R-11](#r-11--backend-arrêté) | `/add` échoue **en silence**, sans message |
| [R-11](#r-11--backend-arrêté) | `/borrowings` affiche « Error loading **borroweds** » — faute de frappe dans le code |
