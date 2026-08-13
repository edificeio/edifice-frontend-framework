# @edifice.io/figma-sync

Synchronise les variables Figma (primitives + sémantiques) vers
`packages/bootstrap/src/themes/configs/`, à partir des exports produits par le
plugin Figma "Edifice Token Extractor". Remplace le copier/coller manuel
(~160 valeurs) par un outil qui réécrit les fichiers directement, avec
`git diff` comme mécanisme de revue — pas de PR automatique.

## Périmètre

L'outil ne touche que les 7 fichiers de
`packages/bootstrap/src/themes/configs/` :

- `_primitives.scss`, `_primitives-legacy.scss` (fichiers plats, `$var: value;`)
- `_one.scss`, `_neo.scss`, `_crna.scss`, `_edifice1d.scss`, `_edifice2d.scss`
  (maps SCSS imbriquées, une par thème)

Il ne modifie **jamais** les lignes `@use`/`@forward` en tête de ces fichiers
(voir "Cas particulier : primitives-legacy namespacé" plus bas — c'est un choix
délibéré, pas un oubli), ni aucun fichier en dehors de `themes/configs/`.

## 1. Exporter depuis Figma

Le plugin "Edifice Token Extractor" (`tools/figma-sync/figma-plugin/`, voir
son propre `README.md` pour l'installation) ne fonctionne que dans l'app
**desktop** Figma — un plugin local ne peut pas être lancé depuis Figma dans
le navigateur (confirmé, y compris via la doc officielle Figma).

1. Ouvrir Figma desktop sur le fichier de primitives (**Edifice_UIKit**) puis
   sur le fichier sémantique (**EdificeLibrary_Web**).
2. Lancer le plugin sur chacun, exporter le JSON.
3. Récupérer les deux fichiers : `primitives.json` (3 collections Figma :
   `primitives`, `primitivesLegacy`, `text`) et `semantic.json` (un mode par
   thème : `one`, `neo`, `CRNA`, `edifice1d`, `edifice2d`).

## 2. Lancer le script

```bash
cd tools/figma-sync
pnpm install   # une seule fois
pnpm sync -- --primitives <chemin/primitives.json> --semantic <chemin/semantic.json>
```

Options (`tsx src/cli.ts --help` n'existe pas, mais voici les flags) :

| Flag | Défaut | Usage |
| --- | --- | --- |
| `--primitives <fichier>` | *(obligatoire)* | export primitives.json |
| `--semantic <fichier>` | *(obligatoire)* | export semantic.json |
| `--repo-root <chemin>` | `cwd` | racine du repo (pour retrouver `packages/bootstrap/...`) |
| `--report <chemin>` | `report.json` | où écrire le rapport |
| `--skip-compile-check` | off | **ne jamais utiliser sur le vrai repo** — saute la validation Sass réelle |
| `--skip-format` | off | **ne jamais utiliser sur le vrai repo** — saute prettier/stylelint |

Les deux flags `--skip-*` existent uniquement pour expérimenter en dehors du
vrai repo (ex : environnement sans `sass`/`prettier`/`stylelint` installés).

## 3. Ce que fait le script, dans cet ordre

1. **Patch des 7 fichiers en mémoire** (`orchestrate.ts`) — valeurs modifiées
   in-place (diff minimal), nouveaux tokens ajoutés (sous un commentaire
   horodaté pour les fichiers plats, nouvelles sous-maps créées automatiquement
   pour les fichiers de thème, positionnées selon l'ordre d'apparition dans le
   JSON Figma — jamais alphabétique, jamais "à la fin" par défaut), tokens
   disparus de Figma signalés dans le rapport sans être supprimés.
2. **Vérification d'équilibre des parenthèses** sur chaque fichier patché, en
   mémoire — abandon sans rien écrire si un fichier est déséquilibré (bug du
   script, jamais une intention).
3. **Compilation Sass réelle** (`sass`, mêmes flags exacts que
   `pnpm --filter bootstrap compile`) dans une copie temporaire de
   `packages/bootstrap/src` (le `node_modules` réel est symlinké, jamais copié)
   — abandon sans rien écrire si la compilation échoue.
4. **Écriture des 7 vrais fichiers**, seulement maintenant que tout est validé.
5. **`prettier --write` puis `stylelint --fix`** — les vrais outils/config du
   projet, jamais une réimplémentation des règles de style — sur les fichiers
   modifiés.
6. **Re-vérification Sass finale**, par sécurité, après le formatage.
7. **Écriture du rapport** (`report.json`).

Si l'étape 2 ou 3 échoue, **rien n'est écrit dans le vrai repo**. Si l'étape 5
ou 6 signale un problème après l'étape 4, les fichiers sont déjà écrits (avec
un message d'avertissement clair) — à corriger manuellement, jamais annulé
automatiquement.

## 4. Lire le rapport

```jsonc
{
  "files": {
    "_edifice2d.scss": {
      "changes": [{ "key": "color.primary.default", "from": "$old", "to": "$new" }],
      "added": ["color.app.communicate"],
      "unplaced": []
    }
    // ...
  },
  "warnings": [
    {
      "theme": "edifice2d",
      "token": "color/support/danger/200",
      "message": "Theme \"edifice2d\" resout ... via primitivesLegacy (probable erreur design, attendu seulement pour one/neo)"
    }
  ],
  "guessedNames": [
    { "bucket": "primitives", "figmaName": "weird/newThing", "file": "primitives", "scssVar": "weird-new-thing" }
  ],
  "skippedThemes": []
}
```

- **`files[fichier].changes`** : valeurs modifiées (à relire dans le diff git).
- **`files[fichier].added`** : tokens nouveaux, ajoutés en fin de fichier plat
  ou dans une nouvelle sous-section de map.
- **`files[fichier].unplaced`** : cas limite — même le conteneur racine
  attendu (`color`/`font`/`radius`...) est absent du fichier ; le token est
  signalé en commentaire `// à intégrer manuellement`, jamais inventé.
- **`warnings`** : un thème *autre que* `one`/`neo` résout un token via la
  collection `primitivesLegacy` — probable erreur de design côté Figma (sauf
  `color/app/*`, qui le fait par conception pour les 5 thèmes, jamais un
  warning). Non bloquant, mais à vérifier.
- **`guessedNames`** — **à relire en priorité** : primitives dont le nom SCSS a
  été déduit par kebab-case générique (`confidence: "guessed"`), faute
  d'exception connue et vérifiée contre le repo. Le reste (`confidence:
  "certain"`) vient d'une table d'exceptions explicite (`PRIMITIVES_OVERRIDES`,
  `LEGACY_OVERRIDES`, ou une règle de préfixe vérifiée comme `danger/*` →
  `legacy-danger-*`). Si Figma introduit une nouvelle primitive qui atterrit
  ici, c'est le signal qu'il faut soit ajouter une exception dans
  `src/naming/resolve-primitive-target.ts`, soit accepter le nom généré.
- **`skippedThemes`** : mode présent dans `THEME_MODE_TO_FILE` mais absent de
  l'export sémantique fourni — ignoré, pas une erreur.

## 5. Cas particulier : `primitives-legacy` namespacé

`_one.scss` et `_neo.scss` importent `primitives-legacy` en global
(`@use 'primitives-legacy' as *;`) — littéralement construits dessus. Les
trois autres thèmes (`_crna.scss`, `_edifice1d.scss`, `_edifice2d.scss`)
l'importent namespacé (`@use 'primitives-legacy' as legacy;`), pour le cas
`color/app/*` qui résout volontairement via cette collection même hors
one/neo. Le script en tient compte automatiquement (`buildLegacyVarReference`
dans `src/semantic/resolve-semantic-token.ts`) : il génère `legacy.$var` pour
ces trois thèmes et `$var` nu pour one/neo — mais **n'ajoute jamais la ligne
`@use` lui-même**. Si un nouveau fichier de thème est créé, ou si un thème
existant n'a pas encore cet import et qu'un token `primitivesLegacy` doit s'y
ajouter, il faut ajouter la ligne à la main avant de lancer le script (sinon
la compilation Sass échouera à l'étape 3, et le script s'arrêtera sans rien
écrire).

## 6. Tests

```bash
pnpm test
```

Tests unitaires purs (pas d'I/O réelle) sur chaque module de résolution/patch,
plus un test d'orchestration bout-en-bout (`src/orchestrate.spec.ts`) qui
exerce tout le pipeline de patch sur des données synthétiques. La validation
Sass/prettier/stylelint réelle (étapes 3, 5, 6 du pipeline) n'est pas
unit-testée — elle appelle les vrais binaires du repo — mais a été vérifiée
manuellement contre le vrai repo pendant le développement de l'outil.

## 7. Ce que l'outil ne fait pas (volontairement)

- Pas d'automatisation CI pour l'instant (jugé prématuré) — usage manuel,
  revu via `git diff` avant commit.
- Pas de suppression automatique des tokens disparus de Figma — signalés dans
  `report.json`, jamais supprimés du fichier.
- Pas de modification des lignes `@use`/`@forward` (voir section 5).
- Pas de création de fichier de thème : les 7 fichiers doivent déjà exister.
