# ENABLING-1001 — actualites

## Faits vérifiés

**Config build** (`frontend/vite.config.ts:101-115`) : `inlineDynamicImports: true` confirmé, seule option de `rollupOptions.output` (pas de `manualChunks`). `base: '/actualites'` en prod, `assetsDir: 'public'`, `chunkSizeWarningLimit: 4000`.

**Surface de lazy loading** (~10 chunks attendus) :
- 2 modales : `TextSimplifier` (FALC, `InfoDetailsFormEditor.tsx:12`), `AudienceModal` (`InfoCardFooter.tsx:11`)
- 8 routes (`src/routes/index.tsx`) : Root, InfoWorkflow (création/édition), InfoWorkflowDetails, InfoWorkflowRights, AdminThreads, ThreadsSetting, Threads, InfoPrint, ancien format (`old-format`)

**Déploiement** : `DisplayController.java` sert `index.html` via `renderView(...)` (pattern entcore générique), aucune whitelist de fichiers statiques, aucune CSP/SRI/service worker. `.github/workflows/tests.yml` ne teste que du Vitest unitaire, aucune assertion sur le bundle.

**Tests** : aucun test e2e/Playwright dans le repo. Des tests unitaires Vitest existent mais ne couvrent pas le chargement runtime des chunks.

## ROAM spécifique

| Type | Constat |
|---|---|
| **A**ccepted | Pas de `manualChunks` défini : le retrait du flag laissera Rollup découper par défaut, potentiellement en petits chunks nombreux — acceptable, à observer en recette plutôt qu'à sur-optimiser avant coup. |
| **A**ccepted | Aucun test automatisé (unit ou e2e) ne couvre le lazy loading → tout le re-test repose sur la QA manuelle. |
| **M**itigated | `chunkSizeWarningLimit: 4000` à réajuster après le fix une fois la taille réelle des chunks connue. |

## Charge QA
~10 points à valider manuellement : les 8 routes listées + les 2 modales, en particulier le workflow de création/édition/droits d'une info (le cœur métier de l'app) et le mode "ancien format".
