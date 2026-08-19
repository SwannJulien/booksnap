# Règles métier — Paramètres configurables

> Les valeurs qui pilotent les règles de prêt, où elles sont stockées, comment
> elles sont résolues, et **quand un changement prend effet**.

Documents liés :
[règles emprunts/réservations](REGLES-METIER-EMPRUNTS-RESERVATIONS.md) ·
[règles accès](REGLES-METIER-ACCES.md) ·
[règles structurelles](REGLES-METIER-STRUCTURE.md)

---

## Table des matières

- [1. Principe : défaut global, surcharge par bibliothèque](#1-principe--défaut-global-surcharge-par-bibliothèque)
- [2. Résolution : d'où vient la bibliothèque](#2-résolution--doù-vient-la-bibliothèque)
- [3. Liste des paramètres](#3-liste-des-paramètres)
- [4. Règle du gel : un changement ne réécrit jamais l'existant](#4-règle-du-gel--un-changement-ne-réécrit-jamais-lexistant)
- [5. Qui peut modifier quoi](#5-qui-peut-modifier-quoi)
- [6. Validation](#6-validation)

---

## 1. Principe : défaut global, surcharge par bibliothèque

Chaque paramètre existe en **une valeur globale** et, éventuellement, en **une
surcharge par bibliothèque**. La résolution est toujours :

```
valeur de la bibliothèque si elle existe, sinon valeur globale
```

Une bibliothèque qui ne surcharge rien suit intégralement les défauts globaux.

Motivation : Preschool et Primary n'ont pas les mêmes besoins — une durée de
prêt d'une semaine pour un enfant de quatre ans, deux semaines pour un
collégien.

### Stockage

Table `app_setting`, avec `library_id` **nullable** : `NULL` = ligne globale.

> ⚠️ **Piège :** `UNIQUE (library_id)` ne suffit **pas** à garantir une seule
> ligne globale — PostgreSQL considère les `NULL` comme distincts, donc plusieurs
> lignes globales pourraient coexister. Il faut un index unique partiel :
>
> ```sql
> CREATE UNIQUE INDEX uq_app_setting_global
>     ON app_setting ((library_id IS NULL)) WHERE library_id IS NULL;
> ```

---

## 2. Résolution : d'où vient la bibliothèque

La bibliothèque servant à résoudre un paramètre est **toujours dérivée côté
serveur**, jamais transmise par le client.

| Paramètre | Bibliothèque dérivée de |
|---|---|
| Durée d'un emprunt | `copy.library_id` de la copie empruntée |
| Fenêtre de retrait d'une réservation | `hold.library_id` |
| Durée de vie d'une réservation `pending` | `hold.library_id` |
| Nombre max d'emprunts simultanés | `users.library_id` de l'emprunteur |
| Nombre max de réservations simultanées | `users.library_id` de l'emprunteur |
| Renouvellement (durée, nombre) | `copy.library_id` de la copie empruntée |
| Pénalité (seuil, durée) | `users.library_id` de l'usager |

Deux ancrages différents cohabitent volontairement : ce qui concerne **un
document** suit la bibliothèque du document ; ce qui concerne **une personne**
suit la bibliothèque de la personne.

---

## 3. Liste des paramètres

### 3.1 Durées (remplacent les constantes codées en dur)

| Paramètre | Valeur actuelle | Où c'est codé en dur aujourd'hui |
|---|---|---|
| Durée d'un emprunt | 2 semaines | `BorrowingServiceImpl.BORROWING_DURATION_WEEKS` |
| Fenêtre de retrait d'une réservation `active` | 1 semaine | `BorrowingServiceImpl.HOLD_PICKUP_WINDOW_WEEKS` |
| Durée de vie max d'une réservation `pending` | 5 semaines | **nulle part** — documentée, jamais implémentée |

> La troisième valeur n'a **aucun effet** aujourd'hui : aucun scheduler ne fait
> expirer les réservations. La rendre configurable sans la rendre effective
> serait pire que de la laisser en dur — l'implémentation du scheduler fait
> partie du même lot. Voir
> [règles emprunts §8](REGLES-METIER-EMPRUNTS-RESERVATIONS.md).

### 3.2 Limites, renouvellement, pénalités

**Aucune de ces fonctionnalités n'existe dans le code aujourd'hui.** Les rendre
configurables suppose de les implémenter d'abord.

| Paramètre | Rôle |
|---|---|
| Nombre max d'emprunts simultanés | Vérifié à `POST /borrowings`, compte les emprunts `borrowed` + `overdue` |
| Nombre max de réservations simultanées | Vérifié à `POST /holds`, compte les réservations `pending` + `active` |
| Renouvellement autorisé (oui/non) | Active l'endpoint de prolongation |
| Durée d'un renouvellement | +1 semaine par défaut |
| Nombre de renouvellements autorisés | 1 par défaut (`borrowing.renewal_count`) |
| Seuil de pénalité | Retard au-delà duquel une suspension s'applique (1 semaine par défaut) |
| Durée de la suspension | 1 semaine par défaut (`users.suspended_until`) |

#### Règles associées

- **Renouvellement refusé** si : le quota de renouvellements est atteint, **ou**
  l'emprunt est déjà `overdue`, **ou** un *autre* usager a une réservation
  `pending` ou `active` sur ce livre. Cette dernière condition est essentielle :
  sans elle, les renouvellements affament la file d'attente.
- **Pénalité appliquée au retour** d'un document en retard, et non par le
  scheduler pendant le retard. Ainsi la sanction est déterministe et annoncée à
  l'usager au comptoir, au moment où il rend le livre.
- Un usager suspendu **peut se connecter** et consulter ; il ne peut ni
  emprunter ni réserver.

### 3.3 Candidats identifiés, non retenus pour l'instant

| Paramètre | Pourquoi il reviendra |
|---|---|
| Domaines email de l'école | Détermine si une invitation propose Microsoft ou un mot de passe ([règles accès §5.3](REGLES-METIER-ACCES.md)) |
| Création de compte à la volée (JIT) sur SSO | Désactivée par défaut pour raison de sécurité ; à rendre explicite si un jour souhaitée |
| Destinataire des notifications | `email`, `parent_email`, ou les deux selon le `key_stage` — à trancher au moment des notifications |

---

## 4. Règle du gel : un changement ne réécrit jamais l'existant

**Modifier un paramètre n'a d'effet que sur les opérations futures.**

Un emprunt calcule sa `end_date` **une fois**, à sa création, à partir de la
valeur en vigueur à cet instant. Elle est ensuite figée. Un élève à qui on a
annoncé « à rendre le 15 mars » ne doit pas se retrouver avec une autre date
parce qu'un administrateur a modifié un nombre entre-temps.

La même règle s'applique à la fenêtre de retrait d'une réservation `active` :
`start_date` et `end_date` sont fixées à la promotion.

### L'asymétrie à corriger

La durée de vie d'une réservation `pending` n'a, elle, **aucune date stockée** :
l'expiration serait évaluée par un scheduler à partir de `created_date`. Passer
le paramètre de 5 à 3 semaines ferait donc expirer **rétroactivement** des
réservations déjà plus anciennes que 3 semaines — en contradiction avec la règle
du gel.

**Décision : ajouter `hold.expires_at`, calculée à la création**, comme les
autres dates. Le scheduler compare alors à une date figée, et le gel vaut pour
les trois durées.

---

## 5. Qui peut modifier quoi

| Portée | `USER` | `LIBRARIAN` | `ADMIN` |
|---|:--:|:--:|:--:|
| Valeurs globales | ❌ | ❌ | ✅ |
| Surcharges d'une bibliothèque | ❌ | ✅ ses bibliothèques | ✅ |

Un bibliothécaire peut donc adapter les règles de **sa** bibliothèque sans
pouvoir déplacer le défaut de l'établissement.

---

## 6. Validation

Toute valeur est bornée côté serveur — un paramètre absurde casse le service
pour tout le monde.

| Contrainte | Raison |
|---|---|
| Toutes les durées : entiers **strictement positifs** | Une durée nulle ou négative produirait une `end_date` antérieure à `start_date`, violant la contrainte `CHECK (start_date <= end_date)` de `borrowing` |
| Bornes hautes raisonnables (ex. 365 jours) | Évite la faute de frappe qui prête un livre pour 20 ans |
| Limites (emprunts, réservations) : entiers positifs | `0` signifierait « interdit d'emprunter » — à refuser explicitement si ce n'est pas voulu |
| Durée de vie `pending` ≥ fenêtre de retrait | Sinon une réservation peut expirer avant même d'avoir pu être retirée |

Les durées sont stockées **en jours**, pas en semaines : les constantes actuelles
sont exprimées en semaines, ce qui interdit une durée de 10 jours sans raison.
