# ENABLING-1099 · 2 — Actions

↩ [Document principal](../../ENABLING-1099-NORME-VERSIONS-PACKAGES.md) · [1 — Constats](1-constats.md) · [3 — Méthode](3-methode.md) · [4 — Actions par repo](4-actions-par-repo.md)

> **`@edifice.io/react`, `@edifice.io/client` et `@tanstack/react-query` sont des singletons.**
> Une app doit garantir qu'il n'en existe **qu'une copie physique** dans son `node_modules`.
> Ce n'est pas la version qui compte, c'est l'unicité.

---

## N11 — Retirer les dépendances `ode-explorer` inutilisées

**Importance : élevée, et coût le plus faible de tout le document.** Trois fronts déclarent `ode-explorer`
sans jamais l'importer : `rack`, `collect` et `boilerplate`. L'origine est le boilerplate, qui embarque la
déclaration et l'aide `pnpm link` de `build.sh` ; les apps dérivées héritent des deux.

| Front | Action | Effet mesuré |
| --- | --- | --- |
| **collect** | supprimer `"ode-explorer"` de `frontend/package.json` | **2 → 1 copie**, `ode-explorer` sort de l'arbre |
| **boilerplate** | idem | **2 → 1 copie**, `ode-explorer` sort de l'arbre |
| **rack** | idem | 2 copies inchangées : `ode-explorer` reste apporté par `collect-frontend` |

`collect/frontend` **est** `@edifice.io/collect-frontend` : sa dépendance inutilisée est republiée vers
`rack` et `communities`. Corriger `collect` bénéficie donc aussi à ses consommateurs — après
republication, `ode-explorer` n'a plus de fournisseur dans `rack` dès lors que sa dépendance directe est
également retirée.

Le bloc `linkDependencies` de `build.sh` est déjà conditionné à la présence de la clé dans `package.json`
(`sed -n '/"ode-explorer":/p'`) : il devient inerte de lui-même, aucune modification nécessaire.

**Impact** : 3 `package.json`, dont celui du gabarit pour ne plus propager la déclaration.
**Inconvénient** : aucun — une dépendance non importée ne peut rien casser. Vérifier tout de même
l'absence de référence en dehors des sources (build, i18n, assets) avant retrait.

**Ordre** : à faire **avant** N9. Une dépendance supprimée n'a pas besoin de `peerDependencies`, et cela
réduit le périmètre de la republication.

---

## N6 — `pnpm publish`, jamais `npm publish`, dans un workspace

**Importance : bloquante.** `@edifice.io/collect-frontend` est ininstallable hors workspace sur `latest` et
`develop`. C'est aussi le prérequis de N9 sur `collect` : inutile de republier un package avec des
`peerDependencies` s'il fuit encore un spec `workspace:*`.

Un package publié ne doit jamais contenir de spec `workspace:`. `pnpm publish` les réécrit en versions
réelles, `npm publish` les laisse passer.

- Corriger `collect/package.json:50` : remplacer `pnpm --filter *-frontend exec npm publish` par
  `pnpm --filter *-frontend publish`.
- Republier `@edifice.io/collect-frontend` sur `latest` et sur `develop`.
- Vérifier après publication : `npm view <pkg>@<tag> dependencies --json | grep workspace:` doit être vide.

**Impact** : 1 ligne + 2 republications. **Inconvénient** : aucun.

---

## N5 — Check CI « une seule copie physique »

**Importance : élevée.** Seul garde-fou automatique. À poser **avant** N9 : il fournit la mesure de
référence, puis surveille les régressions en permanence.

Dans le pipeline Jenkins (celui qui livre), après `pnpm install` et avant le build :

```sh
#!/bin/sh
# Fails the build if an Edifice singleton is physically duplicated in node_modules.
# Counts .pnpm directories rather than querying `pnpm why`: only this catches peer
# variants, which `pnpm why` reports as a single version.
status=0
for pkg in "@edifice.io+react" "@edifice.io+client" "@tanstack+react-query" "react" "react-dom"; do
  n=$(ls -d node_modules/.pnpm/${pkg}@* 2>/dev/null | wc -l | tr -d ' ')
  if [ "$n" -gt 1 ]; then
    echo "FAIL: ${pkg} has ${n} physical copies:"
    ls -d node_modules/.pnpm/${pkg}@* | sed 's|.*/|  |'
    status=1
  fi
done
exit $status
```

Compter les répertoires de `.pnpm` est délibéré : c'est la seule méthode qui attrape les variantes de
peers, que `pnpm why` présente comme une version unique.

En CI le `node_modules` est neuf, donc le comptage de répertoires est fiable. Pour un usage local, utiliser
la version « copies actives » de [3 — Méthode](3-methode.md), qui écarte les orphelins.

**Impact** : 1 script dans `@edifice.io/cli` + 1 étape dans 10 Jenkinsfile.
**Inconvénients** : dépend du layout interne de `.pnpm`, susceptible de changer entre majeures de pnpm ;
inopérant en `node-linker=hoisted`. Héberger le script dans le CLI pour n'avoir qu'un point de maintenance.

---

## N9 — `peerDependencies` dans tout package publié qui consomme le socle

**Importance : élevée.** Supprime la cause structurelle de la duplication au lieu de la neutraliser app par
app, et se propage seule aux 8 fronts consommateurs.

> **Règle** : tout package publié sur npm qui consomme `@edifice.io/react`, `@edifice.io/client` ou
> `@tanstack/react-query` doit les déclarer en **`peerDependencies`**, jamais en `dependencies`. Cela vaut
> pour la lib partagée `ode-explorer` comme pour toute app publiant son front pour être embarquée.

| Package | Consommé par | Ordre |
| --- | --- | --- |
| `ode-explorer` | **8 fronts** | 1 |
| `@edifice.io/collect-frontend` | rack, communities | 2 |
| `@edifice.io/wiki` | communities | 3 |

```json
{
  "peerDependencies": {
    "@edifice.io/react": "*",
    "@edifice.io/client": "*",
    "@edifice.io/bootstrap": "*",
    "@tanstack/react-query": "^5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@edifice.io/react": "develop"
  }
}
```

### Pourquoi les mêmes clés dans `peerDependencies` et `devDependencies`

Ce n'est pas une duplication : les deux champs s'adressent à deux publics différents.

| Champ | Signification | Qui l'installe |
| --- | --- | --- |
| `dependencies` | « installe-la pour moi » | pnpm crée une copie **imbriquée** dans le sous-arbre du package — c'est la cause du bug |
| `peerDependencies` | « je l'utilise, l'hôte la fournit » | personne : résolution vers la copie de l'app hôte, donc **une seule instance** |
| `devDependencies` | « installe-la quand on travaille sur *ce* repo » | **jamais installée chez les consommateurs** : npm et pnpm ignorent les `devDependencies` d'un package installé |

- Le bloc `peerDependencies` parle aux apps consommatrices : *ne me donne pas ma propre copie, donne-moi la
  tienne.*
- Le bloc `devDependencies` parle au repo lui-même : il doit continuer à builder, tester et servir en dev.
  Sans lui, le package serait absent de son propre `node_modules`.

Retirer les clés de `dependencies` est indispensable : `dependencies` gagne, et la copie imbriquée serait
installée malgré la déclaration de peer.

Les versions diffèrent parce que les deux champs expriment autre chose : le peer est un **range** —
contrainte sur ce que l'hôte peut fournir, volontairement large car l'hôte suit un dist-tag mouvant ; le
dev est un **spec exact** — la version réellement utilisée pour builder ce repo.

C'est déjà le motif du socle : `packages/react/package.json` déclare ses 6 peers dans `peerDependencies`
**et** `devDependencies`, et aucun dans `dependencies`.

### Détails de la liste

- `@tanstack/react-query` est **indispensable** dans la liste : c'est le second singleton dupliqué.
- `ode-explorer` **n'a pas besoin d'y figurer** : `collect-frontend` ne l'importe pas (retiré par N11), et
  `@edifice.io/wiki` l'importe réellement — une fois `ode-explorer` lui-même passé en `peerDependencies`,
  il n'apporte plus sa propre copie du socle.
- Pour `ode-explorer`, la modification va dans **`package.json.template`**, pas dans le `package.json`
  généré.

### Propagation

Deux faits la rendent automatique :

1. Les 10 fronts qui composent un package Edifice tiers le spécifient par un **dist-tag** (`develop`),
   jamais par une version exacte.
2. 13 des 14 `frontend/build.sh` suppriment le lockfile avant l'install CI : chaque build re-résout tout.

Republier `ode-explorer@develop` suffit donc : le tag bouge, les 8 fronts consommateurs récupèrent la
correction au build suivant. **Aucune squad n'a de configuration à écrire.** Seul le train de release
(`master`/`latest`), en versions exactes, demande un bump explicite.

### Inconvénients

| Inconvénient | Détail |
| --- | --- |
| `"*"` est laxiste : aucune incompatibilité n'est détectée par pnpm. | Un range strict (`">=2.6.0 <3"`) est inutilisable : une prerelease `2.6.0-develop.20260727123808` ne satisfait pas `>=2.6.0` en semver. Le contrôle de version reste du ressort de l'app. |
| **La copie privée du socle masque aujourd'hui les incompatibilités de version.** En passant au socle fourni par l'hôte, une incompatibilité réelle se manifestera par une erreur d'export manquant. | C'est le risque principal. Dérouler **un package à la fois, avec validation d'une app pilote** — jamais les trois d'un coup. |
| Une app qui ne déclarerait pas le socle se le verrait installé par `auto-install-peers`, sans contrôle de version. | Sans danger côté duplication (mesuré), et les 13 apps le déclarent déjà. Couvert par N5. |

**Impact** : 3 `package.json` + une campagne de republication et de validation. Aucun `.npmrc` à modifier,
aucune convergence de peers à négocier.

---

## N4 — `resolve.dedupe` dans chaque `vite.config`

**Importance : moyenne.** Filet au niveau du bundler, en défense en profondeur.

```ts
resolve: {
  dedupe: [
    'react', 'react-dom',
    '@edifice.io/react', '@edifice.io/client',
    '@tanstack/react-query', 'react-hook-form', 'react-i18next',
  ],
}
```

**Impact** : 14 `vite.config.ts`, 7 lignes chacun. 13 sur 14 n'en ont pas.
**Inconvénient** : fait disparaître le symptôme dans le bundle sans corriger le `node_modules`, ce qui peut
retarder la détection d'un problème de graphe. À poser **en plus** de N9, jamais à la place. Ne protège pas
de façon identique le mode dev (`optimizeDeps`).

---

## N3 — Supprimer les `resolutions` placés dans un membre de workspace

**Importance : moyenne.** Ces blocs sont sans effet et laissent croire à une contre-mesure en place.

`pnpm.overrides` et `resolutions` ne sont lus qu'à la racine du projet pnpm. Ailleurs, no-op silencieux.

- Supprimer `"resolutions": { "@tanstack/react-query": "5.81.5" }` de `rack/frontend`,
  `communities/frontend` et `collect/frontend`. Sous N9, la convergence de `react-query` n'est plus
  nécessaire : inutile de remonter ces blocs à la racine.
- Préférer partout `pnpm.overrides` à `resolutions` : les deux fonctionnent (vérifié en 9.12.2 et 10.33.0),
  mais `resolutions` est un champ Yarn dont le support pnpm est un alias de compatibilité.

**Impact** : 3 `package.json`. **Inconvénient** : aucun, une fois N9 en place.

---

## N10 — Ne pas committer d'artefact de build généré

**Importance : moyenne.** `explorer/frontend/package.json` est généré depuis `package.json.template` et
pourtant commité, avec des valeurs qui contredisent le train de sa branche. Il fausse toute lecture du
graphe de dépendances, humaine ou outillée.

Deux options, aucune parfaite :

| Option | Inconvénient |
| --- | --- |
| Gitignorer `frontend/package.json` | Inhabituel, déroute les outils (IDE, Dependabot, audits de dépendances) |
| Hook pre-commit qui régénère depuis le template | Bruit de diff à chaque changement de branche |

Trancher et documenter le choix dans le README d'`explorer`.

**Impact** : 1 `.gitignore` ou 1 hook + 1 note.

---

## N8 — Retirer `sync:lockfile` de `install:prod`

**Importance : moyenne.** Supprime une re-résolution non contrôlée des tags au moment du build de
production.

Retirer `pnpm update "@edifice.io/*"` de la chaîne de build de `rack`, `collect` et `communities`. Le bump
de dépendances est un acte volontaire et relu, pas un effet de bord du build de prod. `homeworks` montre la
cible : son `install:prod` est un simple `pnpm -r install`.

**Impact** : 3 `package.json`.
**Inconvénient** : ces 3 apps perdent la remontée automatique du dernier tag ; le bump devient une
modification visible en PR.

---

## N2 — Un seul train (tag) par app

**Importance : préventive.** Aucune occurrence sur les branches de référence ; le risque est mesuré
(scénario D1 : 2 versions, 3 copies).

Si une app est sur `develop-enabling`, alors tous les `@edifice.io/*` et `ode-explorer` sont sur
`develop-enabling`, override inclus. Si un tag n'existe pas pour un package, le fallback sur `develop` doit
être **écrit** dans l'override plutôt que subi à l'install, pour rester visible en revue.

**Impact** : règle de revue, vérifiable par N5.
**Inconvénient** : bloque le cas « j'ai besoin d'un fix qui n'est que sur le train d'à côté ». La sortie
propre est de publier le fix sur son propre train.

---

## N7 — Aligner la toolchain

**Importance : faible.** Aucun incident constaté, mais l'écart intra-repo est une source de surprise.

`packageManager` identique dans un même repo et entre repos (cible `pnpm@10.x`), `engines.node` identique,
un `.nvmrc` par repo. Priorité aux 4 repos qui déclarent `pnpm@10.x` à la racine et `pnpm@9.12.2` dans leur
front : `rack`, `homeworks`, `communities`, `collect`.

**Impact** : 14 `package.json` + 4 racines + validation d'un build par app, par vagues.
**Inconvénient** : migrer 9 → 10 change le `lockfileVersion` et durcit l'exécution des scripts d'install.
