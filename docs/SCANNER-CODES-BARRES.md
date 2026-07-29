# Scanner : pourquoi les QR codes étaient rapides et les codes-barres lents

> Analyse et correction de la lenteur de détection des codes-barres EAN-13 dans
> l'onglet « Scan Barcode » de la vue Add Book.

Versions concernées : `@zxing/browser` 0.2.1, `@zxing/library` 0.23.0.

---

## Table des matières

- [1. Le symptôme](#1-le-symptôme)
- [2. Ce qui n'était pas en cause](#2-ce-qui-nétait-pas-en-cause)
- [3. Les trois causes réelles](#3-les-trois-causes-réelles)
- [4. La correction](#4-la-correction)
- [5. Pourquoi les trois changements se tiennent](#5-pourquoi-les-trois-changements-se-tiennent)
- [6. Réglages si les performances posent problème](#6-réglages-si-les-performances-posent-problème)
- [7. Pistes suivantes](#7-pistes-suivantes)
- [8. Ce qui n'a pas été vérifié](#8-ce-qui-na-pas-été-vérifié)
- [Annexe : `npm run lint` n'exécute jamais Prettier](#annexe--npm-run-lint-nexécute-jamais-prettier)

---

## 1. Le symptôme

Le scanner de QR codes (`/scan`, vue `scan-qrcode-view`) détecte quasi
instantanément. Le scanner de codes-barres de livres (`/add`, onglet « Scan
Barcode ») met plusieurs secondes, voire échoue, sur un EAN-13 d'ISBN.

Le point de départ de l'analyse est important : **les deux vues utilisent le même
composant `barcode-scanner-bks`, avec la même configuration**. Il n'y avait donc
aucun réglage erroné côté Add Book. La différence tient à la nature même des
symbologies 1D par rapport aux 2D, combinée à une valeur par défaut de la
bibliothèque qui pénalise lourdement les premières.

Pourquoi un QR code est intrinsèquement plus facile :

| | QR code (2D) | EAN-13 (1D) |
|---|---|---|
| Localisation | motifs de repérage (« finder patterns ») aux angles | aucun repère dédié |
| Rotation | invariant | doit être à peu près horizontal |
| Lecture | matrice entière | il faut **une ligne de balayage propre traversant tout le symbole** |
| Correction d'erreur | Reed-Solomon, tolérante | somme de contrôle uniquement |

Autrement dit : un QR code est presque toujours décodé à la **première**
tentative, un code-barres non.

---

## 2. Ce qui n'était pas en cause

Une hypothèse plausible a été écartée par lecture du code : la résolution de
capture.

`BrowserCodeReader.getMediaElementDimensions()`
(`node_modules/@zxing/browser/esm/readers/BrowserCodeReader.js:279`) lit
`videoWidth` / `videoHeight`, c'est-à-dire les dimensions **intrinsèques** du flux,
et non la taille CSS de l'élément `<video>`. Le canvas de capture est donc créé en
1280×720 quelle que soit la mise en page. La taille d'affichage du composant
n'entrait pas en jeu.

---

## 3. Les trois causes réelles

### 3.1 Deux tentatives de décodage par seconde

`BrowserCodeReader.js:63` :

```js
var defaultOptions = {
    delayBetweenScanAttempts: 500,
    delayBetweenScanSuccess: 500,
    tryPlayVideoTimeout: 5000,
};
```

Les tentatives sont **sérialisées** : décodage → attente de 500 ms → décodage
(`BrowserCodeReader.js:1131`). Soit deux tentatives par seconde.

Pour un QR code réussi du premier coup, ce délai est invisible. Pour un EAN-13 qui
échoue plusieurs fois avant d'aboutir, chaque échec coûte une demi-seconde. **C'est
la cause dominante.**

### 3.2 Sept lecteurs exécutés à chaque image

Sans indication de format, `MultiFormatReader.decodeInternal()`
(`node_modules/@zxing/library/esm/core/MultiFormatReader.js:154-161`) empile :

```
MultiFormatOneDReader, QRCodeReader, MicroQRCodeReader,
DataMatrixReader, AztecReader, PDF417Reader, MaxiCodeReader
```

Et `MultiFormatOneDReader`, lui-même sans indication, instancie **toutes** les
symbologies 1D (Code 39, Code 128, ITF, Codabar, RSS…) alors qu'un livre n'est
jamais qu'un EAN-13. L'essentiel de ce travail est perdu, et c'est ce qui rend
chaque tentative coûteuse.

### 3.3 Vingt-cinq lignes de balayage, sans reprise en rotation

`OneDReader.doDecode()`
(`node_modules/@zxing/library/esm/core/oned/OneDReader.js:93-107`) :

```js
var tryHarder = hints && (hints.get(DecodeHintType.TRY_HARDER) === true);
var rowStep = Math.max(1, height >> (tryHarder ? 8 : 5));
var maxLines;
if (tryHarder) {
    maxLines = height; // Look at the whole image, not just the center
}
else {
    maxLines = 25; // 25 rows spaced 1/32 apart covers roughly 78% of image height
}
```

Sans `TRY_HARDER`, sur une image de 720 px de haut : `rowStep = 22`, et seulement
**25 lignes sur 720** sont examinées, réparties autour du centre. De plus,
`OneDReader.js:44-45` conditionne la reprise sur l'image pivotée à 90° à ce même
`TRY_HARDER` :

```js
var tryHarder = hints && (hints.get(DecodeHintType.TRY_HARDER) === true);
if (tryHarder && image.isRotateSupported()) {
```

Conséquence : le code-barres devait être tenu à la fois **centré et de niveau**
pour avoir une chance d'être lu. Le décodage QR n'a aucune contrainte équivalente.

---

## 4. La correction

Une propriété `mode` a été ajoutée à `barcode-scanner-bks` — valeurs `'qr'`,
`'barcode'` ou `'all'` (défaut) — et le lecteur est désormais construit dans
`startScanner()` plutôt que dans le constructeur, afin que l'attribut soit déjà
appliqué au moment où les *hints* sont décidés.

`web/src/features/scanner/barcode-scanner-bks/barcode-scanner-bks.js` :

```js
const FORMATS_BY_MODE = {
  qr: [BarcodeFormat.QR_CODE],
  barcode: [
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
  ],
};

const DELAY_BETWEEN_SCAN_ATTEMPTS = 100;

createCodeReader() {
  const hints = new Map();
  const formats = FORMATS_BY_MODE[this.mode];

  if (formats) {
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
  }

  if (this.mode === 'barcode') {
    hints.set(DecodeHintType.TRY_HARDER, true);
  }

  return new BrowserMultiFormatReader(hints, {
    delayBetweenScanAttempts: DELAY_BETWEEN_SCAN_ATTEMPTS,
  });
}
```

Les deux appelants déclarent leur mode :

| Vue | Balise | Formats | `TRY_HARDER` |
|---|---|---|---|
| `scan-qrcode-view` | `<barcode-scanner-bks autoStart mode="qr">` | QR_CODE | non |
| `add-book-view` | `<barcode-scanner-bks mode="barcode">` | EAN-13, EAN-8, UPC-A, UPC-E | oui |

Le défaut `'all'` conserve le comportement historique pour tout futur appelant qui
ne préciserait rien.

---

## 5. Pourquoi les trois changements se tiennent

Ils ne sont pas indépendants — c'est la restriction des formats qui rend les deux
autres soutenables :

1. **Restreindre les formats** divise le travail par tentative (un seul lecteur au
   lieu de sept, et une seule symbologie 1D au lieu de la dizaine).
2. Ce budget libéré **finance le passage de 500 ms à 100 ms**, soit environ cinq
   fois plus de tentatives par seconde.
3. Il finance aussi **`TRY_HARDER`**, qui augmente le taux de réussite de chaque
   tentative (toutes les lignes plutôt que 25, plus la reprise en rotation).

Cadence plus élevée **et** meilleur taux de réussite par tentative : les deux
leviers jouent dans le même sens.

---

## 6. Réglages si les performances posent problème

Le paramètre à surveiller est `TRY_HARDER` : il fait passer le balayage de 25
lignes à environ 360, soit un coût CPU nettement supérieur par tentative. Sur un
téléphone ancien, une tentative pourrait devenir assez lente pour annuler le gain
de cadence.

Ordre de repli recommandé, du plus sûr au plus radical :

1. Retirer la ligne `hints.set(DecodeHintType.TRY_HARDER, true)`.
2. Remonter `DELAY_BETWEEN_SCAN_ATTEMPTS` de `100` à `200`.
3. En dernier recours seulement, revenir au défaut de 500 ms.

La restriction des formats (`POSSIBLE_FORMATS`) est un gain sans contrepartie :
elle n'a aucune raison d'être retirée.

---

## 7. Pistes suivantes

Si la détection reste insuffisante après les réglages ci-dessus, deux leviers non
exploités :

- **La mise au point.** `barcode-scanner-bks.js` passe
  `advanced: [{ focusMode: 'continuous' }]` dans les contraintes de
  `getUserMedia()`. Cette contrainte est très largement ignorée par les
  navigateurs. Or les barres fines d'un EAN-13 sont bien plus sensibles à la netteté
  qu'un QR code. L'appliquer via `track.applyConstraints()` **après** le démarrage
  du flux serait plus fiable.
- **La résolution.** Les contraintes demandent 1280×720. Passer à 1920×1080 en
  `ideal` donnerait plus de pixels horizontaux aux barres fines — au prix d'un
  décodage plus lourd par tentative. À n'envisager qu'après le point précédent.

---

## 8. Ce qui n'a pas été vérifié

La correction n'a **pas** été testée sur un vrai code-barres de livre avec une vraie
caméra : cela demande un appareil. Elle repose sur la lecture du code source de la
bibliothèque, dont les références sont données ci-dessus, et sur une compilation et
un lint sans régression.

Le test à faire : ouvrir `/add`, onglet « Scan Barcode », scanner un ISBN — et
vérifier au passage que le scanner QR de `/scan` n'a pas régressé, puisque son mode
a également changé.

---

## Annexe : `npm run lint` n'exécute jamais Prettier

Découvert pendant cette analyse, sans rapport avec le scanner mais utile à savoir.

`web/package.json:13` :

```json
"lint": "eslint --ext .js,.html . --ignore-path .gitignore && prettier \"**/*.js\" --check --ignore-path .gitignore"
```

L'opérateur `&&` n'enchaîne sur Prettier que si ESLint sort avec le code 0. Or
ESLint remonte 11 erreurs préexistantes et sort donc avec le code 1 : **la
vérification Prettier n'a jamais tourné**.

Conséquence : le dépôt n'est pas conforme à Prettier 3.9.5. Même des fichiers
jamais modifiés échouent à `prettier --check`. Lancer `prettier --write` sur un
fichier le reformate donc dans un style différent de tout le reste du code — c'est
arrivé pendant ce travail, et le reformatage a été annulé puis les modifications
réappliquées à la main.

Deux options si l'on veut réellement appliquer Prettier :

- remplacer `&&` par `;` pour que les deux outils tournent toujours, puis traiter
  le reformatage global en un commit dédié ;
- ou corriger d'abord les 11 erreurs ESLint, ce qui débloquera Prettier de
  lui-même — avec le même reformatage massif à absorber.

Dans les deux cas, mieux vaut isoler le reformatage dans son propre commit pour ne
pas noyer les changements fonctionnels.

---

## Fichiers modifiés

| Fichier | Changement |
|---|---|
| `web/src/features/scanner/barcode-scanner-bks/barcode-scanner-bks.js` | propriété `mode`, `FORMATS_BY_MODE`, `createCodeReader()`, lecteur construit au démarrage |
| `web/src/views/add-book-view/add-book-view.js` | `mode="barcode"` |
| `web/src/views/scan-qrcode-view/scan-qrcode-view.js` | `mode="qr"` |
