# ENABLING-1010 — support

## Faits vérifiés

**Config build** : `inlineDynamicImports: true` confirmé (`vite.config.ts:89-103`). `base: '/support'`, `assetsDir: 'public'`, `chunkSizeWarningLimit: 4000`.

**Surface de lazy loading** — parmi les plus faibles du périmètre : 4 loaders (`routes/index.tsx`) — root (layout), liste des tickets (`TicketsListRoute`), détail d'un ticket (`TicketDetailsRoute`, `tickets/:ticketId`), création (`TicketCreationRoute`, `tickets/new`). `NotFound` et `PageError` restent statiques (chunk principal).

**Déploiement** : module Vert.x standard, `DisplayController.java` via `renderView(...)`. Script copie `dist/*` en bloc puis déplace les `.html` vers `view/`. Aucune CSP/SRI/SW.

**Tests** : aucun e2e/Playwright. 8 fichiers de tests unitaires Vitest existants (composants, formulaire, hooks, modèles) — le meilleur niveau de couverture unitaire du périmètre analysé, mais toujours aucun test ne fait tourner l'app buildée.

## ROAM spécifique

| Type | Constat |
|---|---|
| **R**esolved | Surface minimale (4 routes), meilleure couverture unitaire du parc, config sans particularité — bon candidat **app pilote**. |
| **A**ccepted | Pas de test e2e — re-test manuel des 4 routes, effort faible. |

## Charge QA
**Faible** (4 points : root, liste, détail, création de ticket) — bon candidat pour la première vague de propagation aux côtés de homeworks et entcore/portal.
