# ENABLING-1011 — wiki

## Faits vérifiés

**Config build** : `inlineDynamicImports: true` confirmé (`vite.config.ts:46-60`). `base: '/wiki'`, `assetsDir: 'public'`, `chunkSizeWarningLimit: 5000`.

**Surface de lazy loading** (~10 chunks attendus) :
- 2 routes : root (`/`), print (`print/id/:wikiId`)
- 8 modales : `UpdateModal`, `ShareModal`, `PrintModal` (`AppHeader.tsx`), `DeletePageModal`, `RevisionModal`, `ConfirmVisibilityModal` (`page/index.tsx`), `RevisionModal`/`DeleteListModal` (`page/list/list.tsx`), `ConfirmVisibilityModal` (`page/edit.tsx`)

**Déploiement** : `WikiController.java` sert via `renderView(...)` (11 occurrences), pattern standard. Un seul CI (`tests.yml`) = Vitest uniquement. Un fichier `test.scala` (Gatling) existe mais concerne des tests de charge backend, sans rapport avec le front.

**Tests** : aucun e2e/Playwright (pas de config, pas de spec, pas de dépendance). Tests unitaires Vitest existants côté composants.

## ROAM spécifique

| Type | Constat |
|---|---|
| **O**wned | Fort volume de modales de gestion de page (suppression, historique de révision, changement de visibilité) — dev assigné doit vérifier particulièrement ces flux, sensibles car destructifs/irréversibles (suppression de page, de liste). |
| **A**ccepted | Pas de couverture e2e — re-test manuel des ~10 points. |

## Charge QA
Élevée (~10 points) — prioriser les modales à action destructive (suppression de page/liste) et de visibilité, puis les 2 routes (root, print).
