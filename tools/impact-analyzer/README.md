# Impact Analyzer (ENABLING-1023)

Cartographie, pour chaque export public des packages `@edifice.io/*`, quelles
apps React consommatrices l'utilisent, où, et avec quel niveau de risque.
Voir `PLAN-impact-analyzer.md` (cadrage complet) et
`REVIEW-impact-analyzer.md` (revue critique, pistes d'évolution) dans ce
dossier.

Ce package couvre les **Jalons 0 à 7** du plan : mode local complet,
discovery distante via l'API GitHub Contents (`--mode=ci`, pour `generate`
**et** `diff`), cache incrémental par SHA, résilience aux échecs partiels,
automatisation via un workflow GitHub Actions CRON, et le **viewer hébergé en
interne** (Jalon 6, périmètre retenu = viewer uniquement, pas de commentaire
PR ni d'export QA séparé) — image Docker distroless, déployée par l'infra sur
`k8s-preprod-services` (Helm + ArgoCD), accessible via VPN sur
`impact-analyzer-viewer.ode.tools` (voir "CRON" et `viewer/k8s-chart-reference/`
pour le détail).

## Prérequis

- Les repos des apps consommatrices doivent être clonés en frères de ce repo
  (`../<repo>` par défaut, ex. `/Volumes/Work/communities` si ce repo vit
  dans `/Volumes/Work/edifice-frontend-framework`). Chemin racine
  surchageable via `IMPACT_ANALYZER_REPOS_ROOT`.
- **Aucune branche n'est jamais checkout/fetch/pull automatiquement** sur ces
  repos frères : l'outil lit uniquement l'état actuellement présent sur
  disque (branche, SHA, dirty) et le restitue tel quel — jamais de mutation
  du working tree d'un autre repo.
- Plusieurs apps enregistrées peuvent partager un même repo frère via le
  champ `path` (ex. `conversation`/`portal`/`timeline`, toutes trois dans
  `../entcore`) : en mode local, elles lisent donc **le même clone, la même
  branche courante et le même commit** — cette branche n'est pas forcément
  l'une des branches V1 listées dans `apps.json` (aucun checkout automatique,
  cf. ci-dessus), c'est une limitation déjà existante du mode local,
  simplement partagée par les trois apps au lieu d'une seule.
- `impact diff` matérialise la branche `base` du FF **dans ce repo** via un
  `git worktree` jetable (jamais de checkout sur le worktree principal),
  puis symlink `node_modules` (racine + chaque `packages/*/node_modules`)
  dedans — nécessaire pour que `ts-morph` résolve correctement les types
  externes ; sans ça, des changements fantômes apparaissent sur des fichiers
  non touchés. `pnpm install` doit donc avoir tourné sur ce repo.

## Usage

```bash
# Génère l'index JSON pour l'état courant du disque (FF + apps du registre)
pnpm --filter @edifice.io/impact-analyzer generate:local

# Tests
pnpm --filter @edifice.io/impact-analyzer test

# Graphe explorable (recherche par symbole / par app / par diff)
pnpm --filter @edifice.io/impact-analyzer-viewer dev
# ou, sur le build de prod :
pnpm --filter @edifice.io/impact-analyzer-viewer build
pnpm --filter @edifice.io/impact-analyzer-viewer preview

# CLI locale (Jalon 7)
tsx src/cli.ts symbol Dropdown              # recherche un symbole, régénère l'index à la volée
tsx src/cli.ts symbol Dropdown --cached     # relit data/index.<branche>.json au lieu de régénérer
tsx src/cli.ts diff --base=develop          # classification 🔴/🟠/🟡 + score de risque (défaut: develop)
                                             # écrit aussi data/diff.<base>..<head>.json pour le viewer
tsx src/cli.ts diff --base=develop --mode=ci  # idem, mais découvre les apps consommatrices via l'API
                                               # GitHub au lieu des repos frères sur disque (mêmes crédentials
                                               # que generate --mode=ci) — pour tourner en CI, sans repos clonés

# Mode distant (Jalon 4) — voir section dédiée ci-dessous
pnpm --filter @edifice.io/impact-analyzer generate:ci

# Idem, avec cache incrémental par SHA (--mode=ci uniquement) : une app-branche
# dont le commit n'a pas bougé depuis l'index passé en --cache est réutilisée
# telle quelle plutôt que re-clonée/ré-analysée. Fichier absent ou introuvable
# → simplement ignoré (premier run, cache miss pour tout le monde).
pnpm --filter @edifice.io/impact-analyzer generate:ci -- --cache=data/index.develop.json
```

L'index est écrit dans `data/index.<branche-ff-courante>.json`, et un diff
dans `data/diff.<base>..<head>.json` (tous deux gitignorés, régénérés à la
demande — `impact diff` écrit systématiquement son rapport, même quand rien
n'a changé, pour que le viewer ait toujours quelque chose à afficher). Le
viewer synchronise ce dossier vers `viewer/public/data/` avant `dev`/`build`
(`viewer/scripts/sync-data.mjs`) et expose un onglet **Diff** dédié : il faut
relancer `impact diff` puis recharger la page pour voir un nouveau diff (pas
de régénération à la volée depuis le viewer, contrairement à l'onglet
Symboles).

## Registre des apps (`apps.json`)

Liste manuelle, maintenue à la main (une PR d'une ligne par app ajoutée/
retirée), pas d'auto-discovery. Le champ `branches` liste les **noms réels**
des branches V1 pour cette app (la convention de nommage varie selon les
repos, ex. `dev` vs `develop` — ne jamais supposer un nom générique) — en
mode local, il ne sert jamais à choisir quoi checkout : l'outil lit toujours
la branche réellement présente sur disque, quelle qu'elle soit. En mode
`--mode=ci`, c'est en revanche la seule source de vérité pour savoir quelles
branches interroger à distance (cf. ci-dessous).

Champ optionnel `path` : sous-dossier repo-relatif dans lequel vit l'app,
pour les monorepos où **plusieurs apps enregistrées partagent le même
`repo`**. Cas d'usage : `edificeio/entcore` héberge `conversation`,
`portal` et `timeline`, chacune dans son propre sous-dossier
(`conversation/`, `portal/`, `timeline/`) — trois entrées distinctes dans
`apps.json`, un `name` unique par entrée (contrainte inchangée), un `repo`
identique pour les trois. Absent = l'app vit à la racine du repo (layout de
toutes les apps enregistrées avant l'ajout de ce champ). Validé à l'import
(`assertOptionalPath`) : rejette les chemins avec `/` de tête/queue, `\`,
segment `.`/`..`, ou vide.

## Mode distant (`--mode=ci`)

Différences avec le mode local :
- Les apps sont découvertes via l'**API GitHub Contents** (pas de repo
  frère nécessaire sur disque) : pour chaque app × chaque branche listée
  dans son `apps.json.branches` (nom réel par app, jamais recoupé avec une
  liste générique), lecture à distance dans cet ordre de probe (premier hit
  gagne, préfixé par `<path>/` quand l'app a un `path` de monorepo) :
  1. `<path>/frontend/package.json`
  2. `<path>/frontend/package.json.template`
  3. `<path>/package.json`
  L'étape 2 existe pour des apps comme `conversation`/`portal` (entcore) qui
  gitignorent leur vrai `frontend/package.json` (généré au build) et
  committent à la place un `.template` avec des pins placeholder du type
  `%packageVersion%` — sinon 404 systématique en mode `--mode=ci` pour ces
  apps. Ces pins sont classées `template` par `classifyPin` (au lieu de
  `branch` par défaut) et affichées **telles quelles** (brutes) dans le
  viewer, sans tenter de les résoudre. Une branche absente côté GitHub est
  sautée silencieusement (comme en local) ; aucun des trois fichiers
  introuvable alors que la branche existe est un `scanError` listant les
  trois chemins préfixés tentés. Si **toutes** les branches d'une app sont
  absentes, un `scanError` informatif signale l'app entière (permet de
  distinguer un trou de config d'un souci d'accès repo/branche).
- Les couples `(app, branche)` confirmés consommateurs sont ensuite clonés
  **à la volée** dans un répertoire jetable (`git sparse-checkout`,
  profondeur 1, uniquement le sous-répertoire `src` pertinent), analysés
  avec le même moteur que le mode local (`analyzeAppUsage`/`buildCssMap`
  non modifiés), puis le clone est supprimé.
- Le FF lui-même reste **toujours lu en local** (`readRepoState`) : l'outil
  tourne dans ce repo, jamais besoin d'API pour le FF.
- `appDirty` vaut toujours `false` en mode CI (un clone frais n'est jamais
  dirty).
- **Cache incrémental par SHA** (`--cache=<index.json>`) : chaque app-branche
  scannée avec succès est enregistrée dans `ImpactIndex.appStates` (commit
  effectivement scanné). Au run suivant, si le commit courant d'une
  app-branche matche son `appStates` précédent, elle n'est **ni clonée ni
  ré-analysée** — ses `ConsumerEntry`/`CssConsumerEntry`/`OutOfContractImport`
  sont recopiés tels quels depuis l'index précédent (`carry-forward.ts`,
  matché par `package|entry|name` pour les symboles et par `file` pour les
  composants CSS — un symbole/fichier disparu de la FF perd juste son
  consumer recopié, sans erreur).
- **Résilience aux échecs partiels** : un échec (clone KO, tsconfig
  introuvable, analyse qui lève) devient un `scanError` comme avant, mais si
  une donnée précédente existe pour cette app-branche, elle est recopiée en
  secours et le `scanError` porte `staleSince` (horodatage de l'index dont
  la donnée provient) — l'app ne disparaît jamais silencieusement du rapport.
  `appStates` garde alors l'**ancien** commit, pour qu'un vrai scan soit
  retenté au run suivant plutôt que de considérer la donnée comme à jour.

**Configuration des credentials** : un fine-grained PAT n'a qu'un seul
owner, donc un token par org GitHub du registre. Copier `.env.example` en
`.env` (gitignoré explicitement — voir `.gitignore` local, la règle
générique `.env.*` de la racine ne couvre pas le nom exact `.env`) et le
remplir :

```bash
cp .env.example .env
```

`.env` est chargé automatiquement par `generate:local`/`generate:ci`
(`tsx --env-file-if-exists=.env`, natif Node ≥20.6, pas de dépendance
`dotenv`). Pour une invocation directe (`tsx src/cli.ts ...` sans passer par
un script `pnpm`), ajouter le flag à la main :
```bash
tsx --env-file-if-exists=.env src/cli.ts generate --mode=ci
```

Contenu de `.env` :
```bash
# Générique — fallback si un seul classic PAT couvre tout
IMPACT_ANALYZER_GITHUB_TOKEN=

# Spécifique par org (prioritaire sur le générique) — nom = org en UPPER_SNAKE_CASE
IMPACT_ANALYZER_GITHUB_TOKEN_EDIFICEIO=
IMPACT_ANALYZER_GITHUB_TOKEN_OPEN_ENT_NG=
```

**Comment générer le générique `IMPACT_ANALYZER_GITHUB_TOKEN`** (classic
PAT, un seul token couvrant les deux orgs — alternative aux deux
fine-grained PAT par org si tu ne veux gérer qu'un seul secret) :
1. https://github.com/settings/tokens/new (classic, pas fine-grained).
2. Note explicite (ex. "impact-analyzer read-only"), expiration 90 jours.
3. Scope à cocher : **`repo`** uniquement (les classic PAT n'ont pas de
   granularité read-only par repo — `repo` donne accès en lecture/écriture
   à tout ce que le compte peut atteindre ; c'est le compromis "simple mais
   large" par rapport aux deux fine-grained PAT scopés en lecture seule aux
   seuls repos du registre — préférer ces derniers si déjà approuvés).
4. Générer, copier la valeur dans `IMPACT_ANALYZER_GITHUB_TOKEN=` de `.env`.

Ce générique n'est utile que si aucun token spécifique par org n'est défini
pour l'org en question (`resolveGithubToken` : spécifique > générique) —
avec les deux fine-grained déjà créés, le générique reste inutilisé une
fois eux approuvés.

Scope PAT recommandé (fine-grained) : **Contents + Metadata, lecture
seule**, restreint aux repos listés dans `apps.json` (pas un accès large à
l'org). Le token n'est jamais embarqué dans une URL de clone (auth via
`-c http.extraheader` sur la commande `fetch` uniquement) ni loggé en cas
d'échec (message d'erreur générique).

**Limites explicites de ce périmètre** : séquentiel (pas de gestion de
rate-limit/concurrence — ~9 apps × 2 branches × 2 fichiers reste très en
dessous des 5000 req/h authentifiées).

## CRON (GitHub Actions)

`.github/workflows/impact-analyzer-generate.yml` — nocturne, du lundi au
vendredi (`0 2 * * 1-5`, plan §9), + déclenchement manuel
(`workflow_dispatch`). Pour chaque branche FF suivie (`develop`,
`develop-enabling`) : `pnpm generate:ci` avec le cache incrémental branché
sur le run précédent, puis un **diff de release** (`diff
--base=<dernier tag semver> --head-index=<index tout juste généré>`) —
« tout ce qui a bougé sur la branche depuis la dernière release », trié par
risque dans l'onglet Diff du viewer. Le `--head-index` réutilise l'index du
même run : pas de second scan des apps. Le diff est **sauté** quand il n'y a
rien de neuf : branche exactement sur le tag, ou rapport déjà publié pour la
même paire de commits (base et head comparés au fichier présent dans le repo
de données).

**Confidentialité (décision actée)** : ce repo est **public**, et l'index
référence des infos sur des apps privées (`communities`, `collect`...). Le
publier tel quel ici (branche, artifact, ou GitHub Pages) les exposerait
publiquement. L'index est donc poussé dans un **repo privé dédié**,
`edificeio/impact-analyzer-data` — jamais dans ce repo. GitHub Pages n'était
de toute façon pas une option pour un repo privé sur le plan **Free** de
l'org `edificeio` (vérifié) : le **viewer hébergé** (Jalon 6, livré) est donc
une image Docker déployée en interne par l'infra, qui lit ce repo de données
en continu (API GitHub Contents, token dédié lecture seule) — voir
`viewer/k8s-chart-reference/README.md` pour le détail du déploiement. Le
viewer reste aussi utilisable en local en complément (clone du repo de
données + `pnpm --filter @edifice.io/impact-analyzer-viewer dev`).

**Secrets requis** sur `edifice-frontend-framework`
(Settings → Secrets and variables → Actions) :
- `IMPACT_ANALYZER_GITHUB_TOKEN_EDIFICEIO` / `IMPACT_ANALYZER_GITHUB_TOKEN_OPEN_ENT_NG`
  — les mêmes fine-grained PAT lecture seule que pour un usage local (voir
  ci-dessus). Le PAT `IMPACT_ANALYZER_GITHUB_TOKEN_EDIFICEIO` doit inclure le
  repo `entcore` (pour `conversation`/`portal`/`timeline`) en plus des repos
  déjà couverts — comme `homeworks`, approbation en attente au moment de
  l'écriture de cette note.
- `IMPACT_ANALYZER_DATA_PUSH_TOKEN` — **nouveau** fine-grained PAT dédié,
  scope repos = **uniquement** `edificeio/impact-analyzer-data`, permission
  Contents = **Read and write** (c'est le seul des trois qui a besoin
  d'écrire).

Le job ne peut pas échouer à cause de `scanErrors` (l'app en échec est
signalée, jamais un exit code non-zéro) — cohérent avec le principe de
résilience : un échec isolé sur ~10 apps est à attendre presque chaque nuit,
il ne doit jamais bloquer la publication du reste.

## Architecture

- `src/registry/` — chargement/validation de `apps.json`.
- `src/discovery/` — résolution des repos frères (branche/SHA/dirty en
  lecture seule) + lecture des pins `@edifice.io/*` dans les `package.json`
  (`pin-reader.ts`, partagé local/distant via `extractEdificePinsFromPackageJson`).
  Mode distant (Jalon 4 partiel) : `github-client.ts` (client Contents API,
  `fetch` injectable), `github-credentials.ts` (résolution token par org),
  `discover-apps-remote.ts` (discovery via API), `remote-clone.ts` (clone
  sparse-checkout jetable, auth par header, jamais dans l'URL).
- `src/ff-map/` — table `export public → fichiers source` pour
  `react`/`client`/`utilities`/`tiptap-extensions`/`rest-client-base`, via
  `ts-morph`. Les subpaths `./icons*` sont agrégés (voir
  `icons-aggregator.ts`) tout en restant individuellement cherchables.
- `src/app-usage/` — résolution des imports `@edifice.io/*` (nommés, alias,
  namespace) dans le code de chaque app, comptage des **sites d'usage
  réels** (pas juste la ligne d'import), et détection des imports **hors
  contrat** (chemins non déclarés dans `exports`).
- `src/css/` — analyseur Sass : classes par `components/_<name>.scss`,
  corrélation avec le composant React homonyme, grep des classes dans le
  code des apps, détection d'impact global (`themes/`, `tokens/`,
  `abstracts/`, `base/`).
- `src/index-builder/` — assemble tout dans l'index JSON versionné
  (`src/types/index-schema.ts` = source de vérité du schéma). `build-index.ts`
  (mode local) et `build-ci-index.ts` (mode distant) partagent
  `aggregate-icon-consumers.ts` et réutilisent `analyzeAppUsage`/`buildCssMap`
  à l'identique — seule la provenance des sources (repo frère vs clone
  jetable) diffère. `carry-forward.ts` implémente le cache incrémental de
  `--mode=ci` : recopie les `ConsumerEntry`/`CssConsumerEntry`/
  `OutOfContractImport` d'une app-branche depuis l'index précédent quand son
  commit n'a pas bougé, ou en secours (`staleSince`) si le scan échoue.
- `src/diff/` — classification de diff base vs head (Jalon 5) :
  `snapshot.ts` matérialise `base` dans un `git worktree` jetable (jamais de
  mutation du worktree principal), `signature-shape.ts`/
  `cosmetic-normalize.ts` comparent la forme et le corps d'un symbole de
  façon syntaxique (jamais via le type-checker, dont `type.getText()` fuite
  le chemin absolu du fichier), `symbol-diff.ts`/`css-diff.ts` produisent le
  `DiffReport` (`src/types/diff-schema.ts`, séparé de `ImpactIndex`),
  `risk-score.ts` calcule le score (pondérations à calibrer avec la QA).
- `src/cli/` — sous-commandes CLI (Jalon 7) : `generate-command.ts`,
  `symbol-command.ts`, `diff-command.ts`, `format-table.ts` (alignement de
  colonnes fait main). `src/cli.ts` est un simple routeur.
- `src/diff/write-diff-report.ts` — persiste le `DiffReport` produit par
  `impact diff` (`data/diff.<base>..<head>.json`), même quand rien n'a
  changé — même logique que `write-index.ts` côté `ImpactIndex`.
- `viewer/` — sous-package Vite + React, consomme l'index (et maintenant le
  diff, onglet dédié), aucune vue graphe (Cytoscape/D3) pour l'instant :
  tableaux filtrables uniquement.

## Config statique notable

`config/ff-entry-map.json` fait le lien `exports` déclaré → fichier source,
car cette convention diffère par package FF (voir commentaires dans
`src/ff-map/entry-points.ts`) — pas de dérivation générique fiable. Un test
(`entry-points.spec.ts`) échoue si un nouveau subpath apparaît dans un
`package.json` FF sans entrée correspondante ici.

## Limites connues

- **`kind` des symboles est une heuristique**, pas une vérité absolue (ex. un
  composant construit via `Object.assign(Root, {...})` — pattern utilisé par
  `Dropdown` — est classé `const`, pas `component`). La corrélation CSS en
  tient compte (elle accepte `component` et `const` comme candidats), mais
  d'autres usages du champ `kind` peuvent être affectés.
- **CSS = confiance partielle** : classes construites dynamiquement
  (template strings) invisibles au grep statique ; `confidence` explicite
  par composant, jamais présenté comme exhaustif.
- **Une seule passe de profondeur** pour les ré-exports internes à une app
  (pas de récursion sur tout son graphe applicatif).
- **Fraîcheur local vs CI** : le mode local reflète l'état du disque à
  l'instant du run (jamais périmé par définition) ; l'index CI généré par le
  CRON peut avoir jusqu'à ~24h de décalage en semaine, et jusqu'à **~72h**
  après un vendredi (le CRON ne tourne pas le week-end, `0 2 * * 1-5`) — les
  deux ne sont pas synchronisés automatiquement entre eux.
- **Registre manuel** : rien ne garantit qu'une nouvelle app migrée soit
  ajoutée à `apps.json` au bon moment.
- **Classification de diff par symbole directement touché, pas de
  propagation transitive** : si `interface Props` change de forme mais que
  `function Button(props: Props)` ne change pas syntaxiquement dans sa
  propre déclaration, `Props` est flaggé mais `Button` ne l'est pas
  automatiquement.
- **Renommages locaux non filtrés par la normalisation cosmétique** : un
  renommage pur de variable locale (sans changement de logique) compte comme
  un vrai changement de corps (🟡) — sur-signalement assumé plutôt que
  risquer de masquer un changement réel déguisé en renommage. De même, un
  changement de style de guillemets (`'x'` → `"x"`) ne serait pas filtré —
  non-problème dans ce repo grâce à `singleQuote: true` côté Prettier.
- **Fichier CSS composant supprimé entre base et head** : reste dans le
  rapport de diff, mais avec une confiance indéterminée (repli `needs-review`)
  plutôt que d'être silencieusement omis.
- **Jalon 6 livré** : périmètre retenu = viewer hébergé en interne uniquement
  (pas de commentaire PR ni d'export QA séparé). `diff --mode=ci` est branché
  sur un workflow `pull_request`
  (`.github/workflows/impact-analyzer-diff-pr.yml`) : chaque PR touchant
  `packages/**` vers `develop`/`develop-enabling` publie son rapport de diff
  dans le repo de données privé, consultable dans l'onglet Diff du viewer
  (les PR issues de forks sont sautées — pas de secrets sur un repo public).
  Le **commentaire PR** (poster un résumé sur la PR elle-même) reste une
  extension possible, pas engagée (voir `PLAN-impact-analyzer.md` §8, §13).
  Rétention actée : illimitée, un fichier par PR (paire branche
  origine/destination) — projection à ~12 Mo après 5 ans au rythme actuel du
  repo, donc sans enjeu de volumétrie.
