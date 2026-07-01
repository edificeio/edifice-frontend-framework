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
- ~10 apps React actives le consomment (`communities`, `actualites`, `blog`,
  `wiki`, `support`, `explorer`, `collaborative-wall`, `homeworks`, `mindmap`,
  `rack`, …), avec 13 à ~200 fichiers importateurs chacune. Le périmètre
  **grandit** (nouvelles migrations React à venir).
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
| **Emplacement** | **Nouveau package dans le monorepo FF** (`tools/impact-analyzer` ou `packages/impact-analyzer`). Réutilise Turbo/Vite/CI en place. |
| **Nature du diff** | **Classifiée** en 3 niveaux (§6). |
| **Graphe** | **Site statique dédié** généré depuis l'index. Hébergement **non tranché** (confidentialité — cf. §9, §13) : ne pas supposer GitHub Pages public par défaut. |
| **Séquencement** | **Cœur + graphe explorable d'abord** ; commentaire PR / rapport QA / CLI ensuite (réutilisent l'index sans retoucher le cœur). |
| **Fraîcheur** | **CRON nocturne hors week-end** + relance manuelle. Temps quasi-réel (commentaire PR) en phase 2. |
| **Bruit du diff** | Diffs cosmétiques (formatage, commentaires, renommages locaux) filtrés avant classification 🟡 (§6). |
| **Canal de restitution** | Commentaire sur PR GitHub confirmé comme premier canal (§8) ; canal du rapport QA encore ouvert (§13). |
| **Critères de succès** | Mini-section dédiée (§11), hors déclenchement des jalons techniques. |
| **Confidentialité publication** | Différée, bloquante pour le Jalon 3 (§9, §13). |

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
   statique ①      sur PR FF ②         priorisé ②        `impact` ②    adaptateurs)
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
  { "name": "communities", "org": "edificeio", "repo": "communities" },
  { "name": "blog", "org": "edificeio", "repo": "blog" },
  { "name": "actualites", "org": "OPEN-ENT-NG", "repo": "actualites" }
]
```

1. Pour chaque entrée du registre, sur chaque **branche V1** (`develop`,
   `develop-enabling` — voir ci-dessous), lire le(s) `package.json` (racine
   **et** `frontend/package.json`) via l'**API Contents** de GitHub (pas de
   clone à ce stade).
2. Retenir les dépendances `@edifice.io/*` trouvées ; extraire pour chacune la
   **valeur de pin** (branche, semver, ou `workspace:*`).
3. En déduire, par package FF, le mapping **branche FF → apps qui la trackent**.
4. Ne cloner (sparse-checkout `frontend/src`) que les couples `(app, branche)`
   confirmés consommateurs à l'étape 2 — c'est là qu'interviennent les
   analyseurs §5.1/§5.2.

**Portée des branches en V1 : `develop` et `develop-enabling` seulement.** Ça
limite fortement le nombre de clones (~10-50 apps × 2 branches, pas × 6+) et
couvre le contexte de travail actuel. Les autres branches (`develop-pedago`,
`develop-b2school`, `develop-integration`, `main`/`master`, `dev` sur certains
repos) sont **différées** — l'extension est triviale : ajouter le nom de
branche à la config, sans changer le mécanisme. Limite assumée en §12.

> **Cas particuliers à gérer**
> - App pinnant un **semver figé** (ex. un ancien `rack` sur `master`) → app
>   « gelée » : impactée seulement quand elle bumpe. La marquer distinctement
>   (badge « figée sur vX.Y.Z ») plutôt que dans le flux d'une branche FF.
> - Pin `workspace:*` (monorepo interne) → ignorer (dépendance locale).
> - Un repo peut pinner des **packages FF différents sur des branches
>   différentes** → le mapping est par `(app, branche app, package FF)`.
> - Une app du registre peut ne pas avoir de branche `develop-enabling` → la
>   sauter silencieusement pour cette branche, pas une erreur.

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

---

## 8. Les sorties (adaptateurs)

Toutes lisent l'index. Ordre de livraison = §9.

1. **Graphe explorable — site statique dédié** *(livré en premier)*.
   Page HTML générée depuis l'index. **Hébergement à trancher** (§9, §13) — pas
   forcément le même canal GitHub Pages public que la Storybook, cf. la
   contrainte de confidentialité. Fonctions : recherche par symbole / par app /
   par branche, vue « qui utilise `X` », vue « que consomme l'app `Y` », comptes
   d'usage, badges de sévérité. Vue graphe (ex. Cytoscape/D3) + tableaux filtrables.
2. **Commentaire sur PR FF** *(phase 2)*. En CI sur une PR, calculer le diff →
   symboles touchés → apps/sites impactés → poster un commentaire :
   « Ce diff touche `Dropdown` (🟠) et `useOdeClient` (🟡) → communities (12),
   actualites (4), blog (0). QA : priorité communities. »
3. **Rapport QA priorisé** *(phase 2)*. Même donnée que le commentaire, formatée
   en check-list triée par score de risque et par app (exportable). **Canal de
   diffusion non tranché** (Slack dédié ? ticket Jira ENABLING ? export seul ?) —
   à décider au Jalon 6 (cf. §13). Le commentaire sur PR GitHub (point 2), lui,
   est confirmé comme premier canal à construire.
4. **CLI locale** *(phase 3)*. `impact <symbole>` et `impact --diff` (scanne les
   repos frères présents sur le disque, ou lit le dernier index publié).

---

## 9. Emplacement, stack & exécution

- **Emplacement** : nouveau package **privé** dans le monorepo FF
  (`tools/impact-analyzer`). Intégré à Turbo (`turbo.json`), build Vite si besoin.
  Ne pas le publier sur npm.
- **Stack** : TypeScript, `ts-morph` (AST JS/TS), `postcss-scss`/`sass` (Sass),
  API GitHub (`@octokit/rest`) pour la discovery + le clonage.
- **Exécution / fraîcheur** :
  - **CRON nocturne hors week-end** (GitHub Actions `schedule`, du lundi au
    vendredi) : discovery → clone/pull des branches actives → deux analyseurs →
    index → régénération et déploiement du site graphe.
  - **Relance manuelle** (`workflow_dispatch`).
  - **Cache incrémental** par SHA : ne re-analyser une app-branche que si son SHA
    a bougé (crucial vu ~10 apps × plusieurs branches × jusqu'à ~200 fichiers).
  - **Résilience aux échecs partiels** : sur ~10 apps × plusieurs branches, un
    échec isolé (branche supprimée, clone en échec, `package.json` malformé) est
    à attendre presque chaque nuit. Il ne doit **jamais** faire échouer tout le
    run : l'app-branche en échec garde sa dernière donnée valide, marquée
    explicitement périmée (`scanErrors`, cf. §7) plutôt que d'afficher une
    fraîcheur mensongère ou de faire disparaître l'app du graphe.
- **Accès GitHub** : token en secret CI, en lecture sur les **repos listés
  dans le registre** (§4), répartis sur `edificeio` **et** `OPEN-ENT-NG` — un
  accès nommé, pas un accès large à l'org entière (plus simple à faire
  approuver). Les deux orgs pouvant avoir des administrateurs différents, ne
  pas supposer qu'un seul jeton couvrira forcément les deux — prévoir que
  l'implémentation accepte **deux credentials distincts** si nécessaire. Migrer
  vers une **GitHub App** si l'outil se pérennise.

### Confidentialité de la publication (décision différée — bloque le Jalon 3)

Constat vérifié pendant le cadrage : ce repo (`edifice-frontend-framework`) est
**public**, et la Storybook y est déjà publiée sans risque car elle ne
documente que le FF lui-même. Mais l'org `edificeio` compte 201 repos privés
pour 95 publics, avec une visibilité **hétérogène côté apps consommatrices**
(ex. `communities` privé ; `blog`/`rack` publics ; `actualites`/`support`
publics mais dans `OPEN-ENT-NG`). Le graphe d'impact référence des noms d'app,
des chemins de fichiers et des volumes d'usage : publié tel quel sur le même
canal GitHub Pages public que la Storybook (comme envisagé au Jalon 3), il
**exposerait publiquement** des informations sur des apps privées.

**Décision explicitement différée** — à trancher avant d'attaquer le Jalon 3
(qui est donc *gated* par ce point, cf. §13). Options identifiées :

a. **Hébergement interne à accès restreint** (SSO/VPN interne), hors GitHub
   Pages public.
b. **GitHub Pages en visibilité privée** — nécessite de confirmer que l'org
   bénéficie de GitHub Enterprise Cloud (sinon indisponible).
c. **Rester public mais anonymiser/agréger** les données concernant les apps
   privées — dernier recours, réduit la valeur pour la QA.

Tant que ce point n'est pas tranché, le Jalon 3 doit produire le site en
**artefact non publié** (artefact de build téléchargeable, ou environnement
fermé) plutôt que de pousser directement en Pages public.

---

## 10. Phasage (jalons)

- **Jalon 0 — Squelette.** Package `tools/impact-analyzer`, **registre initial
  des apps consommatrices** (`apps.json`, les ~10 apps actives aujourd'hui),
  config des branches V1 (`develop`, `develop-enabling`), wiring Turbo/CI, accès
  GitHub validé (lecture sur les repos listés dans le registre).
- **Jalon 1 — Cœur JS + Discovery.** ①②③ pour les packages à imports JS
  (`react`, `client`, `utilities`, `tiptap-extensions`, `rest-client-base`) →
  premier index JSON pour une branche.
- **Jalon 2 — Cœur CSS.** Analyseur Sass §5.2 (composants localisés + thèmes/tokens
  globaux) fusionné dans l'index.
- **Jalon 3 — Graphe statique.** Site explorable généré depuis l'index.
  **Hébergement public bloqué en attente de la décision de confidentialité**
  (§9, §13) : en attendant, déploiement en artefact non public. **➜ Première
  valeur livrée dès que l'hébergement est tranché.**
- **Jalon 4 — CRON + cache.** Scan nocturne hors WE des deux branches V1
  (`develop`, `develop-enabling`) pour toutes les apps du registre, incrémental
  par SHA.
- **Jalon 5 — Classification du diff.** ④ (3 niveaux) + score de risque.
- **Jalon 6 — Commentaire PR + rapport QA.** Adaptateurs CI branchés sur l'index.
- **Jalon 7 — CLI locale.** `impact <symbole>` / `impact --diff`.

**Hors V1 (repoussé sciemment, pas oublié) :**
- **Auto-discovery** des apps consommatrices (scan des 2 orgs) — à reconsidérer
  si le registre manuel devient un vrai point de friction (au-delà de ~50 apps,
  oublis fréquents constatés).
- **Branches supplémentaires** (`develop-pedago`, `develop-b2school`,
  `develop-integration`, `main`/`master`, `dev`) — extension de config une fois
  le registre et les 2 branches V1 éprouvés en usage réel.

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
- **Décalage temporel** : l'index reflète le dernier scan (SHA horodatés) ; entre
  deux CRON, un merge très récent peut ne pas encore y figurer (le commentaire PR
  de la phase 2 comble ce trou pour le FF).
- **Couverture de branches partielle (V1)** : seules `develop` et
  `develop-enabling` sont couvertes. Un risque introduit uniquement sur une
  autre branche active (`develop-pedago`, etc.) ne sera pas détecté avant
  l'extension de la config — à communiquer clairement aux équipes qui
  travaillent principalement sur ces branches.
- **Registre manuel (V1)** : contrairement à un auto-discovery, rien ne
  garantit qu'une nouvelle app migrée soit ajoutée au registre au bon moment —
  dépend de la discipline d'équipe, pas d'un garde-fou automatique.

---

## 13. Points à valider avant / pendant l'implémentation

- [ ] **Confidentialité de la publication** (§9) — *bloquant pour le Jalon 3.*
      Ce repo est public ; les apps consommatrices ont une visibilité
      hétérogène (privées/publiques, 2 orgs). Trancher entre hébergement
      interne restreint, GitHub Pages privé (si Enterprise Cloud), ou
      publication anonymisée avant de déployer le graphe.
- [ ] **Accès GitHub** : faire valider par le gestionnaire GitHub un token (ou
      GitHub App) en **lecture sur les repos listés dans le registre** (§4),
      répartis sur les deux orgs `edificeio` (privée) et `OPEN-ENT-NG` (open
      source) — accès nommé, pas un accès large à l'org entière. Prévoir la
      possibilité de **deux credentials distincts** si un seul ne suffit pas
      administrativement. *Bloquant pour la discovery.*
- [ ] **Canal de diffusion du rapport QA** (§8) : Slack dédié, ticket Jira
      ENABLING, export seul, ou combinaison — à trancher au Jalon 6. Le
      commentaire sur PR GitHub, lui, est déjà confirmé comme premier canal.
- [ ] **Registre initial des apps** (§4) : lister précisément le repo exact et
      l'org de chaque app active aujourd'hui pour amorcer `apps.json`, et
      désigner qui a la responsabilité de le tenir à jour.
- [ ] **Confirmer `develop`/`develop-enabling`** sur chaque app du registre
      (sinon la sauter proprement pour la branche manquante, cf. §4).
- [ ] **Emplacement exact** dans le monorepo (`tools/impact-analyzer` proposé) et
      nom du package privé.
- [ ] **Seuils du score de risque** (pondérations sévérité × sites × apps) à
      calibrer avec la QA après le premier index réel.
