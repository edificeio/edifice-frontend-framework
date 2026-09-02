# ENABLING-1008 — mindmap

## Faits vérifiés

**Config build** : `inlineDynamicImports: true` confirmé (`vite.config.ts:99-109`). `base: '/mindmap'`, `assetsDir: 'public'`, `chunkSizeWarningLimit: 5000` (déjà relevé, cohérent avec un bundle unique volumineux actuel).

**Surface de lazy loading** : 3 routes (`routes/index.tsx`) — root/Explorer (`/*`), mindmap (édition, `id/:id`), print (`print/id/:id`). La librairie de rendu `@edifice-wisemapping/editor` est importée **à l'intérieur** des routes mindmap et print (pas au niveau racine) — elle formera donc très probablement son propre chunk potentiellement volumineux après le fix.

**Particularité notable** : un plugin custom `plugins/vite-plugin-edifice.ts` fait un remplacement de chaîne littérale dans `transformIndexHtml` pour un hash de cache sur le CSS bootstrap. N'affecte pas directement les chunks JS mais montre une manipulation manuelle du HTML final, à revérifier une fois plusieurs `<script>` générés.

**Déploiement** : pipeline Jenkins (`cp -R ../frontend/dist/* ./src/main/resources/`, pas de whitelist). Pas de CSP/SRI/SW. `index.html` référence uniquement `/src/main.tsx`, injecté normalement par Vite.

**Tests** : aucun test e2e ni unitaire trouvé dans `frontend/src` malgré Vitest configuré.

## ROAM spécifique

| Type | Constat |
|---|---|
| **O**wned | Le plugin custom `vite-plugin-edifice.ts` manipulant `transformIndexHtml` doit être revérifié après le fix pour confirmer qu'il continue à fonctionner correctement avec plusieurs balises `<script>` générées. |
| **A**ccepted | La lib d'édition mindmap sortira probablement en chunk séparé potentiellement lourd — acceptable, à mesurer plutôt qu'à anticiper. |
| **A**ccepted | Zéro test automatisé — re-test manuel intégral des 3 routes. |

## Charge QA
Faible-moyenne (3 points) mais **attention particulière à l'éditeur mindmap** (chunk potentiellement lourd) et au bon fonctionnement du plugin custom de hash CSS après le changement.
