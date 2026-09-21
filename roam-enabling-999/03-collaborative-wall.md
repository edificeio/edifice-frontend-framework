# ENABLING-1003 — collaborative-wall

## Faits vérifiés

**Config build** : `inlineDynamicImports: true` confirmé (`vite.config.ts:99-108`). `base: '/collaborativewall'`, `assetsDir: 'public'`, `chunkSizeWarningLimit: 5000`.

**Surface de lazy loading** (8 chunks attendus) :
- 5 routes : root, collaborative-wall (mur/canvas), note-modal (création + `note/:noteId`), print
- 3 modales : `WebsocketModal` (état de connexion temps réel, `WallContainer.tsx:6`), `DescriptionModal`, `UpdateModal`/`BackgroundModal`/`ShareModal` (`AppHeader.tsx`)

Le canvas/temps réel lui-même n'est pas lazy imbriqué — seul le modal d'état websocket l'est.

**Déploiement** : `CollaborativeWallController.java` sert 3 vues (`index.html`, `print.html`, `printnotes.html`) via `renderView`, pattern standard. Pas de CI GitHub Actions (Jenkinsfile), copie de dist à plat.

**Tests** : zéro test (unit ou e2e) dans le repo.

## ROAM spécifique

| Type | Constat |
|---|---|
| **A**ccepted | Deux routes de "print" backend (`print.html`, `printnotes.html`) coexistent avec une route React `print/id/:wallId` — legacy potentiellement mort, à vérifier séparément (hors scope de ce fix), accepté tel quel pour l'instant. |
| **O**wned | Le modal `WebsocketModal` (temps réel) passe en chunk séparé — dev assigné doit vérifier que l'état de connexion websocket ne "flash" pas pendant le chargement du chunk. |
| **A**ccepted | Zéro test automatisé — re-test 100% manuel. |

## Charge QA
Moyenne (8 points) — prioriser le mur collaboratif lui-même (canvas + websocket) et le flux de création de note, puis les 3 modales d'en-tête (partage, fond, mise à jour).
