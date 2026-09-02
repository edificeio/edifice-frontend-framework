# ENABLING-1002 — blog

## Faits vérifiés

**Config build** : `inlineDynamicImports: true` confirmé (`vite.config.ts:108-112`). `base: '/blog'` en prod, `assetsDir: 'public'`, `chunkSizeWarningLimit: 5000`.

**Surface de lazy loading** (~20 chunks attendus — la plus grosse surface du parc) :
- 13 routes (`src/routes/index.tsx`) : root, blog-root, blog (liste), post-edit, post, blog-print, post-print, **public-portal, public-blog, public-blog-print, public-post, public-post-print** (portail public non authentifié), old-format
- 7 modales : `ConfirmModal` (×2, PostActionBar/PostPreviewActionBar), `UpdateModal`, `BlogPublic`, `DeleteModal`, `PublishModal`, `ShareModal`, `ShareBlog` (toutes dans `BlogActionBar.tsx`)

**Déploiement** : `backend/src/main/resources/view/index.html` est un artefact **committé en git** (régénéré à chaque build CI via `Jenkinsfile`, nettoyage à plat sans whitelist). Aucune CSP/SRI/service worker. Pas de workflow GitHub Actions.

**Tests** : zéro fichier de test (unit ou e2e) dans `frontend/src` malgré Vitest configuré.

## ROAM spécifique

| Type | Constat |
|---|---|
| **O**wned | Surface de lazy loading la plus large du parc (~20 points), dont **5 routes du portail public non authentifié** — dev assigné doit prioriser leur test, une régression y serait visible de tout visiteur externe sans compte. |
| **A**ccepted | Absence totale de tests (unit + e2e) — risque accepté dans le cadre du calendrier été, mais charge QA manuelle la plus lourde du périmètre. |
| **R**esolved | L'artefact `index.html` committé peut donner une fausse impression de bundle figé — c'est un artefact CI régénéré, pas une contrainte réelle. |

## Charge QA
**Élevée** — ~20 points, à traiter en priorité sur les 5 routes du portail public (`public-*`) avant les routes authentifiées, puis les 7 modales d'action (partage, publication, suppression).
