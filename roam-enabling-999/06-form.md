# ENABLING-1006 — form (formulaire + formulaire-public)

## Faits vérifiés — anomalie majeure

Contrairement à toutes les autres apps du périmètre, **ni `form/formulaire/frontend/vite.config.ts` ni `form/formulaire-public/frontend/vite.config.ts` n'ont jamais contenu `inlineDynamicImports`**. Les deux utilisent `rollupOptions.output.manualChunks` (chunk `react` regroupant react/react-router-dom/react-dom/react-error-boundary/react-hook-form/react-hot-toast) **depuis leur création** :
- `formulaire` : créé avec ce pattern dès le commit `454a2db6` ("chore(react): add and link react to the app").
- `formulaire-public` : hérite du même pattern dès son commit d'initialisation (`609c1bc2`).

`git log -S"inlineDynamicImports"` sur les deux fichiers ne remonte **aucun** commit — le flag n'a jamais existé ici, il n'a donc pas pu être "retiré".

**Surface de lazy loading actuelle** : 9 routes lazy dans `formulaire` (Home, Creation×2, Tree, Preview, Result, Response×2, Recap) et 3 dans `formulaire-public` (Response, Sorry, Thanks) — **déjà actives en production en multi-chunk**, preuve supplémentaire (comme entcore/timeline) que le code-splitting fonctionne nativement chez Edifice sans risque de déploiement.

**Déploiement** : routing en `createHashRouter` (URLs `#/...`), donc aucune dépendance à la config serveur pour le routing. `build.sh` copie `dist/public/*` en bloc.

**Tests** : aucun e2e/Playwright, seulement `vitest` (unit) déclaré mais non vérifié en détail ici.

## ROAM spécifique

| Type | Constat |
|---|---|
| **O**wned | **La sous-tâche semble sans objet** : il n'y a rien à retirer. Owner = reporter/PO du ticket, à trancher explicitly : (a) fermer ENABLING-1006 sans action avec un commentaire explicatif, ou (b) la requalifier si l'intention réelle était d'harmoniser tous les projets sur un pattern unique (`manualChunks` généralisé plutôt que le découpage par défaut issu du retrait pur du flag). |
| **R**esolved | Aucune régression possible côté form puisqu'aucun changement de code n'est nécessaire — à condition que le point ci-dessus soit tranché avant que quelqu'un ne "corrige" un flag qui n'existe pas. |

## Charge QA
**Nulle**, sous réserve de la décision PO ci-dessus. Si la sous-tâche est fermée sans action, aucun re-test n'est nécessaire sur form dans le cadre de ce ticket.
