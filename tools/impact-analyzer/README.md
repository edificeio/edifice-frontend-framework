# Impact Analyzer (ENABLING-1023)

Cartographie, pour chaque export public des packages `@edifice.io/*`, quelles
apps React consommatrices l'utilisent, où, et avec quel niveau de risque.
Voir `PLAN-impact-analyzer.md` à la racine du repo pour le cadrage complet.

Ce package couvre les **Jalons 0 à 5 et 7** du plan : mode local complet,
discovery distante via l'API GitHub Contents (`--mode=ci`), cache incrémental
par SHA, résilience aux échecs partiels, et automatisation via un workflow
GitHub Actions CRON. Reste hors scope : le **Jalon 6** (commentaire PR,
rapport QA, canal de diffusion — décision encore ouverte) et l'hébergement
d'un viewer **partagé** (bloqué par la confidentialité de certaines apps
consommatrices — voir "CRON" ci-dessous).

## Prérequis

- Les repos des apps consommatrices doivent être clonés en frères de ce repo
  (`../<repo>` par défaut, ex. `/Volumes/Work/communities` si ce repo vit
  dans `/Volumes/Work/edifice-frontend-framework`). Chemin racine
  surchageable via `IMPACT_ANALYZER_REPOS_ROOT`.
- **Aucune branche n'est jamais checkout/fetch/pull automatiquement** sur ces
  repos frères : l'outil lit uniquement l'état actuellement présent sur
  disque (branche, SHA, dirty) et le restitue tel quel — jamais de mutation
  du working tree d'un autre repo.
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

## Mode distant (`--mode=ci`)

Différences avec le mode local :
- Les apps sont découvertes via l'**API GitHub Contents** (pas de repo
  frère nécessaire sur disque) : pour chaque app × chaque branche listée
  dans son `apps.json.branches` (nom réel par app, jamais recoupé avec une
  liste générique), lecture de `frontend/package.json` (repli
  `package.json`) à distance. Une branche absente côté GitHub est sautée
  silencieusement (comme en local) ; un `package.json` introuvable alors que
  la branche existe est un `scanError`. Si **toutes** les branches d'une app
  sont absentes, un `scanError` informatif signale l'app entière (permet de
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
(`workflow_dispatch`). Checkout de ce repo sur `develop`, `pnpm generate:ci`
avec le cache incrémental branché sur le run précédent.

**Confidentialité (décision actée)** : ce repo est **public**, et l'index
référence des infos sur des apps privées (`communities`, `collect`...). Le
publier tel quel ici (branche, artifact, ou GitHub Pages) les exposerait
publiquement. L'index est donc poussé dans un **repo privé dédié**,
`edificeio/impact-analyzer-data` — jamais dans ce repo. Conséquence directe :
**pas de viewer hébergé partagé** pour l'instant (GitHub Pages n'est pas
disponible pour un repo privé sur le plan **Free** de l'org `edificeio` —
vérifié). Le viewer (`viewer/`, Jalon 3) continue de tourner en local,
pointé sur un clone de ce repo de données. Réévaluer si l'outil se
pérennise (upgrade de plan, ou infra d'hébergement privé dédiée).

**Secrets requis** sur `edifice-frontend-framework`
(Settings → Secrets and variables → Actions) :
- `IMPACT_ANALYZER_GITHUB_TOKEN_EDIFICEIO` / `IMPACT_ANALYZER_GITHUB_TOKEN_OPEN_ENT_NG`
  — les mêmes fine-grained PAT lecture seule que pour un usage local (voir
  ci-dessus).
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
  CRON peut avoir jusqu'à ~24h de décalage (nocturne, hors week-end) — les
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
- **Jalon 6 hors scope** : pas de commentaire automatique sur PR, de rapport
  QA formel, ni de canal de diffusion — décision encore ouverte.
- **Pas de viewer hébergé partagé** : la confidentialité de certaines apps
  consommatrices (`communities`, `collect`...) bloque toute publication sur
  ce repo public ; l'index CRON vit dans un repo privé dédié, le viewer
  reste un usage local (voir section "CRON" ci-dessus).
