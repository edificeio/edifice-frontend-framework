# ENABLING-1007 — homeworks

## Faits vérifiés

**Config build** : `inlineDynamicImports: true` confirmé (`vite.config.ts:110-122`), introduit dès le commit de migration initial vers React (`3dc8cb3`, #ENABLING-859) — simple copie du boilerplate, sans particularité. `base: '/homeworks'`, `assetsDir: 'public'` (non standard, défaut Vite serait `assets`), `chunkSizeWarningLimit: 4000`. Build actuel confirmé mono-fichier (`dist/public/index-*.js` unique).

**Surface de lazy loading** — la plus faible du périmètre : 3 routes seulement (`routes/index.tsx`) : root (layout), explorer (liste, wrap `ode-explorer`), notebook (`id/:resourceId`, détail cahier de texte).

**Déploiement** : `HomeworksController.java` sert via `renderView(...)`, pattern standard. Pas de CI GitHub Actions (Jenkins), aucune CSP/SRI/SW.

**Tests** : aucun e2e/Playwright. Tests unitaires Vitest avec MSW existants (`src/**/*.test.{ts,tsx}`), mais aucun ne couvre le chargement des chunks buildés.

## ROAM spécifique

| Type | Constat |
|---|---|
| **R**esolved | Surface minimale (3 routes), config sans particularité — bon candidat **app pilote** pour la première vague de propagation. |
| **A**ccepted | Zéro couverture e2e — re-test manuel des 3 routes, effort faible. |

## Charge QA
**Faible** (3 points : root, explorer, notebook) — candidat naturel pour valider le pattern de propagation avant les apps à forte surface.
