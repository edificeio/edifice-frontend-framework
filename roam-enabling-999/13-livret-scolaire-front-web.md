# Hors périmètre du ticket — livret-scolaire-front-web (aucune sous-tâche ENABLING-999 associée)

**Ce chapitre ne correspond à aucune sous-tâche ENABLING-999 existante.** L'app a été repérée lors d'une vérification complémentaire ("a-t-on oublié une app ?") sur l'ensemble des dépôts sibling. Le dépôt est actif (dernier commit 31/07/2026, `edificeio/livret-scolaire-front-web`), développé par une équipe récemment internalisée — à inclure dans l'analyse ROAM sur demande explicite, même si le ticket ne le référence pas.

## Faits vérifiés

**Architecture différente des 12 apps déjà couvertes** — pas de séparation `frontend/`/`backend/`, pas de module Vert.x :
- `vite.config.ts` est à la racine du repo. `base: '/livret-scolaire/app'` en prod/préprod, `outDir: 'dist'`, `assetsDir: 'public'`, `chunkSizeWarningLimit: 5000`, `rollupOptions.output.inlineDynamicImports: true` confirmé.
- Le repo contient des restes d'un scaffold **React Router v7 "framework mode"** (`react-router.config.ts` avec `ssr: false`, dépendance `@react-router/dev`, script `"start": "react-router-serve ./build/server/index.js"`) — **mais** `vite.config.ts` n'importe/utilise **pas** le plugin `@react-router/dev/vite`, et le script `"build"` est un simple `vite build` produisant `dist/` (pas la structure `build/client` + `build/server` attendue par `react-router-serve`). **Incohérence à signaler à l'équipe** : soit ce chemin de déploiement (`Dockerfile` → `npm run build` → `npm run start` → `react-router-serve ./build/server/index.js`) est actuellement non fonctionnel en l'état, soit un mécanisme de déploiement différent (non visible dans ce repo) est réellement utilisé. Cette incertitude sur le pipeline de build/déploiement est un facteur de risque indépendant du sujet ENABLING-999, mais qui augmente l'incertitude générale sur "que se passe-t-il vraiment quand `inlineDynamicImports` est retiré et que l'app est redéployée".
- Pas de dossier `backend/` : le routing spécifique à l'app (`/livret-scolaire/app/*`) est vraisemblablement géré par un reverse-proxy/gateway externe non visible depuis ce repo, plutôt que par un contrôleur Vert.x `renderView`. Intègre néanmoins le bandeau/portail Edifice (proxy vers `auth`, `portal`, `workspace`, etc.) et un service externe "Flash" (`roquetteProxy` vers `flash.edifice.io`/`preprod-flash.edifice.io`) pour la synchronisation de données scolaires.

**Surface de lazy loading** (10 chunks attendus, `app/routes/index.tsx`) :
- Arbre `/` : Root (layout, ligne 75-82), Onboard (index, ligne 15-21), ImportFlash (`import-flash`, 24-30), Home (`home`, 34-40), FlashLogin (`login/flash`, 44-50), SyncClassroom (`sync/classroom`, 54-60), SyncData (`sync/data`, 64-70)
- Arbre `/app` : RootEditor (layout, 110-117), Editor (index, 90-96), ExportLSU (`export`, 99-105)

**Tests** : aucun fichier de test trouvé (ni unit, ni e2e/Playwright) dans tout le repo.

## ROAM spécifique

| Type | Constat |
|---|---|
| **O**wned | **La sous-tâche n'existe pas** — à signaler au reporter/PO d'ENABLING-999 pour décider d'ajouter une sous-tâche dédiée (ex. ENABLING-1013) avant de considérer le périmètre du ticket comme complet. |
| **O**wned | **Incohérence de pipeline de build/déploiement** repérée (scaffold react-router v7 non branché vs `vite build` simple) — à clarifier avec l'équipe avant toute action sur `inlineDynamicImports`, pour être sûr de tester le bon artefact de déploiement réel. |
| **A**ccepted | Zéro test automatisé — re-test manuel des 10 points de lazy loading, comme pour les 12 apps déjà couvertes. |

## Charge QA
Moyenne (10 points, comparable à `actualites`/`wiki`) — **mais à ne traiter qu'après clarification du pipeline de déploiement réel**, sans quoi un test en "recette" pourrait valider un artefact qui n'est pas celui réellement mis en production.
