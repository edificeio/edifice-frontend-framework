# Plan de mise en place — Impact Analyzer du Frontend Framework

> Outil de cartographie exhaustive des dépendances entre `@edifice.io/*` (le
> Frontend Framework, « FF ») et les applications qui le consomment, afin de
> **prévenir le dev des impacts de ses changements** et de **donner à la QA un
> périmètre de test priorisé** au lieu de découvrir les régressions en fin de
> course.
>
> Ce document est le plan d'implémentation. Il est destiné à être exécuté dans
> une autre session (Claude Code ou humaine). Toutes les décisions structurantes
> y sont figées ; les points restant à valider sont listés en fin de document.

---

## 1. Contexte & problème

- Le FF publie des packages `@edifice.io/*` (`react`, `bootstrap`, `client`,
  `utilities`, `tiptap-extensions`, `rest-client-base`, …).
- 10 apps React actives le consomment (`blog`, `collaborative-wall`,
  `collect`, `communities`, `explorer`, `mindmap`, `wiki`, `actualites`,
  `rack`, `support` — liste exacte dans `tools/impact-analyzer/apps.json`),
  avec 13 à ~200 fichiers importateurs chacune. Le périmètre **grandit**
  (nouvelles migrations React à venir).
- **Mécanique de risque n°1 — le pinning par branche.** Les apps épinglent
  littéralement une **branche** du FF dans leur `package.json`
  (`"@edifice.io/react": "develop"`, `"develop-pedago"`, …), pas un semver figé.
  Dès qu'un merge atterrit sur cette branche, il coule dans toutes les apps qui
  la trackent au prochain install. **La chaîne de pin EST le mapping**
  « branche FF → apps impactées » : on la lit dans les `package.json`, on ne la
  code jamais en dur. Le pin se lit **par branche d'app** (le même repo peut
  pinner un semver sur `master` et une branche sur `develop-enabling`).
- **Mécanique de risque n°2 — le CSS.** Les régressions récentes venaient de
  `@edifice.io/bootstrap`. L'impact CSS passe par des **classes / variables Sass**,
  pas par des imports JS → nécessite un analyseur dédié (cf. §5.2).

### Objectif

Un **graphe d'usage au niveau du symbole exporté** (composant, hook, type,
fonction, **et** classe/token CSS), tenu à jour automatiquement, qui répond à :
« je modifie `X` — qui l'utilise, où, combien de fois, et quel est le risque ? »

*(Voir §11 pour les critères permettant d'évaluer, une fois l'outil en service,
s'il atteint effectivement cet objectif.)*

---

## 2. Décisions figées (issues de la phase de cadrage)

| Décision | Choix retenu |
| --- | --- |
| **Granularité** | **Symbole exporté** (composant/hook/type/util côté JS ; classe/token côté CSS). Pas le package (trop grossier), pas la ligne (ingérable). |
| **Consommateurs** | Les 4 : commentaire sur PR FF · rapport QA priorisé · graphe explorable · CLI locale. Tous lisent **le même index**. |
| **Collecte** | **Registre manuel (manifeste)** des apps consommatrices — liste finie (~30-50 apps), pas de scan automatique des orgs (§4). Ajouter une app = une ligne dans le manifeste. |
| **Portée branches (V1)** | **`develop` et `develop-enabling` uniquement** pour démarrer, côté FF et côté apps. Autres branches (`develop-pedago`, `develop-b2school`, `develop-integration`, `main`/`master`) différées (§4, §10, §12). |
| **Robustesse du cœur** | **AST dès le départ** (`ts-morph`) pour la résolution JS ; parseur Sass pour le CSS. Le cœur doit être exact ; les sorties se livrent par étapes. |
| **Emplacement** | **Nouveau package dans le monorepo FF** (`tools/impact-analyzer`, nom à confirmer — cf. §13). Réutilise Turbo/Vite/CI en place. |
| **Nature du diff** | **Classifiée** en 3 niveaux (§6). |
| **Graphe** | **Site statique dédié** généré depuis l'index (Vite + React, `viewer/`), **livré et fonctionnel en local dès le Jalon 3** — inclut désormais aussi un onglet **Diff**. Hébergement **partagé** : décidé — repo public exclu (confidentialité), GitHub Pages privé exclu (org sur plan Free), hébergement **interne** demandé à l'infra, en attente de réponse (Jalon 6, §9, §13). |
| **Exécution locale** | Le cœur tourne en **commande locale** dès le Jalon 1 (pas seulement en CI) — indépendant de la CRON et de la décision d'hébergement. Sert les démos et l'adoption (§9). **Livré.** |
| **Séquencement** | **Cœur + graphe explorable d'abord** ; commentaire PR / rapport QA / CLI ensuite (réutilisent l'index sans retoucher le cœur). Réalisé dans cet ordre, à l'exception du commentaire PR/rapport QA — **volontairement recadrés hors du périmètre initial du Jalon 6** (§8, §13). |
| **Fraîcheur** | **CRON nocturne hors week-end** + relance manuelle. **Livré** (`.github/workflows/impact-analyzer-generate.yml`). Temps quasi-réel par PR : la brique technique (`diff --mode=ci`) est livrée, son automatisation (workflow `pull_request`) est en attente de l'hébergement (§9, §13). |
| **Bruit du diff** | Diffs cosmétiques (formatage, commentaires, renommages locaux) filtrés avant classification 🟡 (§6). **Livré.** |
| **Canal de restitution** | **Recadré** : périmètre du Jalon 6 réduit au viewer hébergé en interne uniquement. Le commentaire PR GitHub et le rapport QA formel restent des extensions possibles mais ne sont **plus** dans le périmètre engagé de cette itération (§8, §13). |
| **Critères de succès** | Mini-section dédiée (§11), hors déclenchement des jalons techniques. |
| **Confidentialité publication** | **Tranchée** : ni ce repo public, ni GitHub Pages (org Free) ; index + diffs stockés dans un repo privé dédié (`edificeio/impact-analyzer-data`) ; hébergement du viewer partagé demandé à l'infra, réponse en attente (§9, §13). |

---

## 3. Architecture d'ensemble

```
                    ┌───────────────────────────────────────────────┐
                    │  CŒUR                                          │
   Registre apps ─► │  ① Discovery   lit le registre (apps+org),     │
   (~10-50 apps,    │     résout le pin par branche → matrice        │
    2 orgs ; V1)    │     (V1 : branches develop + develop-enabling) │
                    │                                                │
   Repo FF ───────► │  ② FF map      "export public → fichiers src"  │
   (par branche)    │     (résout subpath exports + barrels)         │
                    │     + "composant scss → sélecteurs/classes"    │
                    │                                                │
   Repos apps ────► │  ③ App usage   résout imports → symboles,       │
   (par branche)    │     compte les sites ; grep className CSS      │
                    │                                                │
   git diff FF ───► │  ④ Diff class. nature du changement par symbole│
                    └───────────────────────┬───────────────────────┘
                                            │
                              INDEX versionné (JSON)  ← LE CONTRAT
                    (horodaté, SHA FF + SHA de chaque app-branche)
                                            │
        ┌───────────────┬───────────────────┼───────────────┬──────────────┐
        ▼               ▼                   ▼               ▼              ▼
   Graphe site     Commentaire         Rapport QA        CLI locale    (futurs
   statique        sur PR FF           priorisé          `impact`     adaptateurs)
```

Principe cardinal : **le cœur produit un index JSON ; tout le reste le
consomme**. On peut ajouter une sortie ou une nouvelle app sans toucher le cœur.

---

## 4. Découverte des consommateurs (① Discovery)

**But :** produire, à partir d'un registre maintenu à la main, la liste
`(repo, branche) → { package @edifice → pin }`.

**Registre manuel, pas de scan d'org.** Avec ~10 apps aujourd'hui et un plafond
réaliste de l'ordre de 30 à 50 (nouvelles migrations comprises), le rapport
coût/valeur d'un auto-discovery scannant les ~300 repos des deux orgs ne se
justifie pas pour une V1 : la complexité (pagination API, filtrage des repos
non pertinents/archivés, gestion du bruit) dépasse largement le gain face à une
simple liste maintenue par une PR quand une app migre. Le registre est un
fichier versionné dans `tools/impact-analyzer`, par exemple `apps.json` :

```json
[
  { "name": "communities", "org": "edificeio", "repo": "communities", "branches": ["develop", "develop-enabling"] },
  { "name": "blog", "org": "edificeio", "repo": "blog", "branches": ["develop", "develop-enabling"] },
  { "name": "actualites", "org": "OPEN-ENT-NG", "repo": "actualites", "branches": ["dev", "develop-enabling"] }
]
```

> `branches` liste le **nom réel** des branches V1 pour cette app — la
> convention varie par repo (`dev` vs `develop`, cf. correction plus bas),
> jamais recoupée avec un nom générique.

1. Pour chaque entrée du registre, sur chaque **branche V1** (`develop`,
   `develop-enabling` — voir ci-dessous), lire le(s) `package.json` (racine
   **et** `frontend/package.json`). Deux résolutions, choisies automatiquement
   (cf. §9) : **en local**, lire directement le repo frère sur le disque
   (`../<repo>`) s'il y est déjà — la technique utilisée pour cadrer ce plan ;
   **en CI**, lire à distance via l'**API Contents** de GitHub (pas de clone à
   ce stade).
2. Retenir les dépendances `@edifice.io/*` trouvées ; extraire pour chacune la
   **valeur de pin** (branche, semver, ou `workspace:*`).
3. En déduire, par package FF, le mapping **branche FF → apps qui la trackent**.
4. Ne cloner (sparse-checkout `frontend/src`) que les couples `(app, branche)`
   confirmés consommateurs à l'étape 2 — c'est là qu'interviennent les
   analyseurs §5.1/§5.2.

**Portée des branches en V1 : `develop` et `develop-enabling` seulement.** Ça
limite fortement le nombre de clones (~10-50 apps × 2 branches, pas × 6+) et
couvre le contexte de travail actuel. Les autres branches (`develop-pedago`,
`develop-b2school`, `develop-integration`, `main`/`master`) sont **différées**
— l'extension est triviale : ajouter le nom de branche à `apps.json` pour
l'app concernée, sans changer le mécanisme. Limite assumée en §12.

> **Correction post-implémentation** : l'idée initiale d'une config générique
> `["develop", "develop-enabling"]` recoupée avec `apps.json.branches` s'est
> révélée fausse en pratique — la convention de nommage **varie par repo**
> (`rack`, `actualites`, `support` utilisent `dev`, pas `develop`). Un
> recoupement avec une liste générique excluait silencieusement ces branches
> (0 `scanError`, app absente du rapport sans explication — bug réel constaté
> en conditions réelles). `apps.json.branches` est donc la **seule** source de
> vérité, utilisée telle quelle : chaque app déclare le nom réel de ses
> branches V1, jamais recoupé avec un nom générique.

> **Cas particuliers à gérer**
> - App pinnant un **semver figé** (ex. un ancien `rack` sur `master`) → app
>   « gelée » : impactée seulement quand elle bumpe. La marquer distinctement
>   (badge « figée sur vX.Y.Z ») plutôt que dans le flux d'une branche FF.
> - Pin `workspace:*` (monorepo interne) → ignorer (dépendance locale).
> - Un repo peut pinner des **packages FF différents sur des branches
>   différentes** → le mapping est par `(app, branche app, package FF)`.
> - Une app du registre peut ne pas avoir de branche `develop-enabling` → la
>   sauter silencieusement pour cette branche, pas une erreur. **Raffiné en
>   implémentation** : silencieux seulement si *au moins une* des branches de
>   l'app a été trouvée ce run ; si **toutes** ses branches sont introuvables,
>   un `scanError` informatif signale l'app entière (une branche manquante est
>   normal, une app totalement invisible ne doit jamais l'être silencieusement
>   — cf. §12).

**Maintenance du registre.** Ajouter une app = une PR d'une ligne sur
`apps.json`, revue comme du code. Aucun garde-fou automatique si un ajout est
oublié (contrepartie assumée, cf. §12) — à intégrer au réflexe d'onboarding
d'une nouvelle app migrée vers React.

---

## 5. Le cœur — deux analyseurs

### 5.1 Analyseur JS/TS (symboles) — `ts-morph`

**Côté FF (② FF map).** Pour une branche FF donnée, construire la table
`export public → symbole → fichiers source qui l'implémentent` :

1. Lire les **points d'entrée publics** depuis le champ `exports` de chaque
   `package.json` (`.`, `./editor`, `./modals`, `./icons`, …).
2. Depuis chaque entrée, suivre les **ré-exports / barrels** transitivement
   (`export * from`, `export { X } from`) jusqu'aux fichiers d'implémentation.
3. Résultat : chaque symbole public (`Dropdown`, `useOdeClient`, type `TreeNode`…)
   est relié à son/ses fichier(s) source. C'est ce qui permet, à partir d'un
   fichier modifié dans un diff, de **remonter au nom d'export public** que les
   apps connaissent.

**Côté apps (③ App usage).** Pour chaque `(app, branche)` :

1. Trouver les imports `from '@edifice.io/<pkg>'` (et sous-chemins) dans
   `frontend/src`.
2. Résoudre les noms importés — y compris alias (`import { Dropdown as D }`),
   imports namespace (`import * as EdificeUI`), et ré-exports internes à l'app.
3. **Compter les sites d'usage réels** (références à l'identifiant), pas seulement
   la ligne d'import → « communities utilise `<Dropdown>` à 12 endroits ».
4. **Signaler les imports hors contrat** : un import `@edifice.io/*` qui ne
   correspond à aucune entrée `exports` déclarée (chemin profond type
   `@edifice.io/react/dist/internal/...`) est un signal de fragilité à part
   entière — l'app dépend d'un détail d'implémentation non garanti. À faire
   remonter comme avertissement indépendant, pas seulement comme un usage normal.

**Icônes :** `@edifice.io/react/icons` expose une **très grande** surface générée
(SVGR). La regrouper/catégoriser (« N icônes ») pour ne pas noyer le signal ;
usage réel compté mais présenté agrégé.

### 5.2 Analyseur CSS/Sass (bootstrap + thèmes) — **première classe, pas un angle mort**

Structure de `packages/bootstrap/src` : `components/_*.scss` (un fichier par
composant, kebab-case), `themes/`, `tokens/`, `abstracts/`, `base/`, `layout/`,
`vendors/`.

Deux régimes de détection :

1. **Changement d'un composant `components/_<name>.scss` → LOCALISÉ.**
   - Extraire les **sélecteurs de classe / placeholders / mixins** définis dans
     le `.scss` modifié (parseur Sass, ex. `postcss-scss` / `sass` AST).
   - **Grep les `className` / classes** correspondants dans le `frontend/src` de
     chaque app → liste précise des apps/sites concernés.
   - Corréler le nom de fichier avec le composant React homonyme
     (`_dropdown.scss` ↔ `<Dropdown>`) pour recouper avec l'analyseur JS.
2. **Changement dans `themes/`, `tokens/`, `abstracts/`, `base/` → GLOBAL.**
   - Rayon d'impact non localisable → flag **« régression CSS large »** à haute
     sévérité : toutes les apps consommant `bootstrap` sont potentiellement
     touchées. La QA reçoit un avertissement explicite « thème/token modifié →
     re-test visuel large ».

> La détection CSS est **par nature plus floue** que la détection JS (classes
> utilisées dynamiquement, concaténées, héritées). Assumer et **afficher le
> niveau de confiance** plutôt que prétendre à l'exhaustivité.

---

## 6. Classification de la nature du changement (④ Diff)

À partir du `git diff` d'une branche/PR FF (base vs head), pour chaque symbole
touché, classer en **3 niveaux honnêtes** :

| Niveau | Détection | Exemple |
| --- | --- | --- |
| 🔴 **Cassant** | Export **supprimé ou renommé** (comparaison de la surface publique base vs head, via AST). | `Dropdown` retiré / renommé. |
| 🟠 **Potentiellement cassant** | **Signature / props / type** modifiés (diff des interfaces, paramètres, types TS). | Prop `size` de `Button` changée. |
| 🟡 **À vérifier** | Seul le **corps** derrière le symbole a changé (signature identique), **après filtrage des diffs purement cosmétiques**. Le comportement **n'est pas prouvable par AST** → on signale « fichier source modifié avec changement sémantique », sans deviner lequel. | Logique interne de `<Dropdown>` modifiée. |

**Filtrage du bruit cosmétique.** Avant de classer un fichier en 🟡, un diff AST
sémantique (pas un diff texte) élimine les changements qui ne modifient pas le
comportement observable : reformatage (Prettier), commentaires, renommage de
variables locales. Objectif : que 🟡 signale un vrai changement de code, pas le
bruit d'un refactor ou d'un passage de linter — sans quoi chaque PR de
formatage déclencherait une fausse alerte sur toutes les apps consommatrices.
Contrepartie assumée en §12.

Côté CSS : `component scss modifié` → 🟠/🟡 selon localisable ou non ;
`theme/token modifié` → 🔴/🟠 « impact large ».

**Score de risque** proposé (pour trier le rapport QA) :
`sévérité × nombre de sites d'usage × nombre d'apps touchées`.

> Limite explicite : le niveau 🟡 est le **plus fréquent** et le moins précis.
> C'est voulu — l'outil dit « voici ce qui a bougé et qui l'utilise », il ne
> certifie jamais qu'un changement est sans risque.

---

## 7. L'index JSON — le contrat central

Fichier(s) versionné(s), horodaté(s), et **estampillé(s) des SHA** scannés (FF +
chaque app-branche) pour la traçabilité et le cache incrémental. Schéma indicatif :

```jsonc
{
  "schemaVersion": 1,
  "generatedAt": "2026-07-01T02:00:00Z",
  "ffBranch": "develop",
  "ffCommit": "434033a8c",
  "packages": ["@edifice.io/react", "@edifice.io/bootstrap", "..."],
  "scanErrors": [
    // couples (app, branche) en échec à ce run — voir §9 (résilience) ;
    // leurs données précédentes sont conservées et marquées "stale" plutôt
    // que silencieusement absentes
    { "app": "wiki", "branch": "develop-enabling", "error": "clone failed", "staleSince": "2026-06-29T02:00:00Z" }
  ],
  "symbols": [
    {
      "package": "@edifice.io/react",
      "entry": "./modals",            // sous-chemin exports
      "name": "Dropdown",
      "kind": "component",            // component|hook|type|util|cssClass|token
      "sourceFiles": ["src/components/Dropdown/Dropdown.tsx"],
      "cssPeer": "_dropdown.scss",    // corrélation CSS si applicable
      "consumers": [
        {
          "app": "communities",
          "org": "edificeio",
          "appBranch": "develop",
          "pins": "develop",          // ce que l'app pin pour ce package
          "appCommit": "ab12cd3",
          "usageSites": 12,
          "files": ["frontend/src/features/.../Foo.tsx"]
        }
      ]
    }
  ],
  "cssGlobalRisks": [ /* themes/tokens touchés → apps bootstrap */ ]
}
```

Un index par **branche FF** (ou un index global indexé par branche). Ce schéma
est **stable** et versionné (`schemaVersion`) : les 4 sorties en dépendent, ne
pas le casser sans faire évoluer ce champ.

> **État réel post-implémentation** (JSON ci-dessus indicatif, source de
> vérité = `src/types/index-schema.ts`) :
> - `mode: 'local' | 'ci'` distingue une génération locale (repos frères sur
>   disque) d'une génération distante (clone via l'API GitHub).
> - `appStates: { app, branch, commit }[]` a été ajouté pour le **cache
>   incrémental** (Jalon 4) : permet de savoir, par app-branche, quel commit a
>   été effectivement scanné, sans avoir à le déduire des `consumers`.
> - Le **diff** (§6) n'est **pas** imbriqué dans `ImpactIndex` : c'est un
>   schéma séparé et indépendant, `DiffReport`
>   (`src/types/diff-schema.ts`) — il compare deux états (base/head), alors
>   qu'`ImpactIndex` est un instantané unique. Écrit dans
>   `data/diff.<base>..<head>.json`.

---

## 8. Les sorties (adaptateurs)

Toutes lisent l'index. Ordre de livraison = §10.

1. **Graphe explorable — site statique dédié** *(livré)*.
   Package Vite + React (`viewer/`), consomme l'index **et** le diff (voir
   ci-dessous). **Consultable en local dès le Jalon 3**, indépendamment de
   toute décision d'hébergement (`pnpm --filter @edifice.io/impact-analyzer-viewer
   dev`). Fonctions livrées : recherche par symbole (avec filtre par package),
   vue « qui utilise `X` », vue « que consomme l'app `Y` », sélecteur de
   branche FF, et un **onglet Diff** (badges de sévérité 🔴/🟠/🟡, tri par
   risque, sélecteur si plusieurs diffs) — onglet par défaut au chargement.
   Pas de vue graphe (Cytoscape/D3) : tableaux filtrables uniquement, jugé
   suffisant en pratique. La **publication partagée** est en cours (Jalon 6,
   §9, §13) : ni ce repo public ni GitHub Pages (org sur plan Free),
   hébergement interne demandé à l'infra.
2. **Commentaire sur PR FF** — **recadré hors du périmètre initial du Jalon
   6** (décision explicite, §13) : le viewer hébergé couvre le besoin de
   consultation pour l'instant ; ce canal reste une extension possible mais
   n'est plus engagé dans cette itération. La brique technique qui le
   rendrait possible (`impact diff --mode=ci`) est livrée (voir §9) —
   il ne manque que le workflow `pull_request` et la décision de contenu
   (filtrage pour la confidentialité, un commentaire sur une PR de ce repo
   public serait aussi peu confidentiel qu'une publication Pages).
3. **Rapport QA priorisé** — **recadré hors du périmètre initial du Jalon 6**
   pour la même raison que le point 2. Le viewer (onglet Diff, trié par
   risque) sert cet usage en attendant.
4. **CLI locale** *(livré, Jalon 7)*. `cli.ts symbol <nom>` (+ `--cached`) et
   `cli.ts diff --base=<ref>` (+ `--mode=local|ci`) — scanne les repos frères
   présents sur le disque en mode local, ou clone à la volée via l'API GitHub
   en mode CI.

---

## 9. Emplacement, stack & exécution

- **Emplacement** : nouveau package **privé** dans le monorepo FF
  (`tools/impact-analyzer`, + sous-package `viewer/`). Intégré à Turbo
  (`turbo.json`), build Vite. Non publié sur npm. **Livré.**
- **Stack** : TypeScript, `ts-morph` (AST JS/TS), `postcss-scss` (Sass). API
  GitHub via **`fetch` natif** (Node ≥20.19, déjà le plancher du monorepo) —
  **pas** de dépendance `@octokit/rest`, jugée inutile pour le nombre
  d'appels en jeu (client HTTP minimal, `github-client.ts`).
- **Exécution locale (démo/adoption, dès le Jalon 1)** : le cœur est livré comme
  une **commande locale** (`generate --mode=local|ci`, `diff --base=<ref>
  --mode=local|ci`), pas seulement comme un job CI — la CRON ne fait
  qu'appeler cette même commande sur un planning ; même moteur, deux
  déclencheurs. Résolution des sources automatique (§4) : **en local**, repos
  frères déjà clonés sur le disque (`../<repo>`) — zéro token, zéro clone,
  résultat en quelques secondes ; **en CI**, registre → API Contents → clone
  sparse ciblé. Cette voie locale ne publie rien : elle ne dépend ni de la
  CRON ni de la décision de confidentialité ci-dessous. **Livré.**
- **Exécution / fraîcheur** — **tout livré** :
  - **CRON nocturne hors week-end** (`.github/workflows/impact-analyzer-generate.yml`,
    `schedule: '0 2 * * 1-5'` + `workflow_dispatch`) : discovery → clone
    sparse ciblé → deux analyseurs → index → push vers le repo de données
    privé (voir Confidentialité ci-dessous).
  - **Cache incrémental** par SHA (`ImpactIndex.appStates`, `carry-forward.ts`) :
    une app-branche dont le commit n'a pas bougé depuis le run précédent
    (passé en `--cache=<index.json>`) n'est ni clonée ni ré-analysée — ses
    données sont recopiées telles quelles.
  - **Résilience aux échecs partiels** : un échec isolé devient un
    `scanError` ; si une donnée précédente existe pour cette app-branche,
    elle est recopiée en secours et le `scanError` porte
    `staleSince` — l'app ne disparaît jamais silencieusement du rapport.
  - **`diff --mode=ci`** (même logique de clone à la volée, réutilise
    `buildCiIndex`) permet de calculer un diff par PR sans dépendre de repos
    frères déjà clonés — brique prête, pas encore automatisée par un workflow
    `pull_request` (en attente de l'hébergement, §13).
- **Accès GitHub** : deux fine-grained PAT en secrets CI
  (`IMPACT_ANALYZER_GITHUB_TOKEN_EDIFICEIO` / `_OPEN_ENT_NG`), lecture seule,
  scopés aux repos du registre — **livré et validé en conditions réelles**.
  Fallback générique `IMPACT_ANALYZER_GITHUB_TOKEN` (classic PAT) documenté
  mais **inutilisable sur `edificeio`** : l'org interdit explicitement les
  classic PAT (`403 forbids access via a personal access token (classic)`),
  seuls les fine-grained PAT (ou une GitHub App) sont acceptés — utile
  uniquement pour `OPEN-ENT-NG`, qui n'a pas cette restriction. Migration
  vers une **GitHub App** reste une option si l'outil se pérennise, pas
  nécessaire à ce stade.

### Confidentialité de la publication (tranchée — bloquait la publication partagée, pas l'usage local)

Constat vérifié pendant le cadrage : ce repo (`edifice-frontend-framework`) est
**public**, et la Storybook y est déjà publiée sans risque car elle ne
documente que le FF lui-même. Mais l'org `edificeio` compte 201 repos privés
pour 95 publics, avec une visibilité **hétérogène côté apps consommatrices**
(ex. `communities`/`collect` privés ; `blog`/`rack` publics ; `actualites`/
`support` publics mais dans `OPEN-ENT-NG`). Le graphe d'impact référence des
noms d'app, des chemins de fichiers et des volumes d'usage : publié tel quel
sur le même canal GitHub Pages public que la Storybook, il **exposerait
publiquement** des informations sur des apps privées.

**Décision prise** (option **a**, ci-dessous) :

a. ✅ **Retenue.** L'index et les diffs générés par le CRON sont poussés vers
   un **repo privé dédié**, `edificeio/impact-analyzer-data` (jamais ce repo
   public). L'**hébergement d'un viewer partagé** (Jalon 6) est demandé à
   l'**infra interne** (stockage + authentification + page statique) — GitHub
   Actions calcule tout, l'infra n'a besoin d'aucun accès GitHub ni de faire
   tourner de calcul. Demande consolidée avec projections de volumétrie (voir
   §13) ; **réponse en attente**. En attendant, le viewer reste un usage
   local (clone du repo de données + `pnpm --filter
   @edifice.io/impact-analyzer-viewer dev`).
b. ❌ **Écartée.** GitHub Pages en visibilité privée nécessite GitHub Team ou
   Enterprise Cloud — **vérifié : l'org `edificeio` est sur le plan Free**,
   qui ne propose pas Pages du tout pour un repo privé.
c. ❌ **Écartée.** Anonymiser/agréger n'a pas été nécessaire, l'option (a)
   couvrant le besoin sans compromis sur la valeur pour la QA.

En attendant la réponse de l'infra sur l'hébergement partagé, le viewer reste
utilisable en **local et à la demande** (génération + consultation sur la
machine du dev, cf. ci-dessus) — jamais de publication en Pages public.

---

## 10. Phasage (jalons)

- ✅ **Jalon 0 — Squelette.** Package `tools/impact-analyzer`, registre des
  apps consommatrices (`apps.json`, 10 apps), wiring Turbo/CI, accès GitHub
  validé (deux fine-grained PAT, `edificeio` + `OPEN-ENT-NG`).
- ✅ **Jalon 1 — Cœur JS + Discovery.** ①②③ pour `react`, `client`,
  `utilities`, `tiptap-extensions`, `rest-client-base` → index JSON,
  exécutable en local.
- ✅ **Jalon 2 — Cœur CSS.** Analyseur Sass §5.2 fusionné dans l'index.
- ✅ **Jalon 3 — Graphe statique.** Viewer Vite + React (`viewer/`),
  consultable en local. Publication partagée toujours en cours (Jalon 6).
- ✅ **Jalon 4 — CRON + cache.** Workflow GitHub Actions nocturne hors
  week-end, cache incrémental par SHA, résilience aux échecs partiels
  (`staleSince`) — pour `generate` **et** `diff` (`--mode=ci`). Index et
  diffs poussés vers le repo privé `edificeio/impact-analyzer-data`
  (décision de confidentialité, §9).
- ✅ **Jalon 5 — Classification du diff.** ④ (3 niveaux) + score de risque.
  Diff persisté en JSON (`data/diff.<base>..<head>.json`), lu par le viewer.
- 🔶 **Jalon 6 — Viewer hébergé (recadré).** Périmètre initialement prévu
  (commentaire PR + rapport QA) **réduit** au viewer hébergé en interne
  uniquement — décision explicite, les deux autres canaux restent des
  extensions possibles mais ne sont plus engagés dans cette itération.
  Fait : `diff --mode=ci` (clone à la volée des apps via l'API GitHub, sans
  dépendre de repos frères déjà clonés). **En attente** : réponse de
  l'infra sur le stockage/l'hébergement (demande consolidée envoyée, avec
  projections de volumétrie — rétention illimitée actée, ~12 Mo après 5 ans
  au rythme actuel du repo) ; une fois reçue, reste à construire le workflow
  GitHub Actions déclenché sur `pull_request` et le déploiement du viewer.
- ✅ **Jalon 7 — CLI locale.** `cli.ts symbol <nom>` (+ `--cached`),
  `cli.ts diff --base=<ref>` (+ `--mode=local|ci`).

**Hors V1 (repoussé sciemment, pas oublié) :**
- **Auto-discovery** des apps consommatrices (scan des 2 orgs) — à reconsidérer
  si le registre manuel devient un vrai point de friction (au-delà de ~50 apps,
  oublis fréquents constatés).
- **Branches supplémentaires** (`develop-pedago`, `develop-b2school`,
  `develop-integration`, `main`/`master`) — extension de config une fois le
  registre et les branches V1 éprouvés en usage réel (chaque app déclare déjà
  ses propres noms de branches dans `apps.json`, cf. §4 — ajouter une branche
  à une app existante ne demande aucun changement de mécanisme).
- **Commentaire PR FF et rapport QA formel** (§8) — recadrés hors du
  périmètre initial du Jalon 6, restent des extensions futures possibles une
  fois le viewer hébergé et éprouvé en usage réel.

---

## 11. Critères de succès

Le besoin de départ n'était pas seulement technique : accélérer les mises en
production et réduire la tension dev/QA. Quelques mois après la mise en
service, évaluer l'outil sur ces critères — pas seulement sur son exactitude
technique :

- **Régressions détectées en amont vs en aval.** Suivre la part de régressions
  liées au FF détectées *avant* la QA (par le dev, via le commentaire PR) vs
  *pendant* la QA vs *échappées en production*. L'objectif est de faire glisser
  la détection vers l'amont.
- **Délai de cycle QA sur les PR/releases FF.** Mesurer le temps entre un merge
  FF impactant plusieurs apps et la validation QA de ces apps, avant/après mise
  en place — proxy direct de « accélérer les mises en prod ».
- **Usage réel de l'outil.** Taux de consultation du commentaire PR / du graphe.
  Un outil exact mais ignoré n'a aucun effet.
- **Ressenti qualitatif.** Un point rapide avec dev et QA après quelques
  semaines d'usage : la tension/frustration décrite en intro a-t-elle baissé ?

Ces critères n'entrent pas dans le déclenchement des jalons techniques (§10) ;
ils servent à évaluer l'outil une fois en service, pas à le construire.

---

## 12. Limites connues (à afficher dans l'outil, ne pas masquer)

- **Comportement non prouvable (🟡)** : un changement de corps à signature
  constante ne peut être classé que « à vérifier ». L'outil ne certifie jamais
  l'innocuité.
- **Filtrage cosmétique imparfait** (§6) : le diff AST sémantique peut, dans de
  rares cas, sous-évaluer un changement réel noyé dans un refactor à très large
  surface (renommages massifs, réécriture totale d'un fichier). Compromis
  assumé pour éviter le bruit systématique sur les PR de formatage.
- **CSS = confiance partielle** : classes dynamiques/concaténées, cascade,
  surcharges applicatives peuvent échapper au grep. Afficher un niveau de
  confiance.
- **Usages indirects JS** : imports dynamiques, accès par chaîne, ré-exports
  applicatifs profonds → possibles faux négatifs. À documenter.
- **Décalage temporel** : l'index CRON reflète le dernier scan nocturne (SHA
  horodatés) ; entre deux runs, un merge très récent peut ne pas encore y
  figurer. `diff --mode=ci` permet de calculer un diff à jour pour une PR
  précise à la demande — mais tant qu'il n'est pas branché sur un workflow
  `pull_request` automatique (Jalon 6, en attente d'hébergement), ce trou
  n'est comblé qu'en lançant la commande manuellement.
- **Couverture de branches partielle (V1)** : seules les branches déclarées
  dans `apps.json` par app (typiquement l'équivalent de `develop` et
  `develop-enabling`, sous des noms qui varient — `dev` sur certains repos)
  sont couvertes. Un risque introduit uniquement sur une autre branche active
  (`develop-pedago`, etc.) ne sera pas détecté avant d'ajouter cette branche
  à l'app concernée dans `apps.json` — à communiquer clairement aux équipes
  qui travaillent principalement sur ces branches.
- **Registre manuel (V1)** : contrairement à un auto-discovery, rien ne
  garantit qu'une nouvelle app migrée soit ajoutée au registre au bon moment —
  dépend de la discipline d'équipe, pas d'un garde-fou automatique.
- **Index local potentiellement désynchronisé** : en mode local (§9), le
  résultat dépend des branches réellement checked-out sur les repos frères du
  dev — peut différer du dernier index CI. Très bien pour une démo ponctuelle,
  pas une source de vérité à partager telle quelle.

---

## 13. Points à valider avant / pendant l'implémentation

- [x] **Confidentialité de la publication** (§9) — **tranchée** : repo de
      données privé dédié (`edificeio/impact-analyzer-data`) pour le CRON ;
      GitHub Pages privé écarté (org `edificeio` sur plan Free, vérifié) ;
      hébergement du viewer partagé demandé à l'infra interne.
- [x] **Accès GitHub** — **validé en conditions réelles**. Deux fine-grained
      PAT (`edificeio`, `OPEN-ENT-NG`), lecture seule, scopés aux repos du
      registre. Piège réel rencontré et documenté : `edificeio` **interdit
      les classic PAT** (message d'erreur explicite de l'API) — seuls les
      fine-grained PAT ou une GitHub App fonctionnent sur cette org ; le
      fallback générique `IMPACT_ANALYZER_GITHUB_TOKEN` (classic) ne marche
      donc que pour `OPEN-ENT-NG`.
- [x] **Canal de diffusion du rapport QA** (§8) — **recadré, pas juste
      tranché** : ni commentaire PR ni rapport QA formel dans le périmètre
      initial du Jalon 6. Le canal retenu est le **viewer hébergé en
      interne** (§8, §9). Commentaire PR et rapport QA restent des
      extensions futures possibles, pas abandonnées définitivement.
- [x] **Registre initial des apps** (§4) — **fait**, `apps.json` liste les 10
      apps actives (`edificeio` + `OPEN-ENT-NG`), maintenu à la main.
- [x] **Confirmer les branches par app** (§4) — **fait**, avec une correction
      réelle : la convention de nommage varie par repo (`dev` sur `rack`,
      `actualites`, `support` — pas `develop`), documentée en §4.
- [x] **Emplacement exact** — `tools/impact-analyzer` (+ `viewer/`).
- [ ] **Seuils du score de risque** (pondérations sévérité × sites × apps) à
      calibrer avec la QA après usage réel — **toujours ouvert**, pas encore
      fait (pas assez de recul à ce stade).
- [ ] **Hébergement du viewer partagé (Jalon 6)** — demande envoyée à
      l'infra (stockage + authentification + page statique, GitHub Actions
      calcule et pousse ; rétention illimitée actée, projections de
      volumétrie négligeables — voir demande consolidée). **Réponse en
      attente.** Une fois reçue : construire le workflow GitHub Actions
      déclenché sur `pull_request` (appelant `diff --mode=ci`) et le
      déploiement du viewer.
