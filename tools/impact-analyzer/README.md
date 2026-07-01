# Impact Analyzer (ENABLING-1023)

Cartographie, pour chaque export public des packages `@edifice.io/*`, quelles
apps React consommatrices l'utilisent, où, et avec quel niveau de risque.
Voir `PLAN-impact-analyzer.md` à la racine du repo pour le cadrage complet.

Ce package couvre les **Jalons 0 à 3** du plan : registre des apps, cœur
JS/TS (`ts-morph`), cœur CSS/Sass, et un graphe explorable. Les jalons 4 à 7
(CRON, classification de diff, commentaire PR, rapport QA, CLI) ne sont pas
encore implémentés.

## Prérequis

- Les repos des apps consommatrices doivent être clonés en frères de ce repo
  (`../<repo>` par défaut, ex. `/Volumes/Work/communities` si ce repo vit
  dans `/Volumes/Work/edifice-frontend-framework`). Chemin racine
  surchageable via `IMPACT_ANALYZER_REPOS_ROOT`.
- **Aucune branche n'est jamais checkout/fetch/pull automatiquement** sur ces
  repos frères : l'outil lit uniquement l'état actuellement présent sur
  disque (branche, SHA, dirty) et le restitue tel quel — jamais de mutation
  du working tree d'un autre repo.

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
- `viewer/` — sous-package Vite + React, consomme l'index, aucune vue graphe
  (Cytoscape/D3) pour l'instant : tableaux filtrables uniquement.

## Config statique notable

`config/ff-entry-map.json` fait le lien `exports` déclaré → fichier source,
car cette convention diffère par package FF (voir commentaires dans
`src/ff-map/entry-points.ts`) — pas de dérivation générique fiable. Un test
(`entry-points.spec.ts`) échoue si un nouveau subpath apparaît dans un
`package.json` FF sans entrée correspondante ici.

## Limites connues (V1, Jalons 0-3)

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
- Pas encore de classification de diff (🔴/🟠/🟡), de score de risque, de
  commentaire PR, de rapport QA, ni de CLI `impact <symbole>` — jalons 4 à 7,
  hors scope de cette passe.
