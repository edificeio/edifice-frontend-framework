# Impact Analyzer (ENABLING-1023)

Cartographie, pour chaque export public des packages `@edifice.io/*`, quelles
apps React consommatrices l'utilisent, où, et avec quel niveau de risque.
Voir `PLAN-impact-analyzer.md` à la racine du repo pour le cadrage complet.

Ce package couvre les **Jalons 0 à 3, 5 et 7** du plan : registre des apps,
cœur JS/TS (`ts-morph`), cœur CSS/Sass, graphe explorable, classification de
diff (🔴/🟠/🟡 + score de risque) et CLI locale. Les Jalons 4 (CRON/accès
GitHub CI) et 6 (commentaire PR, canal de diffusion QA) ne sont pas encore
implémentés — décisions encore ouvertes (accès GitHub, canal QA).

## Prérequis

- Les repos des apps consommatrices doivent être clonés en frères de ce repo
  (`../<repo>` par défaut, ex. `/Volumes/Work/communities` si ce repo vit
  dans `/Volumes/Work/edifice-frontend-framework`). Chemin racine
  surchageable via `IMPACT_ANALYZER_REPOS_ROOT`.
- **Aucune branche n'est jamais checkout/fetch/pull automatiquement** sur ces
  repos frères : l'outil lit uniquement l'état actuellement présent sur
  disque (branche, SHA, dirty) et le restitue tel quel — jamais de mutation
  du working tree d'un autre repo.
- `impact diff` matérialise la branche `base` du FF **dans ce repo** via un
  `git worktree` jetable (jamais de checkout sur le worktree principal),
  puis symlink `node_modules` (racine + chaque `packages/*/node_modules`)
  dedans — nécessaire pour que `ts-morph` résolve correctement les types
  externes ; sans ça, des changements fantômes apparaissent sur des fichiers
  non touchés. `pnpm install` doit donc avoir tourné sur ce repo.

## Usage

```bash
# Génère l'index JSON pour l'état courant du disque (FF + apps du registre)
pnpm --filter @edifice.io/impact-analyzer generate:local

# Tests
pnpm --filter @edifice.io/impact-analyzer test

# Graphe explorable (recherche par symbole / par app)
pnpm --filter @edifice.io/impact-analyzer-viewer dev
# ou, sur le build de prod :
pnpm --filter @edifice.io/impact-analyzer-viewer build
pnpm --filter @edifice.io/impact-analyzer-viewer preview

# CLI locale (Jalon 7)
tsx src/cli.ts symbol Dropdown              # recherche un symbole, régénère l'index à la volée
tsx src/cli.ts symbol Dropdown --cached     # relit data/index.<branche>.json au lieu de régénérer
tsx src/cli.ts diff --base=develop          # classification 🔴/🟠/🟡 + score de risque (défaut: develop)
```

L'index est écrit dans `data/index.<branche-ff-courante>.json` (gitignored,
régénéré à la demande). Le viewer synchronise ce dossier vers
`viewer/public/data/` avant `dev`/`build` (`viewer/scripts/sync-data.mjs`).

## Registre des apps (`apps.json`)

Liste manuelle, maintenue à la main (une PR d'une ligne par app ajoutée/
retirée), pas d'auto-discovery. Le champ `branches` est **documentaire**
(quelles branches V1 existent réellement pour cette app) — en mode local, il
ne sert jamais à choisir quoi checkout : l'outil lit toujours la branche
réellement présente sur disque, quelle qu'elle soit.

## Architecture

- `src/registry/` — chargement/validation de `apps.json`.
- `src/discovery/` — résolution des repos frères (branche/SHA/dirty en
  lecture seule) + lecture des pins `@edifice.io/*` dans les `package.json`.
- `src/ff-map/` — table `export public → fichiers source` pour
  `react`/`client`/`utilities`/`tiptap-extensions`/`rest-client-base`, via
  `ts-morph`. Les subpaths `./icons*` sont agrégés (voir
  `icons-aggregator.ts`) tout en restant individuellement cherchables.
- `src/app-usage/` — résolution des imports `@edifice.io/*` (nommés, alias,
  namespace) dans le code de chaque app, comptage des **sites d'usage
  réels** (pas juste la ligne d'import), et détection des imports **hors
  contrat** (chemins non déclarés dans `exports`).
- `src/css/` — analyseur Sass : classes par `components/_<name>.scss`,
  corrélation avec le composant React homonyme, grep des classes dans le
  code des apps, détection d'impact global (`themes/`, `tokens/`,
  `abstracts/`, `base/`).
- `src/index-builder/` — assemble tout dans l'index JSON versionné
  (`src/types/index-schema.ts` = source de vérité du schéma).
- `src/diff/` — classification de diff base vs head (Jalon 5) :
  `snapshot.ts` matérialise `base` dans un `git worktree` jetable (jamais de
  mutation du worktree principal), `signature-shape.ts`/
  `cosmetic-normalize.ts` comparent la forme et le corps d'un symbole de
  façon syntaxique (jamais via le type-checker, dont `type.getText()` fuite
  le chemin absolu du fichier), `symbol-diff.ts`/`css-diff.ts` produisent le
  `DiffReport` (`src/types/diff-schema.ts`, séparé de `ImpactIndex`),
  `risk-score.ts` calcule le score (pondérations à calibrer avec la QA).
- `src/cli/` — sous-commandes CLI (Jalon 7) : `generate-command.ts`,
  `symbol-command.ts`, `diff-command.ts`, `format-table.ts` (alignement de
  colonnes fait main). `src/cli.ts` est un simple routeur.
- `viewer/` — sous-package Vite + React, consomme l'index, aucune vue graphe
  (Cytoscape/D3) pour l'instant : tableaux filtrables uniquement.

## Config statique notable

`config/ff-entry-map.json` fait le lien `exports` déclaré → fichier source,
car cette convention diffère par package FF (voir commentaires dans
`src/ff-map/entry-points.ts`) — pas de dérivation générique fiable. Un test
(`entry-points.spec.ts`) échoue si un nouveau subpath apparaît dans un
`package.json` FF sans entrée correspondante ici.

## Limites connues

- **`kind` des symboles est une heuristique**, pas une vérité absolue (ex. un
  composant construit via `Object.assign(Root, {...})` — pattern utilisé par
  `Dropdown` — est classé `const`, pas `component`). La corrélation CSS en
  tient compte (elle accepte `component` et `const` comme candidats), mais
  d'autres usages du champ `kind` peuvent être affectés.
- **CSS = confiance partielle** : classes construites dynamiquement
  (template strings) invisibles au grep statique ; `confidence` explicite
  par composant, jamais présenté comme exhaustif.
- **Une seule passe de profondeur** pour les ré-exports internes à une app
  (pas de récursion sur tout son graphe applicatif).
- **Mode local uniquement** : reflète l'état du disque au moment du run, pas
  forcément synchronisé avec un dernier index CI (qui n'existe pas encore —
  Jalon 4).
- **Registre manuel** : rien ne garantit qu'une nouvelle app migrée soit
  ajoutée à `apps.json` au bon moment.
- **Classification de diff par symbole directement touché, pas de
  propagation transitive** : si `interface Props` change de forme mais que
  `function Button(props: Props)` ne change pas syntaxiquement dans sa
  propre déclaration, `Props` est flaggé mais `Button` ne l'est pas
  automatiquement.
- **Renommages locaux non filtrés par la normalisation cosmétique** : un
  renommage pur de variable locale (sans changement de logique) compte comme
  un vrai changement de corps (🟡) — sur-signalement assumé plutôt que
  risquer de masquer un changement réel déguisé en renommage. De même, un
  changement de style de guillemets (`'x'` → `"x"`) ne serait pas filtré —
  non-problème dans ce repo grâce à `singleQuote: true` côté Prettier.
- **Fichier CSS composant supprimé entre base et head** : reste dans le
  rapport de diff, mais avec une confiance indéterminée (repli `needs-review`)
  plutôt que d'être silencieusement omis.
- **Pas encore** de CRON, d'accès GitHub/CI, de commentaire automatique sur
  PR, de rapport QA formel, ni de canal de diffusion — Jalons 4 et 6, hors
  scope de cette passe (décisions encore ouvertes : accès GitHub, canal QA).
