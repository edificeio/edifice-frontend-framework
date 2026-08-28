# ENABLING-1099 · 1 — Constats mesurés

↩ [Document principal](../../ENABLING-1099-NORME-VERSIONS-PACKAGES.md) · [2 — Actions](2-actions.md) · [3 — Méthode](3-methode.md) · [4 — Actions par repo](4-actions-par-repo.md)

Mesures du 28/07/2026. Méthode de mesure : [3 — Méthode](3-methode.md).

---

## Vocabulaire

### Repo ou package npm

Distinction indispensable : dans ce document, un nom en texte simple (`collect`) désigne le **repo**, un
nom en code (`@edifice.io/collect-frontend`) désigne le **package npm**. Ce sont souvent deux choses du
même repo.

| Repo | Racine | Front (`<repo>/frontend`) | Publié sur npm ? |
| --- | --- | --- | --- |
| `explorer` | *pas un workspace* | **`ode-explorer`** | **oui** — `files: ["dist", "lib"]` |
| `wiki` | *pas un workspace* | **`@edifice.io/wiki`** | **oui** — `files: ["lib"]` |
| `collect` | `@edifice.io/collect` *(privé)* | **`@edifice.io/collect-frontend`** | **oui** — `files: ["lib"]` |
| `rack` | `@edifice.io/rack` *(privé)* | `@edifice.io/rack-frontend` | non — `private: true` |
| `communities` | `@edifice.io/community` *(privé)* | `@edifice.io/community-frontend` | non — `private: true` |
| `homeworks` | `@edifice.io/homeworks` *(privé)* | `homeworks-frontend` | non — `private: true` |

Deux pièges de lecture :

- **`collect` et `@edifice.io/collect-frontend` sont le même repo.** `collect` est la racine du workspace
  pnpm (membres `client/rest`, `frontend`, `backend`), et `collect/frontend` est le membre publié sous le
  nom `@edifice.io/collect-frontend`. Corriger « collect » et corriger « collect-frontend » désigne donc
  le même fichier : `collect/frontend/package.json`.
- **`wiki` désigne à la fois le repo et le package publié**, qui portent le même nom.

### Rôles

| Rôle | Package(s) | Nature |
| --- | --- | --- |
| **Lib socle** | repo `edifice-frontend-framework` → `@edifice.io/react`, `client`, `bootstrap`, `utilities`, `tiptap-extensions` | Brique commune à la flotte. `@edifice.io/react` et `@edifice.io/client` sont les singletons. |
| **Lib partagée** | `ode-explorer` (repo `explorer`) | Seule vraie lib front. Consommée par **8 fronts** : blog, collaborative-wall, homeworks, mindmap, rack, wiki, collect, boilerplate. |
| **Fronts d'app publiés** | `@edifice.io/wiki` → embarqué par communities · `@edifice.io/collect-frontend` → embarqué par rack et communities | Ce sont des **apps**, qui publient en plus un build `lib` (`vite build --mode lib`) pour qu'une autre app intègre leur front. |

Le critère qui compte n'est pas la nature de l'app mais **le fait d'être publié** : seuls 3 fronts sur 14
le sont (`ode-explorer`, `@edifice.io/wiki`, `@edifice.io/collect-frontend`), les 11 autres sont
`private: true` et ne peuvent donc être embarqués par personne. Ce sont exactement les 3 cibles de N9.

Dès qu'un front est publié, il se comporte comme une lib dans l'arbre de son hôte et doit en respecter les
règles. C'est par ce chemin que `@edifice.io/react@2.5.24` est entré dans `rack`.

**Le socle est conforme** : dépendances internes en `workspace:*`, publication par `pnpm publish -r` qui
les réécrit en versions exactes. Vérifié sur le registre — les 6 packages publiés, sur `latest` comme sur
`develop`, ont zéro spec `workspace:`, et `@edifice.io/react@develop` déclare
`"@edifice.io/bootstrap": "2.6.0-develop.20260727123808"`.

---

## Mécanisme du bug

```
packages/react/src/providers/EdificeClientProvider/EdificeClientProvider.hook.tsx:8
  throw new Error(`Cannot be used outside of EdificeClientProvider`);
```

Un contexte React est identifié par l'objet rendu par `createContext()`, pas par son nom. Deux copies
physiques du module produisent deux objets distincts :

```
App
└─ <EdificeClientProvider>          ← remplit le contexte de la copie A
   └─ <ComposantVenantDeOdeExplorer>
      └─ useEdificeClient()          ← lit le contexte de la copie B → undefined → throw
```

La page « oops » de homeworks, sans 401 réseau, est la même famille de panne : un `ErrorBoundary` qui
attrape un throw de provider.

**Condition nécessaire et non suffisante** : il faut deux copies **et** un Provider et un consommateur de
part et d'autre. D'où des états dégradés silencieux.

---

## Copies actives par front

Résolution de la configuration de **la branche de référence** de chaque repo, via
`pnpm install --lockfile-only`. Mesure reproductible et indépendante de l'état des clones locaux.

| Front | Réf. | Socle : copies / versions | `react-query` : copies / versions |
| --- | --- | --- | --- |
| **communities** | `develop` | **3** / 1 | **2** / **2** |
| **rack** | `dev` | **2** / 1 | **2** / **2** |
| **collect** | `develop` | **2** / 1 | **2** / **2** |
| **boilerplate** | `main` | **2** / 1 | **2** / **2** |
| blog | `develop` | 1 / 1 | 1 / 1 |
| collaborative-wall | `develop` | 1 / 1 | 1 / 1 |
| mindmap | `develop` | 1 / 1 | 1 / 1 |
| wiki | `develop` | 1 / 1 | 1 / 1 |
| actualites | `dev` | 1 / 1 | 1 / 1 |
| support | `dev` | 1 / 1 | 1 / 1 |
| entcore/auth | `dev` | 1 / 1 | 1 / 1 |
| entcore/timeline | `dev` | 1 / 1 | 1 / 1 |
| explorer *(lib)* | `develop` | 1 / 1 | 1 / 1 |
| homeworks | `dev` | 1 *(arbre installé)* | 1 *(arbre installé)* |

**4 fronts sur 14 sont concernés.** `homeworks` n'est pas résolvable sans jeton de registre privé ; la
mesure de son arbre installé donne 1 copie.

Sur les branches de référence, le socle n'a **qu'une version** partout : le dist-tag l'unifie. Toute la
duplication vient des **variantes de peers**.

## La cause tient en une ligne

`ode-explorer` épingle `"@tanstack/react-query": "5.62.7"` en version exacte. La corrélation est totale :

| Pin `react-query` de l'app | Consomme un package Edifice tiers | Copies du socle |
| --- | --- | --- |
| `5.62.7` — identique à `ode-explorer` | oui | **1** |
| `5.81.5` ou `5.90.21` — divergent | oui | **2 ou 3** |
| n'importe lequel | non | **1** |

> **Une app est dupliquée si et seulement si son pin `@tanstack/react-query` diffère de `5.62.7`
> *et* qu'elle compose un package Edifice tiers.**

Détail par front :

| Front | Son pin | Compose | Copies |
| --- | --- | --- | --- |
| blog · collaborative-wall · mindmap · wiki | `5.62.7` | `ode-explorer` | **1** |
| **rack** · **collect** | `5.81.5` | `ode-explorer` | **2** |
| **communities** | `5.81.5` | `collect-frontend`, `wiki` | **3** |
| **boilerplate** | `5.90.21` | `ode-explorer` | **2** |
| actualites | `5.62.7` | — | 1 |
| support · entcore/auth · entcore/timeline | `5.90.21` | — | 1 |

Résolution par importeur sur `rack@dev` :

```
frontend (app)                 -> react-query 5.81.5 | react-hook-form 7.62.0 | react-i18next 14.1.0
@edifice.io/collect-frontend   -> react-query 5.81.5 | react-hook-form 7.62.0 | react-i18next 14.1.0
ode-explorer                   -> react-query 5.62.7 | react-hook-form 7.62.0 | react-i18next 14.1.0
```

`communities` atteint 3 copies parce qu'`@edifice.io/wiki` introduit une troisième combinaison
(`react-query 5.62.7` + `react-hook-form 7.71.1`) :

```
frontend (app)                 -> react-query 5.81.5 | react-hook-form 7.62.0
@edifice.io/collect-frontend   -> react-query 5.81.5 | react-hook-form 7.62.0
@edifice.io/wiki               -> react-query 5.62.7 | react-hook-form 7.71.1
ode-explorer                   -> react-query 5.62.7 | react-hook-form 7.62.0
```

`homeworks` épingle `5.90.21`, donc divergent, et composerait `ode-explorer` — mais son override racine
`@tanstack/react-query: 5.90.21` s'applique aussi à `ode-explorer`, qui résout vers `5.90.21` au lieu de
son pin `5.62.7`. Une seule combinaison, une seule copie : **un override racine bat un pin exact
transitif**.

---

## `ode-explorer` est déclaré sans être utilisé dans 3 fronts

Sur les 8 fronts qui déclarent `ode-explorer`, **3 ne l'importent jamais** :

| Front | Import dans les sources | Autre référence |
| --- | --- | --- |
| blog · collaborative-wall · homeworks · mindmap · wiki | `import { Explorer } from 'ode-explorer/lib'` | — |
| **rack** | **aucune** | aucune référence dans tout le repo |
| **collect** | **aucune** | seulement l'aide `pnpm link` de `build.sh` |
| **boilerplate** | **aucune** | seulement l'aide `pnpm link` de `build.sh` |

L'origine est le **boilerplate**, qui embarque la déclaration et l'aide de linking : les apps dérivées
héritent des deux, qu'elles utilisent l'explorer ou non.

Effet mesuré du retrait de la dépendance inutilisée :

| Front | Avant | Après retrait | `ode-explorer` dans l'arbre |
| --- | --- | --- | --- |
| **collect** | 2 copies | **1 copie** | disparaît |
| **boilerplate** | 2 copies | **1 copie** | disparaît |
| **rack** | 2 copies | 2 copies | subsiste, apporté par `collect-frontend` |

`collect/frontend` **est** `@edifice.io/collect-frontend` : sa dépendance inutilisée est donc republiée
vers tous ses consommateurs. Dans `rack`, `ode-explorer` n'a plus qu'un seul fournisseur après retrait de
la dépendance directe :

```
@edifice.io/collect-frontend@1.0.4-develop.1  ->  ode-explorer 2.6.3-develop.202607291152
```

Retirer la dépendance des deux côtés — `rack/frontend` et `collect/frontend` — sort donc `ode-explorer` de
l'arbre de `rack`. Reste à remesurer après republication de `collect-frontend`.

---

## Les 6 peers du socle

`@edifice.io/react` déclare 6 `peerDependencies`. pnpm matérialise **un répertoire par combinaison de
peers résolue**. Valeurs de référence — catalog du socle (`pnpm-workspace.yaml`) :

| Peer | Catalog |
| --- | --- |
| `react` / `react-dom` | `18.3.1` |
| `@tanstack/react-query` | `5.62.7` |
| `react-hook-form` | `7.71.1` |
| `react-i18next` | `14.1.3` |
| `@react-spring/web` | `9.7.5` |

**`@tanstack/react-query` est le seul peer dupliqué** — 2 copies et 2 versions dans les 4 fronts
concernés, 1 partout ailleurs. `react`, `react-dom`, `react-hook-form` et `react-i18next` ne sont
dupliqués nulle part : leurs specs restent compatibles dans tout le graphe.

`@tanstack/react-query` est lui-même un singleton à contexte React (`QueryClient` diffusé par
`QueryClientProvider`) : sa duplication relève de la même famille de panne que celle du socle. Il est
donc **doublement en cause** — comme singleton dupliqué, et comme peer dont la divergence duplique le
socle.

Versions de `@tanstack/react-query` dans la flotte, sur les branches de référence :

| Version | Fronts |
| --- | --- |
| `5.62.7` (= catalog) | actualites, blog, collaborative-wall, mindmap, wiki, explorer |
| `5.81.5` | communities, rack, collect |
| `5.90.21` | entcore/auth, entcore/timeline, homeworks, support, boilerplate |

`auto-install-peers=true` est actif dans 12 des 14 `.npmrc`, et les peers du socle sont en range `^` :
pnpm installe le dernier `react-hook-form@7.x` du jour, donc l'empreinte de peers dérive au fil du temps
sans changement de code.

---

## Packages publiés

### `@edifice.io/collect-frontend` est ininstallable

```
$ npm view @edifice.io/collect-frontend@1.0.4 dependencies --json | grep workspace
    "@edifice.io/collect-client-rest": "workspace:*"

$ pnpm install
ERR_PNPM_WORKSPACE_PKG_NOT_FOUND  "@edifice.io/collect-client-rest@workspace:*" is in the
dependencies but no package named "@edifice.io/collect-client-rest" is present in the workspace
```

Le protocole `workspace:` doit être réécrit en version réelle à la publication. Cause —
`collect/package.json:50` publie avec `npm publish`, qui ne connaît pas ce protocole :

```
"publish:frontend": "... pnpm --filter *-frontend exec npm publish --no-git-checks ..."
```

Concerne `latest` et `develop`. C'est ce qui rend obligatoire l'override
`"@edifice.io/collect-client-rest": "1.0.4"` dans `rack`. Les autres publieurs (`wiki`, `explorer`,
socle) utilisent `pnpm publish`.

### Aucun des 3 packages ne déclare de `peerDependencies`

`ode-explorer`, `@edifice.io/collect-frontend` et `@edifice.io/wiki` déclarent `@edifice.io/react` en
`dependencies`. C'est ce qui autorise pnpm à leur installer leur propre copie du socle.

### Deux régimes de specs selon le train

| Train | Specs des packages publiés | Conséquence |
| --- | --- | --- |
| `develop` | dist-tags (`ode-explorer@develop → @edifice.io/react: develop`) | Un tag se résout une fois par install : pas de pins divergents. La duplication vient uniquement des peers. |
| `latest` | versions exactes, **incohérentes entre elles** | Pins indédoublonnables. |

Pins de `latest` :

| Package (`latest`) | `@edifice.io/react` | `ode-explorer` | `react-query` |
| --- | --- | --- | --- |
| `ode-explorer@2.6.3` | `2.6.0` | — | `5.62.7` |
| `@edifice.io/wiki@3.6.4` | `2.6.0` | `2.6.3` | `5.62.7` |
| `@edifice.io/collect-frontend@1.0.4` | **`2.5.24`** | **`2.6.2`** | **`5.81.5`** |

Aucune app n'est exposée aujourd'hui à ces pins : `rack` sur `master` a l'override
`@edifice.io/react: 2.6.0`, et `communities` est sur le train `develop`, donc en tags. Le train de release
ne tient toutefois que par cet override — une future app embarquant un front d'app sur ce train y serait
exposée.

### `ode-explorer` aligne son tag automatiquement

`explorer/frontend/package.json.template` exprime ses dépendances au socle en `%packageVersion%`,
substitué au build par le nom de la branche publiante. Un `ode-explorer@develop` déclare donc toujours
`@edifice.io/react: develop`. Aucun mélange de trains n'est constaté sur les branches de référence.

Mais **`frontend/package.json` est commité et non gitignoré**, avec des valeurs substituées obsolètes :

```
origin/develop:frontend/package.json
  "version": "2.2.12-develop.202510091718"     ← octobre 2025
  "@edifice.io/react": "develop-pedago"        ← alors que le train est develop
```

Le build regénère le fichier, donc rien ne casse ; mais le fichier commité contredit sa branche et fausse
toute lecture ou outillage d'analyse du graphe.

---

## Configuration

### Overrides placés dans un membre de workspace : ignorés

Vérifié en pnpm **9.12.2** et **10.33.0** : `resolutions` est honoré à la racine d'un projet, **ignoré
sans avertissement** dans un membre de workspace.

`rack/frontend`, `communities/frontend` et `collect/frontend` déclarent
`"resolutions": { "@tanstack/react-query": "5.81.5" }` et sont des membres de workspace. Ces trois blocs
sont sans effet. (`wiki/frontend` a aussi un `resolutions` (`katex`) — actif, car projet autonome.)

### Le lockfile est supprimé avant l'install en CI

13 des 14 `frontend/build.sh` font `rm -f pnpm-lock.yaml` dans `clean()`, appelée par Jenkins via
`./build.sh clean init build`. Le garde-fou pnpm de désalignement lockfile/`package.json` ne peut donc pas
se déclencher : il n'y a plus de lockfile au moment du `pnpm install`.

`--frozen-lockfile` existe dans 3 workflows GitHub Actions (actualites, support, boilerplate), c'est-à-dire
la CI de test. Il est absent de tous les Jenkinsfile. `wiki` l'a retiré explicitement :

```yaml
# Without --frozen-lockfile since we don't commit pnpm-lock.yaml
```

### `sync:lockfile` met à jour au lieu de synchroniser

`rack`, `collect` et `communities` :

```
"sync:lockfile": "pnpm update \"@edifice.io/*\"",
"install:prod":  "pnpm run sync:lockfile && pnpm -r install"
```

`install:prod` est appelé par `build.sh` juste avant le build de production : ces trois apps re-résolvent
tous les tags `@edifice.io/*` au moment du build de prod. `homeworks` n'a pas ce script.

### `resolve.dedupe`

1 front sur 14 en configure un : `homeworks`, avec `['react','react-dom']`.

### Toolchain

`packageManager` : `pnpm@9.12.2` pour 13 fronts sur 14, `pnpm@10.18.2` pour `homeworks`. L'écart notable
est **intra-repo** : `rack`, `homeworks`, `communities` et `collect` déclarent `pnpm@10.x` à la racine et
`pnpm@9.12.2` dans leur front. `engines.node` : 5 valeurs distinctes. Aucun `.nvmrc`.

### Dist-tags

`@edifice.io/react` expose **21 dist-tags**, `ode-explorer` **24**. Plusieurs pointent vers des branches
mortes (`zookeeper`, `fix-query-params`, `develop-rc`…) et restent installables.

### `linkDependencies` duplique le socle en local

Tous les `frontend/build.sh` exposent `pnpm link --global "@edifice.io/$dep"`. Constaté :

```
communities/frontend/node_modules/@edifice.io/react -> ../../../../edifice-frontend-framework/packages/react
explorer/frontend/node_modules/@edifice.io/react    -> ../../../../edifice-frontend-framework/packages/react
```

Le front pointe vers le socle local, `ode-explorer` — installé depuis le registre — vers le socle publié :
deux copies par construction. **Sans effet sur les artefacts livrés** (la CI ne lie jamais), mais peut
produire un `Cannot be used outside of EdificeClientProvider` en local avec une CI verte.

---

## Banc d'essai

Topologie rack reproduite avec pnpm 10.33, `auto-install-peers=true`, workspace racine + membre
`frontend`. Mesure = entrées `snapshots:` de `@edifice.io/react` dans le lockfile, soit le nombre de
répertoires physiques créés.

| # | Scénario | Versions | **Copies** |
| --- | --- | --- | --- |
| **A** | Train release : pins exacts + overrides de `rack` | 1 | **4** |
| **B** | A + les 6 peers pinnés dans `pnpm.overrides` | 1 | **1** |
| **C1** | Train intégration : tout en tag `develop`, aucun override | 1 | **3** |
| **C2** | C1 + overrides `@edifice.io/*` valués par le tag `develop` | 1 | **3** |
| **C3** | C1 + les 6 peers pinnés | 1 | **1** |
| **D1** | Mélange de trains : app `develop` + packages `develop-pedago` | **2** | **3** |
| **D2** | D1 + overrides tag + 6 peers pinnés | 1 | **1** |
| **E1** | `peerDependencies` dans les packages, **aucun peer pinné**, 2 packages en `react-query` 5.62.7 et 5.90.21 face à une app en 5.81.5 | 1 | **1** |
| **E2** | E1, l'app ne fournit pas le socle (posé par `auto-install-peers`) | 1 | **1** |

Le scénario A résout les peers `^` à la date d'exécution : il remonte 4 variantes là où l'arbre installé de
`rack` en a 2 actives. C'est une borne haute et une illustration de la dérive dans le temps, pas une mesure
de l'existant.

Empreintes de peers du scénario A :

```
react-query@5.62.7  react-hook-form@7.62.0  react-i18next@14.1.0
react-query@5.62.7  react-hook-form@7.83.0  react-i18next@14.1.0
react-query@5.81.5  react-hook-form@7.62.0  react-i18next@14.1.0
react-query@5.81.5  react-hook-form@7.71.1  react-i18next@14.1.3
```

**Ce que le banc établit :**

- **C1 vs C2** : sur un train à tags, overrider `@edifice.io/*` ne change rien — le tag unifie déjà la
  version. Ce sont les peers qui produisent la duplication.
- **C3, B** : pinner les 6 peers ramène à une copie, sans toucher aux tags ni aux versions du socle.
- **D1 vs D2** : les overrides `@edifice.io/*` ne servent que contre le mélange de trains.
- **E1, E2** : `peerDependencies` ramène à une copie **sans exiger aucune convergence des peers** — trois
  versions de `react-query` coexistent sans dupliquer le socle. `auto-install-peers=true` ne dégrade rien :
  il ne se déclenche que si le peer est absent.
- Un dist-tag est une valeur d'override valide (C2, C3, D2 s'installent).
