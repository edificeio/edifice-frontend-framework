# ENABLING-1004 — communities

## Faits vérifiés

**Config build** : `inlineDynamicImports: true` confirmé (`vite.config.ts:118-132`). `base: '/communities'`, `assetsDir: 'public'`, `chunkSizeWarningLimit: 5000`.

**Surface de lazy loading** (~9-10 chunks attendus, mais gain limité) :
- 4 routes : root layout, `id/:communityId`, `join/:qrcode`, print
- 6 modales : `InvitationModal`, `MoveResourceModal`, `FolderModal`, `RemoveFolderModal`, `MoveFolderModal`, `HomeTabMobile` (anti-pattern : `lazy()` recréé à chaque render, `HomeTab.tsx:28`)
- **Important** : les modules les plus lourds — `CommunityTabs`, `CoursesTab` (embarque `@edifice.io/wiki/lib`), les `Announcements` (embarquent `@edifice.io/collect-frontend/lib`), et le wizard de création (`wizard.tsx`) — sont **importés de façon eager (statique)**, pas via `lazy()`. Le fix ne les affecte donc pas.

**Déploiement** : backend **NestJS + Fastify** (pas Vert.x), `ServeStaticModule.forRoot(...)` sert `dist/` sans whitelist. Aucun helmet/CSP/SRI/SW trouvé dans `@edifice.io/edifice-nestjs-core`.

**Tests** : zéro test frontend (unit ou e2e) malgré Vitest configuré.

## ROAM spécifique

| Type | Constat |
|---|---|
| **O**wned | Gain de perf potentiellement décevant : les modules les plus volumineux (wiki, collect, wizard) restent eager. Dev assigné doit documenter ce point dans la PR pour éviter une fausse impression d'échec lors de la mesure bundle avant/après demandée par le ticket. |
| **A**ccepted | Anti-pattern préexistant `React.lazy()` recréé à chaque render (`HomeTab.tsx:28`) — bug indépendant du ticket, à traiter séparément. |
| **A**ccepted | Zéro test automatisé — re-test manuel intégral. |

## Charge QA
Moyenne (~9 points) — tester les 4 routes + 6 modales, mais **s'attendre à un gain de bundle limité** ; si un vrai gain de perf est souhaité sur cette app, un refactor complémentaire (rendre wiki/collect/wizard lazy) sera nécessaire hors scope de ce ticket.
