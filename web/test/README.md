# Tests du front

```bash
npm test          # une passe
npm run test:watch
npm run typecheck # tsc --noEmit, ne fait pas tourner les tests
```

Vitest + happy-dom. **Aucun navigateur n'est installé** : pas de Playwright,
pas de Chromium. C'est délibéré (`.claude/CLAUDE.md`).

---

## Ce que couvre cette suite

| Fichier | Ce qu'il tient |
|---|---|
| `components.smoke.spec.ts` | Chaque composant est importé et monté une fois. **C'est le filet de la migration.** |
| `lit-class-fields.spec.ts` | Le motif `declare` de TS-012, démontré dans les deux sens |
| `components/search-bar-bks.spec.ts` | Le composant partagé le plus exposé, en détail |
| `api/borrowing.spec.ts` | La convention `error.status`, épinglée avant que TS-006 la remplace |

### Pourquoi monter suffit

Le bug que TS-012 signale — un champ de classe qui masque l'accesseur réactif
de Lit — ne produit **aucune erreur de compilation**. Le composant s'affiche et
cesse simplement de se mettre à jour.

Le build de développement de Lit vérifie lui-même ce cas, à
`connectedCallback`, sur **toutes** les propriétés réactives déclarées, et lève
une exception :

> The following properties on element `<tag>` will not trigger updates as
> expected because they are set using class fields: …

Monter chaque composant une fois suffit donc à couvrir toute cette classe de
bug. Il n'y a rien à écrire par composant.

> ⚠️ Cette vérification **n'existe que dans le build de développement**. Vite
> et Vitest résolvent la condition d'export `development` par défaut : elle est
> active sans rien configurer. Faire tourner la suite avec la condition
> `production` la désactiverait en silence, et le filet ne tiendrait plus rien.

La liste des composants est **découverte** par `import.meta.glob`, pas écrite à
la main : convertir un composant de `.js` en `.ts` le laisse couvert, et en
ajouter un le couvre automatiquement. La convention supposée est celle du
dépôt — `foo-bar.js` dans `foo-bar/` définit `<foo-bar>`.

---

## Ce que cette suite ne couvre pas

happy-dom n'est pas un navigateur. **Un vert ici ne veut pas dire que l'écran
est correct.**

- **Pas de mise en page, pas de cascade CSS réelle.** Le bug de spécificité de
  `search-bar-bks` documenté dans `.claude/CLAUDE.md` — `sharedStyles` listé en
  dernier qui écrase `select[name='availability']` — **ne serait pas détecté
  ici**.
- **Pas de caméra, pas de canvas.** `barcode-scanner-bks` se monte, mais ZXing
  et `getUserMedia` ne sont pas exercés.
- **Pas de vrai téléversement de fichier**, ni de rendu d'image de couverture.
- **`booksnap-app` est hors du périmètre** : son routeur Vaadin s'installe dans
  `firstUpdated` sur un `<main>` réel. C'est le sujet de TS-015.

**La recette manuelle de TS-001 reste nécessaire.** Cette suite ne la remplace
pas : elle prend la classe de bug que la recette attrape le plus mal et la rend
automatique.

---

## `setup.ts` : les manques de happy-dom

Un seul pour l'instant : `attachInternals()` n'est pas implémenté.
`button-bks` l'appelle dans son constructeur, et comme presque tout affiche un
`<button-bks>`, ce seul manque faisait échouer 11 composants sur 27.

Garder ce fichier court. Chaque entrée doit être une API du navigateur absente
de happy-dom — jamais un contournement d'un problème du projet.
