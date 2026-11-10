# ENABLING-1009 — rack

## Faits vérifiés

**Config build** : `inlineDynamicImports: true` confirmé (`vite.config.ts:104-120`). `base: '/rack'`, `assetsDir: 'public'`, `chunkSizeWarningLimit: 5000`. Build actuel présent dans le repo : `dist/public/index-*.js` = **6,7 Mo en un seul fichier**, preuve concrète du bundle monolithique actuel.

**Surface de lazy loading** (8 points, tous liés à un même module lourd) :
- 5 routes (`routes/index.tsx`) : `/`, `/`, `/inbox`, `/deposits`, `/trash`
- 1 route (`/collect/*`) et 2 `lazy()` React (`pages/Root.tsx`, `CollectMenu`/`CollectAppActionHeader`) qui importent tous **`@edifice.io/collect-frontend/lib`**

**Point clé** : `@edifice.io/collect-frontend` embarque **antd**, **react-pdf** et **pdfjs-dist** (confirmé dans son `package.json`) — des libs volumineuses (UI kit + rendu PDF). Ces libs n'apparaissent dans le bundle de rack **que via ce module lazy**. Après le fix, elles sortiront dans un ou plusieurs chunks séparés potentiellement lourds : c'est la fonctionnalité "Collect" (dépôt/consultation de documents) qui concentre l'essentiel du risque et de la valeur du fix sur cette app.

**Déploiement** : Vite injecte correctement les balises `<script>` (vérifié sur `dist/index.html`), pas de template figé, aucune CSP/SRI/SW. Pas de CI GitHub Actions (Jenkins).

**Tests** : **zéro** fichier de test dans tout `frontend/` (ni unit, ni e2e), malgré `vitest`/`msw` en devDependencies.

## ROAM spécifique

| Type | Constat |
|---|---|
| **O**wned | Couplage fort avec le module Collect embarqué (voir aussi [collect](12-collect.md)) — dev assigné à ENABLING-1009 doit coordonner avec celui de ENABLING-1012, et tester spécifiquement le flux "Collect" (dépôt, consultation PDF) après le fix, pas seulement les routes natives de rack. |
| **A**ccepted | Zéro test automatisé — re-test manuel intégral, avec une attention renforcée sur le module Collect (impact utilisateur élevé si le rendu PDF casse). |

## Charge QA
Moyenne en nombre de points (8), mais **impact potentiel élevé** si un problème survient sur le module Collect (rendu PDF, antd) — à tester en priorité, en coordination avec la validation de [ENABLING-1012 (collect)](12-collect.md).
