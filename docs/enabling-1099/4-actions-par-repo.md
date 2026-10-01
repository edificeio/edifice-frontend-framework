# ENABLING-1099 · 4 — Actions par repo

↩ [Document principal](../../ENABLING-1099-NORME-VERSIONS-PACKAGES.md) · [1 — Constats](1-constats.md) · [2 — Actions](2-actions.md) · [3 — Méthode](3-methode.md)

Chemins donnés **depuis la racine du repo**. Chaque section est autonome. Ordre des repos = ordre
d'exécution recommandé.

---

# `collect`

*2 copies du socle. Publie `@edifice.io/collect-frontend`, dont le manifeste est cassé et propage un `ode-explorer` inutilisé à `rack` et `communities`.*

### 1. `ode-explorer` n'est jamais importé : retirer la dépendance

`frontend/package.json` — supprimer cette ligne des `dependencies` :

```json
    "ode-explorer": "develop",
```

### 2. `npm publish` laisse fuiter le protocole `workspace:` et rend le package ininstallable

`package.json` — remplacer le script `publish:frontend` :

```json
    "publish:frontend": "pnpm --filter *-frontend build:lib && pnpm --filter *-frontend exec edifice-update-rn-version && pnpm --filter *-frontend publish --no-git-checks --access public --tag=$PUBLISH_TAG --dry-run=${DRY_RUN}",
```

Republier sur `latest` et sur `develop`, puis vérifier :

```sh
npm view @edifice.io/collect-frontend@develop dependencies --json | grep workspace:   # doit être vide
```

### 3. Un package publié ne doit pas embarquer sa copie du socle

Convention identique à `ode-explorer@2.6.12` (ENABLING-1158, déjà publié). Les mêmes clés apparaissent
dans les deux blocs : le peer parle à l'app hôte, le dev au repo lui-même —
[pourquoi](2-actions.md#pourquoi-les-mêmes-clés-dans-peerdependencies-et-devdependencies).

`frontend/package.json` — retirer `@edifice.io/bootstrap|client|react`, `@tanstack/react-query`, `react`,
`react-dom` et `react-i18next` des `dependencies`, et ajouter ce bloc :

```json
  "peerDependencies": {
    "@edifice.io/bootstrap": "develop",
    "@edifice.io/client": "develop",
    "@edifice.io/react": "develop",
    "@tanstack/react-query": "^5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-i18next": "^14"
  },
```

Les trois `@edifice.io/*` valent le **tag de la branche publiante** : `develop` sur `develop`, la version
exacte du socle sur `main` (ex. `2.6.7` pour `ode-explorer@latest`). Pas de `"*"`.

`frontend/package.json` — fusionner dans les `devDependencies` existantes, pour que le repo builde seul :

```json
    "@edifice.io/bootstrap": "develop",
    "@edifice.io/client": "develop",
    "@edifice.io/react": "develop",
    "@tanstack/react-query": "5.81.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-i18next": "14.1.0",
```

`frontend/vite.config.ts` — **indispensable** : le build `lib` ne marque comme `external` que les
`dependencies`. Sans cette modification, le socle déplacé en peers serait **embarqué dans le bundle publié**.

```ts
import { dependencies, peerDependencies } from "./package.json";
// ...
external: [
  ...Object.keys(dependencies || {}),
  ...Object.keys(peerDependencies || {}),
  // keep the existing entries (e.g. 'react/jsx-runtime')
],
```

### 4. `resolutions` dans un membre de workspace est ignoré par pnpm

`frontend/package.json` — supprimer ce bloc :

```json
  "resolutions": {
    "@tanstack/react-query": "5.81.5"
  },
```

### 5. `sync:lockfile` re-résout tous les tags au moment du build de prod

`package.json` — remplacer `install:prod`, et supprimer le script `sync:lockfile` devenu inutile :

```json
    "install:prod": "pnpm -r install",
```

### 6. Filet au niveau du bundler

`frontend/vite.config.ts` — dans `resolve`, avant `alias` :

```ts
    resolve: {
      dedupe: [
        'react',
        'react-dom',
        '@edifice.io/react',
        '@edifice.io/client',
        '@tanstack/react-query',
        'react-hook-form',
        'react-i18next',
      ],
      alias: {
```

### 7. Garde-fou CI

`scripts/check-singletons.sh` — nouveau fichier :

```sh
#!/bin/sh
# Fails the build if an Edifice singleton is physically duplicated in node_modules.
# Counts .pnpm directories rather than querying `pnpm why`: only this catches peer
# variants, which `pnpm why` reports as a single version.
set -u
status=0
for pkg in "@edifice.io+react" "@edifice.io+client" "@tanstack+react-query" "react" "react-dom"; do
  n=$(ls -d node_modules/.pnpm/${pkg}@* 2>/dev/null | wc -l | tr -d ' ')
  if [ "$n" -gt 1 ]; then
    echo "FAIL: ${pkg} has ${n} physical copies:"
    ls -d node_modules/.pnpm/${pkg}@* | sed 's|.*/|  |'
    status=1
  fi
done
[ "$status" -eq 0 ] && echo "OK: no duplicated singleton."
exit $status
```

```sh
chmod +x scripts/check-singletons.sh
```

`Jenkinsfile` — nouvelle étape, après celle qui installe les dépendances :

```groovy
    stage('Check singletons') {
      steps {
        sh './scripts/check-singletons.sh'
      }
    }
```

---

# `explorer` → publie `ode-explorer`

*✅ **Fait** — ENABLING-1158, publié en `2.6.12` sur `latest` et `develop` (vérifié sur npm le 01/10/2026).*

Ce qui a été appliqué, et qui sert de **référence** pour `collect` et `wiki` :

- Le socle (`@edifice.io/bootstrap|client|react`), `@tanstack/react-query`, `react`, `react-dom` et
  `react-i18next` sont en `peerDependencies` **et** en `devDependencies`, plus en `dependencies`.
- Les trois `@edifice.io/*` valent le tag de la branche publiante (`develop`) ou la version exacte du socle
  sur `main` (`2.6.7`). `react-query` vaut `^5`, `react-i18next` `^14`, `react`/`react-dom` `18.3.1`.
- `frontend/package.json.template` et `scripts/package.cjs` sont supprimés : `frontend/package.json` est la
  source de vérité (N10 réglé, plus d'artefact généré à ignorer).
- `vite.config.ts` : `peerDependencies` ajoutés à `rollupOptions.external`, et `resolve.dedupe` posé (N4).
- `build.sh` publie avec `pnpm publish` ; la version exacte est calculée à la publication sur les branches
  autres que `main`.

**Reste à faire** : le garde-fou CI (N5), dans un ticket dédié.

---

# `wiki` → publie `@edifice.io/wiki`

*Embarqué par `communities`, où il introduit une troisième copie du socle. `ode-explorer` reste en `dependencies` : il est réellement importé, et il a déjà le socle en `peerDependencies`.*

### 1. Un package publié ne doit pas embarquer sa copie du socle

Convention identique à `ode-explorer@2.6.12` (ENABLING-1158, déjà publié). **Prérequis satisfait** :
`ode-explorer` a désormais le socle en `peerDependencies` et n'apporte plus sa propre copie à `wiki`.
Les mêmes clés apparaissent dans les deux blocs : le peer parle à l'app hôte, le dev au repo lui-même —
[pourquoi](2-actions.md#pourquoi-les-mêmes-clés-dans-peerdependencies-et-devdependencies).

`frontend/package.json` — retirer `@edifice.io/bootstrap|client|react`, `@tanstack/react-query`, `react`,
`react-dom` et `react-i18next` des `dependencies`, et ajouter ce bloc :

```json
  "peerDependencies": {
    "@edifice.io/bootstrap": "develop",
    "@edifice.io/client": "develop",
    "@edifice.io/react": "develop",
    "@tanstack/react-query": "^5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-i18next": "^14"
  },
```

Les trois `@edifice.io/*` valent le **tag de la branche publiante** : `develop` sur `develop`, la version
exacte du socle sur `main`. Pas de `"*"`.

`frontend/package.json` — fusionner dans les `devDependencies` existantes :

```json
    "@edifice.io/bootstrap": "develop",
    "@edifice.io/client": "develop",
    "@edifice.io/react": "develop",
    "@tanstack/react-query": "5.62.7",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-i18next": "14.1.0",
```

`frontend/vite.config.ts` — **indispensable** : le build `lib` ne marque comme `external` que les
`dependencies`. Sans cette modification, le socle déplacé en peers serait **embarqué dans le bundle publié**.

```ts
import { dependencies, peerDependencies } from './package.json';
// ...
external: [
  ...Object.keys(dependencies || {}),
  ...Object.keys(peerDependencies || {}),
  // keep the existing entries (e.g. 'react/jsx-runtime')
],
```

### 2. Filet au niveau du bundler

`frontend/vite.config.ts` — dans `resolve`, avant `alias` :

```ts
    resolve: {
      dedupe: [
        'react',
        'react-dom',
        '@edifice.io/react',
        '@edifice.io/client',
        '@tanstack/react-query',
        'react-hook-form',
        'react-i18next',
      ],
      alias: {
```

### 3. Garde-fou CI

`scripts/check-singletons.sh` — nouveau fichier :

```sh
#!/bin/sh
# Fails the build if an Edifice singleton is physically duplicated in node_modules.
# Counts .pnpm directories rather than querying `pnpm why`: only this catches peer
# variants, which `pnpm why` reports as a single version.
set -u
status=0
for pkg in "@edifice.io+react" "@edifice.io+client" "@tanstack+react-query" "react" "react-dom"; do
  n=$(ls -d node_modules/.pnpm/${pkg}@* 2>/dev/null | wc -l | tr -d ' ')
  if [ "$n" -gt 1 ]; then
    echo "FAIL: ${pkg} has ${n} physical copies:"
    ls -d node_modules/.pnpm/${pkg}@* | sed 's|.*/|  |'
    status=1
  fi
done
[ "$status" -eq 0 ] && echo "OK: no duplicated singleton."
exit $status
```

```sh
chmod +x scripts/check-singletons.sh
```

`Jenkinsfile` — nouvelle étape, après celle qui installe les dépendances :

```groovy
    stage('Check singletons') {
      steps {
        sh './scripts/check-singletons.sh'
      }
    }
```

---

# `rack`

*2 copies du socle. Rien à publier — `@edifice.io/rack-frontend` est `private: true`. Les 2 copies subsistent jusqu'à la republication de `@edifice.io/collect-frontend`, qui apporte lui aussi `ode-explorer`.*

### 1. `ode-explorer` n'est jamais importé : retirer la dépendance

`frontend/package.json` — supprimer cette ligne des `dependencies` :

```json
    "ode-explorer": "develop",
```

### 2. `resolutions` dans un membre de workspace est ignoré par pnpm

`frontend/package.json` — supprimer ce bloc :

```json
  "resolutions": {
    "@tanstack/react-query": "5.81.5"
  },
```

### 3. `sync:lockfile` re-résout tous les tags au moment du build de prod

`package.json` — remplacer `install:prod`, et supprimer le script `sync:lockfile` devenu inutile :

```json
    "install:prod": "pnpm -r install",
```

### 4. Filet au niveau du bundler

`frontend/vite.config.ts` — dans `resolve`, avant `alias` :

```ts
    resolve: {
      dedupe: [
        'react',
        'react-dom',
        '@edifice.io/react',
        '@edifice.io/client',
        '@tanstack/react-query',
        'react-hook-form',
        'react-i18next',
      ],
      alias: {
```

### 5. Garde-fou CI

`scripts/check-singletons.sh` — nouveau fichier :

```sh
#!/bin/sh
# Fails the build if an Edifice singleton is physically duplicated in node_modules.
# Counts .pnpm directories rather than querying `pnpm why`: only this catches peer
# variants, which `pnpm why` reports as a single version.
set -u
status=0
for pkg in "@edifice.io+react" "@edifice.io+client" "@tanstack+react-query" "react" "react-dom"; do
  n=$(ls -d node_modules/.pnpm/${pkg}@* 2>/dev/null | wc -l | tr -d ' ')
  if [ "$n" -gt 1 ]; then
    echo "FAIL: ${pkg} has ${n} physical copies:"
    ls -d node_modules/.pnpm/${pkg}@* | sed 's|.*/|  |'
    status=1
  fi
done
[ "$status" -eq 0 ] && echo "OK: no duplicated singleton."
exit $status
```

```sh
chmod +x scripts/check-singletons.sh
```

`Jenkinsfile` — nouvelle étape, après celle qui installe les dépendances :

```groovy
    stage('Check singletons') {
      steps {
        sh './scripts/check-singletons.sh'
      }
    }
```

---

# `communities`

*3 copies du socle, la plus dupliquée. Rien à publier. Corrigée par la republication de `@edifice.io/wiki` et `@edifice.io/collect-frontend`.*

### 1. `resolutions` dans un membre de workspace est ignoré par pnpm

`frontend/package.json` — supprimer ce bloc :

```json
  "resolutions": {
    "@tanstack/react-query": "5.81.5"
  },
```

### 2. `sync:lockfile` re-résout tous les tags au moment du build de prod

`package.json` — remplacer `install:prod`, et supprimer le script `sync:lockfile` devenu inutile :

```json
    "install:prod": "pnpm -r install",
```

### 3. Filet au niveau du bundler

`frontend/vite.config.ts` — dans `resolve`, avant `alias` :

```ts
    resolve: {
      dedupe: [
        'react',
        'react-dom',
        '@edifice.io/react',
        '@edifice.io/client',
        '@tanstack/react-query',
        'react-hook-form',
        'react-i18next',
      ],
      alias: {
```

### 4. Garde-fou CI

`scripts/check-singletons.sh` — nouveau fichier :

```sh
#!/bin/sh
# Fails the build if an Edifice singleton is physically duplicated in node_modules.
# Counts .pnpm directories rather than querying `pnpm why`: only this catches peer
# variants, which `pnpm why` reports as a single version.
set -u
status=0
for pkg in "@edifice.io+react" "@edifice.io+client" "@tanstack+react-query" "react" "react-dom"; do
  n=$(ls -d node_modules/.pnpm/${pkg}@* 2>/dev/null | wc -l | tr -d ' ')
  if [ "$n" -gt 1 ]; then
    echo "FAIL: ${pkg} has ${n} physical copies:"
    ls -d node_modules/.pnpm/${pkg}@* | sed 's|.*/|  |'
    status=1
  fi
done
[ "$status" -eq 0 ] && echo "OK: no duplicated singleton."
exit $status
```

```sh
chmod +x scripts/check-singletons.sh
```

`Jenkinsfile` — nouvelle étape, après celle qui installe les dépendances :

```groovy
    stage('Check singletons') {
      steps {
        sh './scripts/check-singletons.sh'
      }
    }
```

---

# `edifice-react-boilerplate`

*2 copies du socle. C'est le gabarit : sa déclaration `ode-explorer` inutilisée est héritée par toutes les apps créées depuis lui.*

### 1. `ode-explorer` n'est jamais importé : retirer la dépendance

`frontend/package.json` — supprimer cette ligne des `dependencies` :

```json
    "ode-explorer": "develop",
```

Le bloc `linkDependencies` de `frontend/build.sh` est conditionné à la présence de cette clé
(`sed -n '/"ode-explorer":/p' package.json`) : il devient inerte, aucune modification nécessaire.

### 2. Filet au niveau du bundler

`frontend/vite.config.ts` — dans `resolve`, avant `alias`. À conserver dans le gabarit pour que les
prochaines apps en héritent :

```ts
    resolve: {
      dedupe: [
        'react',
        'react-dom',
        '@edifice.io/react',
        '@edifice.io/client',
        '@tanstack/react-query',
        'react-hook-form',
        'react-i18next',
      ],
      alias: {
```

### 3. Garde-fou CI

`scripts/check-singletons.sh` — nouveau fichier :

```sh
#!/bin/sh
# Fails the build if an Edifice singleton is physically duplicated in node_modules.
# Counts .pnpm directories rather than querying `pnpm why`: only this catches peer
# variants, which `pnpm why` reports as a single version.
set -u
status=0
for pkg in "@edifice.io+react" "@edifice.io+client" "@tanstack+react-query" "react" "react-dom"; do
  n=$(ls -d node_modules/.pnpm/${pkg}@* 2>/dev/null | wc -l | tr -d ' ')
  if [ "$n" -gt 1 ]; then
    echo "FAIL: ${pkg} has ${n} physical copies:"
    ls -d node_modules/.pnpm/${pkg}@* | sed 's|.*/|  |'
    status=1
  fi
done
[ "$status" -eq 0 ] && echo "OK: no duplicated singleton."
exit $status
```

```sh
chmod +x scripts/check-singletons.sh
```

`Jenkinsfile` — nouvelle étape, après celle qui installe les dépendances :

```groovy
    stage('Check singletons') {
      steps {
        sh './scripts/check-singletons.sh'
      }
    }
```

---

# `blog` · `collaborative-wall` · `mindmap`

*1 copie du socle — rien à corriger. `ode-explorer` y est réellement importé et leur pin `react-query 5.62.7` est identique au sien.*

### 1. Filet au niveau du bundler

`frontend/vite.config.ts` — dans `resolve`, avant `alias` :

```ts
    resolve: {
      dedupe: [
        'react',
        'react-dom',
        '@edifice.io/react',
        '@edifice.io/client',
        '@tanstack/react-query',
        'react-hook-form',
        'react-i18next',
      ],
      alias: {
```

### 2. Garde-fou CI

`scripts/check-singletons.sh` — nouveau fichier :

```sh
#!/bin/sh
# Fails the build if an Edifice singleton is physically duplicated in node_modules.
# Counts .pnpm directories rather than querying `pnpm why`: only this catches peer
# variants, which `pnpm why` reports as a single version.
set -u
status=0
for pkg in "@edifice.io+react" "@edifice.io+client" "@tanstack+react-query" "react" "react-dom"; do
  n=$(ls -d node_modules/.pnpm/${pkg}@* 2>/dev/null | wc -l | tr -d ' ')
  if [ "$n" -gt 1 ]; then
    echo "FAIL: ${pkg} has ${n} physical copies:"
    ls -d node_modules/.pnpm/${pkg}@* | sed 's|.*/|  |'
    status=1
  fi
done
[ "$status" -eq 0 ] && echo "OK: no duplicated singleton."
exit $status
```

```sh
chmod +x scripts/check-singletons.sh
```

`Jenkinsfile` — nouvelle étape, après celle qui installe les dépendances :

```groovy
    stage('Check singletons') {
      steps {
        sh './scripts/check-singletons.sh'
      }
    }
```

---

# `homeworks`

*1 copie du socle. Ses overrides racine neutralisent déjà le pin `react-query` d'`ode-explorer`.*

### 1. Étendre le `dedupe` existant

`frontend/vite.config.ts` — remplacer la ligne `dedupe: ['react', 'react-dom'],` :

```ts
      dedupe: [
        'react',
        'react-dom',
        '@edifice.io/react',
        '@edifice.io/client',
        '@tanstack/react-query',
        'react-hook-form',
        'react-i18next',
      ],
```

### 2. Garde-fou CI

`scripts/check-singletons.sh` — nouveau fichier :

```sh
#!/bin/sh
# Fails the build if an Edifice singleton is physically duplicated in node_modules.
# Counts .pnpm directories rather than querying `pnpm why`: only this catches peer
# variants, which `pnpm why` reports as a single version.
set -u
status=0
for pkg in "@edifice.io+react" "@edifice.io+client" "@tanstack+react-query" "react" "react-dom"; do
  n=$(ls -d node_modules/.pnpm/${pkg}@* 2>/dev/null | wc -l | tr -d ' ')
  if [ "$n" -gt 1 ]; then
    echo "FAIL: ${pkg} has ${n} physical copies:"
    ls -d node_modules/.pnpm/${pkg}@* | sed 's|.*/|  |'
    status=1
  fi
done
[ "$status" -eq 0 ] && echo "OK: no duplicated singleton."
exit $status
```

```sh
chmod +x scripts/check-singletons.sh
```

`Jenkinsfile` — nouvelle étape, après celle qui installe les dépendances :

```groovy
    stage('Check singletons') {
      steps {
        sh './scripts/check-singletons.sh'
      }
    }
```

---

# `actualites` · `support`

*1 copie du socle, aucun package Edifice tiers dans le graphe — aucune exposition.*

### 1. Filet au niveau du bundler

`frontend/vite.config.ts` — dans `resolve`, avant `alias` :

```ts
    resolve: {
      dedupe: [
        'react',
        'react-dom',
        '@edifice.io/react',
        '@edifice.io/client',
        '@tanstack/react-query',
        'react-hook-form',
        'react-i18next',
      ],
      alias: {
```

### 2. Garde-fou CI

`scripts/check-singletons.sh` — nouveau fichier :

```sh
#!/bin/sh
# Fails the build if an Edifice singleton is physically duplicated in node_modules.
# Counts .pnpm directories rather than querying `pnpm why`: only this catches peer
# variants, which `pnpm why` reports as a single version.
set -u
status=0
for pkg in "@edifice.io+react" "@edifice.io+client" "@tanstack+react-query" "react" "react-dom"; do
  n=$(ls -d node_modules/.pnpm/${pkg}@* 2>/dev/null | wc -l | tr -d ' ')
  if [ "$n" -gt 1 ]; then
    echo "FAIL: ${pkg} has ${n} physical copies:"
    ls -d node_modules/.pnpm/${pkg}@* | sed 's|.*/|  |'
    status=1
  fi
done
[ "$status" -eq 0 ] && echo "OK: no duplicated singleton."
exit $status
```

```sh
chmod +x scripts/check-singletons.sh
```

`Jenkinsfile` — nouvelle étape, après celle qui installe les dépendances :

```groovy
    stage('Check singletons') {
      steps {
        sh './scripts/check-singletons.sh'
      }
    }
```

---

# `entcore` (fronts `auth` et `timeline`)

*1 copie du socle, aucun package Edifice tiers dans le graphe — aucune exposition. Les deux fronts sont sur leur propre tag : `develop-enabling` pour `auth`, `develop-b2school` pour `timeline`.*

### 1. Filet au niveau du bundler

`auth/frontend/vite.config.ts` **et** `timeline/frontend/vite.config.ts` — dans `resolve`, avant `alias` :

```ts
    resolve: {
      dedupe: [
        'react',
        'react-dom',
        '@edifice.io/react',
        '@edifice.io/client',
        '@tanstack/react-query',
        'react-hook-form',
        'react-i18next',
      ],
      alias: {
```

### 2. Garde-fou CI

`scripts/check-singletons.sh` — nouveau fichier. À exécuter depuis chaque front, car chacun a son propre
`node_modules` :

```sh
#!/bin/sh
# Fails the build if an Edifice singleton is physically duplicated in node_modules.
# Counts .pnpm directories rather than querying `pnpm why`: only this catches peer
# variants, which `pnpm why` reports as a single version.
# Usage: ./scripts/check-singletons.sh auth/frontend
set -u
cd "${1:-.}" || exit 1
status=0
for pkg in "@edifice.io+react" "@edifice.io+client" "@tanstack+react-query" "react" "react-dom"; do
  n=$(ls -d node_modules/.pnpm/${pkg}@* 2>/dev/null | wc -l | tr -d ' ')
  if [ "$n" -gt 1 ]; then
    echo "FAIL: ${pkg} has ${n} physical copies:"
    ls -d node_modules/.pnpm/${pkg}@* | sed 's|.*/|  |'
    status=1
  fi
done
[ "$status" -eq 0 ] && echo "OK: no duplicated singleton."
exit $status
```

```sh
chmod +x scripts/check-singletons.sh
```

`Jenkinsfile` — nouvelle étape, après celle qui installe les dépendances :

```groovy
    stage('Check singletons') {
      steps {
        sh './scripts/check-singletons.sh auth/frontend'
        sh './scripts/check-singletons.sh timeline/frontend'
      }
    }
```

---

# `edifice-frontend-framework`

*Le socle est conforme. Il héberge l'outillage de contrôle, pour n'avoir qu'un point de maintenance.*

### 1. Publier le script de vérification dans le CLI

`packages/cli/scripts/check-singletons.sh` — nouveau fichier :

```sh
#!/bin/sh
# Fails the build if an Edifice singleton is physically duplicated in node_modules.
# Counts .pnpm directories rather than querying `pnpm why`: only this catches peer
# variants, which `pnpm why` reports as a single version.
# Usage: check-singletons.sh [path-to-project]
set -u
cd "${1:-.}" || exit 1
status=0
for pkg in "@edifice.io+react" "@edifice.io+client" "@tanstack+react-query" "react" "react-dom"; do
  n=$(ls -d node_modules/.pnpm/${pkg}@* 2>/dev/null | wc -l | tr -d ' ')
  if [ "$n" -gt 1 ]; then
    echo "FAIL: ${pkg} has ${n} physical copies:"
    ls -d node_modules/.pnpm/${pkg}@* | sed 's|.*/|  |'
    status=1
  fi
done
[ "$status" -eq 0 ] && echo "OK: no duplicated singleton."
exit $status
```

```sh
chmod +x packages/cli/scripts/check-singletons.sh
```

---

# Vérifier le résultat

*Depuis la racine du repo, sans installer. Plus d'une copie = duplication.*

```sh
pnpm install --lockfile-only --ignore-scripts
grep -cE "^  '?@edifice\.io/react@.*\("        pnpm-lock.yaml   # copies du socle
grep -cE "^  '?@tanstack/react-query@[0-9].*\(" pnpm-lock.yaml   # copies de react-query
```
