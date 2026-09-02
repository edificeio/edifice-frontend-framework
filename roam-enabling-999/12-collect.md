# ENABLING-1012 — collect

## Faits vérifiés — attention, deux builds distincts

`frontend/vite.config.ts` produit **deux builds** (`package.json` : `vite build && vite build --mode lib`) :
- **Build "app"** (branche `else`, lignes 139-153) : `inlineDynamicImports: true` **sans commentaire**, `base: '/collect'` en prod — **c'est celui visé par ENABLING-999/1012**.
- **Build "lib"** (`isLibMode`, lignes 115-138) : `inlineDynamicImports: true` **avec un commentaire explicite** — *"Inline dynamic imports so lazy routes work when the library is loaded via dynamic import (e.g., CollectApp embedded in rack)"*. Ce build est utilisé pour l'embedding de `CollectApp` dans [rack](09-rack.md) via import dynamique.

**Commentaire vérifié et invalidé.** Test empirique effectué (build réel de `collect-frontend --mode lib` avec le flag désactivé dans une copie de travail temporaire, revert immédiat après — le dépôt `collect` est resté intact) : sans `inlineDynamicImports`, le build produit 21 fichiers JS séparés au lieu d'un seul. En simulant fidèlement la consommation par `rack` (import dynamique de `@edifice.io/collect-frontend/lib`, avec exactement le même jeu de dépendances externalisées que le vrai build — `react`, `@edifice.io/react`, `antd`, `react-pdf`, `pdfjs-dist`, etc., toutes listées dans `package.json.dependencies`), Rollup a **correctement retracé et re-chunké** les routes lazy internes de collect (Root, CollectionsList, SubmissionList, Collection, etc.), avec tous les `import("./...")` internes réécrits vers des chemins valides — zéro fichier manquant, zéro erreur de build. C'est le comportement standard de Rollup pour un import dynamique inter-packages.

De plus, le ticket cité dans le commit qui a introduit ce flag (`fd70d475`, "fix: #PEDAGO-4081 … and inline dynamic imports for lazy routes") — **PEDAGO-4081** — décrit un bug de **lien de redirection erroné dans une notification** (URL de renvoi), sans aucun rapport avec un chargement de chunk JS. Rien n'indique qu'un incident de chargement de module dynamique ait réellement motivé ce flag.

**Conclusion** : la justification du commentaire n'est pas corroborée. Le flag semble avoir été ajouté par précaution plutôt que suite à un diagnostic confirmé. Il n'y a donc probablement **pas de contrainte technique réelle** empêchant de retirer `inlineDynamicImports` du build "lib" en même temps que du build "app" — mais recommandation : valider ce retrait par un test manuel réel (build rack + collect ensemble, clic du flux Collect en recette) avant de le supprimer, mon repro isolé ne couvrant que le chemin de build production (Rollup), pas le serveur de dev Vite (`optimizeDeps`/esbuild), potentiellement différent.

**Surface de lazy loading (build app)** : 9 routes (`routes/index.tsx`) — Root, CollectionsLayout, CollectionsList (×2 chemins), SubmissionList, Collection, MineSubmission, Submission, MembersEdit, FormEdit. Exception : la route `create/*` (wizard) est importée **eager**, pas de chunk supplémentaire pour elle.

**Déploiement** : pas de `backend/deployment/`, pas de `.github/workflows` (Jenkins). `dist/index.html` généré nativement par Vite (script injecté, hash dans le nom). Service des fichiers statiques délégué au package partagé `@edifice.io/edifice-nestjs-core` (hors périmètre de ce repo) — aucune CSP/SRI/SW trouvée dans le repo collect lui-même.

**Tests** : zéro fichier de test dans `frontend/` (aucun unit, aucun e2e). Les tests `backend/test/js/it/scenarios/*` sont des tests d'intégration **k6** sur l'API REST, sans lien avec l'UI.

## ROAM spécifique

| Type | Constat |
|---|---|
| **O**wned | **Champ d'action à clarifier avant de coder** — ENABLING-1012/999 ne visait explicitement que le build "app". Le build "lib" est un cas séparé dont le commentaire justificatif est invalidé (voir ci-dessus) : à traiter comme une décision produit/technique à part (retirer le flag aussi, ou le laisser en l'état par prudence), pas comme un simple oubli à corriger en passant. |
| **O**wned | Si le flag du build "lib" est retiré : couplage direct avec [rack](09-rack.md) — valider les deux sous-tâches ensemble en recette avant mise en prod (test réel du flux Collect embarqué), pas isolément. Mon repro ne couvre que le chemin de build production, pas le dev server Vite. |
| **A**ccepted | Zéro test automatisé côté frontend — re-test manuel des 9 routes du build "app". |

## Charge QA
Moyenne-élevée (9 points côté build "app"). Si le flag du build "lib" est également retiré (recommandé, sous réserve de validation manuelle) : ajouter **une vérification croisée avec rack** (flux Collect embarqué) au plan de test.
