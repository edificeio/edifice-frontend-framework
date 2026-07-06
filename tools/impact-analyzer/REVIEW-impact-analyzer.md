# Revue critique — Impact Analyzer (ENABLING-1023)

> Revue de ce qui a été livré sur la branche `feat-ENABLING-1023-impact-analyzer`
> (21 commits, ~11 100 lignes ajoutées, Jalons 0 à 7 du
> `PLAN-impact-analyzer.md`). Ce document complète le plan : il évalue ce qui
> existe, liste les améliorations possibles de l'existant (§3, priorisées), et
> propose des pistes pour la suite (§4). Il est destiné à servir de **base à une
> itération future** — chaque point est actionnable et référencé
> (`fichier:ligne` au moment de la revue).
>
> Méthodologie : lecture intégrale du plan, revue de code des 4 zones (cœur
> analyseurs, discovery/CI-CD, viewer, serveur/déploiement), exécution de la
> suite de tests (38 fichiers, 180 tests, tous verts en ~4 s), inspection d'un
> index réel généré (2,7 Mo, 1 244 symboles, 101 composants CSS, 10 apps,
> 0 `scanError`).

---

## 1. Ce qui est réussi (à préserver dans toute évolution)

La qualité d'ensemble est nettement au-dessus de la moyenne pour un outillage
interne. Points forts à ne pas perdre :

- **Architecture "index = contrat"** respectée de bout en bout : le cœur
  produit un JSON versionné (`src/types/index-schema.ts`,
  `src/types/diff-schema.ts`), tout le reste (viewer, CLI, CRON) le consomme.
  Ajouter une sortie ne touche jamais le cœur — le principe cardinal du plan
  est tenu dans les faits.
- **Compromis documentés, pas subis.** Les commentaires de conception
  expliquent le *pourquoi* avec renvois au plan (§X) : choix d'éviter le
  type-checker dans `signature-shape.ts:96-109` (fuite de chemins absolus),
  symlinks `node_modules` dans le worktree de diff (`snapshot.ts:24-33`, bug
  réel observé), poids du score de risque isolés exprès pour la calibration QA
  (`risk-score.ts:9-12`).
- **Sécurité des tokens exemplaire** : auth git par `http.extraheader` jamais
  dans l'URL (`remote-clone.ts:44-52`), messages d'erreur qui ne fuient ni
  token ni commande, **et des tests qui le vérifient**
  (`remote-clone.spec.ts:93-116`, `github-client.spec.ts:50-67`).
  `execFileSync` partout (pas d'injection shell).
- **Invariant lecture seule sur les repos frères** (jamais de
  checkout/fetch/pull sur le repo d'un dev) — fort, documenté, respecté
  (`local-repo-resolver.ts:28-33`).
- **Résilience aux échecs partiels aboutie** : carry-forward + `staleSince` +
  conservation de l'ancien commit pour forcer un re-scan au run suivant
  (`build-ci-index.ts:226-255`) ; une app ne disparaît jamais silencieusement
  du rapport, et le CRON ne peut pas échouer sur des `scanErrors`.
- **Garde-fous sur la config manuelle** : un nouveau subpath `exports` FF sans
  entrée dans `config/ff-entry-map.json` fait échouer les tests
  (`entry-points.spec.ts`, `FfEntryMapMismatchError`) — l'oubli silencieux est
  impossible.
- **Corrections issues du réel, consignées** : la découverte que les noms de
  branches varient par repo (`dev` vs `develop`) a été traitée comme un bug,
  corrigée, et documentée dans le plan (§4) — bonne hygiène de feedback
  plan ↔ implémentation.
- **Tests globalement solides** : 180 tests, bien ciblés sur les cas limites
  (barrels multi-niveaux, alias d'imports, dé-dup JSX, BEM/nesting Sass,
  non-fuite de token, cache hit/miss, worktree sans résidu). Les trous sont
  identifiés en §3.5.
- **Ops sérieux pour un outil interne** : image distroless non-root,
  scan Trivy bloquant avec `.trivyignore` scopé et daté, endpoints
  `/health/*` + métriques Prometheus, logs JSON structurés, graceful shutdown.
- **README d'excellente facture** (prise en main réelle possible : prérequis,
  deux modes, PAT pas à pas, limites honnêtes) — mais périmé, voir §2.1.

---

## 2. Critique constructive — faiblesses de l'existant

### 2.1 Documentation désynchronisée (le plus visible, le moins cher à corriger)

- `tools/impact-analyzer/README.md` est resté à l'état « **Jalon 6 en cours**,
  bloqué sur le choix d'hébergement » (`README.md:10-14`) et « **pas de viewer
  hébergé partagé pour l'instant** » (`README.md:312-316`), alors que le plan
  marque le Jalon 6 **livré** (viewer déployé, ArgoCD mergé, tag
  `impact-analyzer-viewer-v0.1.0` poussé). Deux sources de vérité qui se
  contredisent — le premier lecteur venu ne sait plus laquelle croire.
- La fraîcheur annoncée « ~24h de décalage » (`README.md:285`) sous-estime le
  week-end : le CRON étant `0 2 * * 1-5`, l'index du vendredi sert jusqu'au
  lundi matin, soit **jusqu'à ~72h** de péremption.
- Le dossier `src/shared/` est vide (résidu de squelette) — à supprimer ou à
  peupler.

### 2.2 Cœur JS — faux négatifs sur des changements réellement cassants

Les limites les plus sérieuses du diff, car elles touchent la promesse
centrale (« détecter le cassant ») :

- **Génériques invisibles** : `shapeOfCallable` ne lit jamais
  `getTypeParameters()` (`signature-shape.ts:25-37`, vérifié par grep). Passer
  `foo<T>` à `foo<T, U>` ou durcir une contrainte `<T extends A>` →
  `<T extends B>` n'est **pas** classé `signature-changed`.
- **Clauses d'héritage invisibles** : `interfaceOrTypeShape` ne lit que
  `getMembers()` (`signature-shape.ts:39-47`) — changer
  `interface Props extends BaseProps` en `extends OtherProps` ne déclenche
  rien alors que la surface publique change réellement.
- **Types de retour inférés aveugles** : `getReturnTypeNode()?.getText() ??
  '<inferred>'` (`signature-shape.ts:35`) — deux retours inférés différents
  sont considérés identiques ; or le retour inféré est le cas majoritaire en
  React.
- **`kind` faux pour les composants wrappés** : `forwardRef(...)`, `memo(...)`,
  `Object.assign(Root, {...})` sont classés `const`, pas `component`
  (`symbol-extractor.ts:20-45`). Limite connue et documentée (README), la
  corrélation CSS la contourne, mais tout futur usage du champ `kind`
  (filtres viewer, pondération de risque) héritera de ce biais.
- **Pas de propagation transitive** : si `Props` change mais que
  `Button(props: Props)` est syntaxiquement inchangé, seul `Props` est flaggé
  (limite assumée dans le README, mais c'est le scénario de régression React
  le plus courant).

### 2.3 Cœur — trous fonctionnels côté usage des apps

- **Ré-exports d'app non couverts** : `export { Button } from
  '@edifice.io/react'` n'est ni compté ni tracé
  (`import-resolver.ts:56` ne parcourt que `getImportDeclarations()`).
- **Imports à effet de bord ignorés** : `import '@edifice.io/react/…/styles.css'`
  ne produit aucun binding → même hors contrat, il n'est **pas** flaggé
  (`import-resolver.ts:62-97`). Idem `import()` dynamique et `require()`.
- **Un `.scss` malformé fait tomber tout l'index CSS** : `scss.parse` n'est
  protégé ni dans `scss-parser.ts:71` ni dans `build-css-map.ts:79-81` —
  incohérent avec la tolérance par-sélecteur de `selector-extractor.ts:22-28`.
- **`@at-root` mal résolu** (la chaîne de nesting est conservée à tort,
  `scss-parser.ts:81-83`) et **collisions de corrélation silencieuses**
  (`component-correlation.ts:1-7` : premier `.find()` gagnant si deux noms
  normalisent pareil).

### 2.4 Performance — des coûts « première version » qui plafonneront

Acceptables à 10 apps × 2 branches ; ils deviendront le mur à 50 apps :

- **Tout est séquentiel** : la boucle CI `await` chaque app une à une
  (`build-ci-index.ts:131`), aucun `Promise.all` dans `src/`.
- **`findReferencesAsNodes` full-projet pour un comptage intra-fichier**
  (`usage-counter.ts:59-66`) — le language service est surdimensionné pour
  filtrer ensuite sur `node.getSourceFile() === sourceFile` ; point chaud
  probable de l'analyse d'apps.
- **Le symbol-diff relit et réimprime tous les symboles**, y compris ceux dont
  aucun fichier source n'a changé (`symbol-diff.ts:70-80`) — alors que
  `css-diff.ts:20-36` pré-filtre correctement via `git diff --name-only`.
  Asymétrie facile à combler.
- **Double lecture des fichiers d'app** : ts-morph dans `analyze-app.ts:45-51`
  puis `readFileSync` des mêmes fichiers dans `build-css-map.ts:70-73`, sans
  mutualisation ; tout le contenu de toutes les apps est en mémoire
  simultanément.
- **Trois passes ts-morph FF complètes par diff** (index head + déclarations
  head + déclarations base), documenté dans `build-diff-report.ts:54-62`.
- `carryForwardSymbolConsumers` reconstruit une Map sur tous les symboles
  pour **chaque** app carry-forwardée (`carry-forward.ts:32-33`) —
  O(symboles × apps).

### 2.5 Robustesse réseau/CI — pas de retry, pas de timeout, rate-limit ignoré

- **Aucun retry/backoff nulle part** (vérifié par grep) : un 500 GitHub, un
  timeout ou un secondary rate-limit devient immédiatement un `scanError` ; le
  carry-forward ne masque cela **que si un cache existe** (premier run et
  branches neuves exposés).
- **Aucun timeout** sur les `execFileSync('git', …)`
  (`remote-clone.ts:21-23`) : un fetch qui pend bloque tout le run.
- **Rate-limit non lu** : `github-client.ts:46-54` ne distingue pas 403
  « rate limited » de 403 « forbidden », ne lit ni `X-RateLimit-Remaining` ni
  `Retry-After`. La justification du README (`README.md:177-179`) ne compte
  que les appels Contents API, pas les clones git (limites séparées).
- Le stderr git est jeté (`remote-clone.ts:55-60`) : bon pour la sécurité,
  mais un échec réseau et une branche absente produisent le même message
  opaque — diagnostic difficile.
- Le CRON **hardcode `develop`** (`impact-analyzer-generate.yml`) : une seule
  branche FF suivie, alors que le schéma et le viewer sont multi-branches.

### 2.6 Viewer — le maillon le plus faible de l'ensemble

Fonctionnel et sobre, mais en retrait par rapport à la rigueur du cœur :

- **Pas de deep-linking** : navigation par `useState` (`App.tsx:23`), l'URL ne
  change jamais. Impossible de partager « qui utilise `Dropdown` » — manque
  structurant pour un outil dont la raison d'être est d'être montré (dev ↔ QA).
- **Pas de virtualisation ni de plafond partout** : `SymbolSearch` plafonne à
  200 lignes (`SymbolSearch.tsx:63`) mais `DiffView.tsx:87,126`,
  `WhoUses.tsx:43` et `AppConsumes.tsx:61` rendent toutes les lignes ;
  `AppConsumes` refait un `flatMap` + `sort` sur les 1 244 symboles à chaque
  rendu sans `useMemo` (`AppConsumes.tsx:21-36`). Pas de debounce de saisie.
- **Gestion d'erreur tout-ou-rien** : la moindre erreur de chargement remplace
  toute la page et l'état `error` n'est jamais réinitialisé
  (`App.tsx:59-65`) ; une erreur d'index tue aussi l'onglet Diff pourtant
  indépendant. Pas d'ErrorBoundary, pas de retry.
- **Accessibilité faible** : onglets sans `role="tab"`/`aria-selected`, inputs
  sans label (`SymbolSearch.tsx:50`), menu `PackageFilter` sans Échap ni
  navigation clavier (`PackageFilter.tsx:17-28`), aucun `:focus-visible`.
- **i18n inexistante et incohérente** : UI 100 % française avec
  `<html lang="en">` (`viewer/index.html:2`).
- **Aucun test** dans `viewer/` (ni la logique pure et critique de
  `manifest.mjs`) — contraste fort avec les 180 tests du cœur.
- **Zéro media query** dans `styles.css` : grille figée deux colonnes, tables
  sans `overflow-x` — inutilisable sur petit écran.
- Duplication entre vues : clé composite `pkg|entry|name` reconstruite à la
  main dans 4 fichiers (avec une variante `-` dans `AppConsumes.tsx:62`),
  affichage d'entry copié-collé, `SymbolSearch`/`AppSearch` quasi identiques.

### 2.7 Serveur & image Docker — bon socle, angles morts

- **Ni `Cache-Control`/`ETag`, ni compression** (`serve.mjs:97-100`, vérifié) :
  l'index de 2,7 Mo est re-téléchargé intégralement et non compressé à chaque
  navigation — le vrai goulot réseau du viewer hébergé (gzip le ramènerait
  à ~250-400 Ko).
- **Readiness laxiste** : `/health/ready` ne vérifie que `attempted`
  (`serve.mjs:120`), pas qu'un refresh ait déjà **réussi** — un token invalide
  dès le départ laisse le pod `ready` sans données.
- **Refresh** : écritures non atomiques (pas de temp-file + rename,
  `refresh-data.mjs:53-56`), pas de timeout sur `fetch`, `setInterval` sans
  garde anti-chevauchement (`refresh-data.mjs:103`), une requête API par
  fichier (base64 Contents API).
- Métriques `Gauge` suffixées `_total` (`serve.mjs:41-46`) — convention
  Prometheus réservée aux counters.
- Dockerfile : `COPY . .` invalide le cache au moindre changement du monorepo,
  `prom-client@15.1.3` codé en dur à maintenir en phase avec le catalog,
  build non reproductible sans lockfile (assumé, mais dette supply-chain),
  images de base non pinnées par digest.

### 2.8 Contrats & CLI — validation aux frontières absente

- `schemaVersion` n'est **jamais vérifié à la lecture** d'un index/diff caché
  (`--cached`, `--cache=`) : un fichier d'une version antérieure produirait
  des résultats faux sans erreur.
- `--mode=foo` passe tel quel dans `runGenerate` (`cli.ts:25`) — aucun
  narrowing `'local' | 'ci'` à la frontière.
- Le manifeste ArgoCD/chart Helm de référence vit dans le repo mais « jamais
  poussé sur GitHub » selon le plan — or `viewer/k8s-chart-reference/` est bien
  tracké. Clarifier le statut (référence versionnée assumée, ou à sortir).

---

## 3. Améliorer l'existant — plan d'action priorisé

### P1 — Corriger la promesse (faux négatifs du diff) et la doc

| # | Action | Où | Effort |
|---|---|---|---|
| 1.1 | Mettre à jour le README (Jalon 6 livré, viewer hébergé, fraîcheur ~72h le week-end) ; supprimer `src/shared/` vide | `README.md` | XS |
| 1.2 | Intégrer `getTypeParameters()` et les clauses `extends`/`implements` dans la forme comparée | `signature-shape.ts` | S |
| 1.3 | Try/catch par fichier autour de `scss.parse` → `scanError`/entrée `confidence: low` au lieu d'un crash global | `build-css-map.ts`, `scss-parser.ts` | XS |
| 1.4 | Try/catch dans `readSourceFilesText` (fichier base disparu → `needs-review`, pas un crash du diff) | `symbol-diff.ts:24-29` | XS |
| 1.5 | Flagger les imports à effet de bord et `import()` dynamiques hors contrat | `import-resolver.ts` | S |
| 1.6 | Valider `schemaVersion` à toute lecture d'index/diff, et `--mode` à la frontière CLI (erreur explicite) | `cli.ts`, lecteurs d'index | XS |
| 1.7 | Détecter `forwardRef`/`memo`/`Object.assign` dans `inferSymbolKind` (dérouler le premier argument de l'appel) | `symbol-extractor.ts` | S |

### P2 — Robustesse CI et viewer hébergé (l'outil vient d'être mis en service)

| # | Action | Où | Effort |
|---|---|---|---|
| 2.1 | Retry + backoff (5xx/429/403-rate-limit, lecture de `Retry-After`) et distinction 403 forbidden vs rate-limited | `github-client.ts` | S |
| 2.2 | Timeout sur tous les `execFileSync('git', …)` ; conserver un stderr assaini dans l'erreur (diagnostic) | `remote-clone.ts`, `local-repo-resolver.ts` | S |
| 2.3 | `Cache-Control` + `ETag` + compression (gzip/brotli) sur les JSON servis | `serve.mjs` | S |
| 2.4 | Readiness = au moins un refresh **réussi** (ou données présentes sur disque) ; renommer les gauges `_total` | `serve.mjs` | XS |
| 2.5 | Écritures atomiques (temp + rename), timeout fetch, garde anti-chevauchement de cycles | `refresh-data.mjs` | S |
| 2.6 | Paramétrer la branche FF du CRON (matrice ou input `workflow_dispatch`) au lieu de `develop` en dur | `impact-analyzer-generate.yml` | S |
| 2.7 | Pré-filtrer le symbol-diff par `git diff --name-only` (comme le css-diff) — gain de perf immédiat | `symbol-diff.ts` | S |

### P3 — Viewer : passer d'une démo à un outil partagé

| # | Action | Où | Effort |
|---|---|---|---|
| 3.1 | État dans l'URL (onglet, branche, symbole, app, diff) — hash params ou react-router ; c'est le prérequis du partage dev ↔ QA | `viewer/src` | M |
| 3.2 | Plafond + virtualisation (ou pagination) sur `DiffView`, `WhoUses`, `AppConsumes` ; `useMemo` sur le flatMap d'`AppConsumes` ; debounce des recherches | `viewer/src/views` | M |
| 3.3 | Erreurs récupérables : ErrorBoundary, reset de l'état `error`, indépendance index/diff | `App.tsx` | S |
| 3.4 | Accessibilité de base : labels des inputs/selects, pattern tabs ARIA, Échap + clavier sur `PackageFilter`, `:focus-visible` ; corriger `lang` | `viewer/src`, `index.html` | S |
| 3.5 | Premiers tests viewer : `manifest.mjs` (parsing des noms de fichiers), path-traversal de `serve.mjs`, un smoke test de rendu par vue | `viewer/` | M |
| 3.6 | Factoriser : clé de symbole partagée (`symbolKey()`), affichage d'entry, composant `SearchList` commun | `viewer/src` | S |

### P4 — Dette de fond (avant de grossir à 30-50 apps)

| # | Action | Où | Effort |
|---|---|---|---|
| 4.1 | Pool de concurrence borné (4-8) sur la boucle apps du mode CI | `build-ci-index.ts` | M |
| 4.2 | Remplacer `findReferencesAsNodes` par un comptage d'identifiants intra-fichier (descente AST locale) — mesurer avant/après | `usage-counter.ts` | M |
| 4.3 | Mutualiser la lecture des sources d'app entre analyse JS et grep CSS (passer le texte déjà chargé par ts-morph) | `analyze-app.ts`, `build-css-map.ts` | M |
| 4.4 | Fusionner `build-ff-map.ts` / `build-ff-declarations-map.ts` (une passe, deux projections) — supprime la divergence icônes | `src/ff-map` | M |
| 4.5 | Tests manquants : `usage-counter` (dé-dup JSX, namespace), `build-ff-declarations-map`, `resolve-app-tsconfig`, `cli.ts` (parsing/dispatch), SCSS malformé, symbole générique, ré-export d'app | `src/**` | M |
| 4.6 | Dockerfile : copie sélective des manifests avant `COPY . .`, pin par digest des images de base, sortir `prom-client` du hardcode | `viewer/Dockerfile` | S |

---

## 4. Pour aller plus loin — pistes pour la suite

Par ordre de valeur estimée, en réutilisant l'existant sans retoucher le cœur
(le contrat index/diff le permet — c'était le but).

### 4.1 Brancher le diff sur les PR (la brique est prête, le réflexe manque)

`diff --mode=ci` est livré ; il manque le workflow `pull_request` qui
l'appelle. C'est l'extension au meilleur ratio valeur/effort : aujourd'hui le
dev doit *penser* à consulter le viewer, demain l'information vient à lui.
Séquence proposée :
1. Workflow `pull_request` (sur `packages/**`) qui exécute `diff --mode=ci`
   base=branche cible et pousse le rapport dans `impact-analyzer-data`.
2. Commentaire PR minimal et **peu bavard** (le repo est public — filtrer :
   compteurs agrégés 🔴/🟠/🟡 + lien vers le viewer VPN, jamais de noms
   d'apps privées ni de chemins de fichiers).
3. Optionnel : `check-run` neutre (jamais bloquant) pour la visibilité dans
   l'onglet Checks.

### 4.2 Rapport QA priorisé — vue « release » plutôt que document

Plutôt qu'un rapport formel séparé (recadré à juste titre), une **vue dédiée
du viewer** : sélection de deux refs (dernière release → develop), agrégation
de tous les diffs de la période, groupée **par app** (« pour valider la
release FF X.Y, tester : communities → Dropdown (12 sites), explorer →
thème »), exportable en Markdown pour coller dans un ticket Jira. Réutilise
`DiffReport` tel quel ; c'est le format qui parle à la QA, pas au dev.

### 4.3 Calibration du score de risque avec des données réelles

Le point §13 du plan resté ouvert. Proposition concrète : après 4-6 semaines
de service, recouper les régressions réellement constatées (tickets) avec les
scores calculés au moment du merge fautif ; ajuster `SEVERITY_WEIGHT` et
éventuellement ajouter un facteur « app critique » (pondération par app dans
`apps.json`). Les poids sont déjà isolés dans `risk-score.ts` — la boucle de
feedback est le chaînon manquant, pas le code.

### 4.4 Propagation transitive des impacts de types

Le faux négatif le plus important (§2.2) : quand `Props` change, remonter aux
symboles qui le référencent dans leur signature (`Button(props: Props)`) et
les flagger `likely-breaking` par propagation (1 niveau suffit pour l'énorme
majorité des cas React). L'infrastructure existe (`build-ff-declarations-map`
conserve les nœuds) ; c'est une passe supplémentaire sur le graphe de types,
pas une refonte.

### 4.5 Historisation et tendances

`impact-analyzer-data` accumule déjà un index par nuit. Exploiter cette série
temporelle : évolution du nombre de consommateurs par symbole (candidats à la
dépréciation quand ça tombe à 0), croissance de la surface publique, apps qui
s'écartent du contrat (`outOfContractImports` dans le temps). Un onglet
« Tendances » du viewer, ou un simple script de synthèse mensuelle.

### 4.6 Extension du périmètre (dans l'ordre du plan)

- **Branches supplémentaires** (`develop-pedago`, `develop-b2school`, …) :
  mécanisme prêt (une ligne par app dans `apps.json`) — le vrai travail est
  la concurrence/perf (P4.1) et le CRON multi-branches (P2.6) *avant*
  d'élargir.
- **Auto-vérification du registre** (à défaut d'auto-discovery complet) : un
  job hebdomadaire qui scanne les 2 orgs à la recherche de `package.json`
  contenant `@edifice.io/*` et **compare au registre** — n'ajoute rien tout
  seul, ouvre une issue si une app consommatrice manque à `apps.json`.
  Couvre le risque « discipline d'équipe » (§12 du plan) pour un coût minime.
- **Semver figés** : les apps « gelées » sur un semver (cas `rack`/`master`
  du plan) ne sont pas encore matérialisées dans le viewer (badge « figée sur
  vX.Y.Z » prévu au plan §4, non implémenté).

### 4.7 Idées plus prospectives (non engagées, à instruire)

- **CLI inversée côté app** : `impact affected --app=communities` exécutée
  dans le repo d'une app, qui répond « quels changements FF récents me
  concernent » — même index, point de vue inversé ; utile avant un bump.
- **Impact visuel CSS assisté** : croiser `cssGlobalRisks` avec les stories
  Storybook existantes du FF pour proposer à la QA une liste de stories à
  re-vérifier visuellement (voire un déclenchement Chromatic ciblé).
- **GitHub App** à la place des fine-grained PAT (rotation, expiration 90 j
  des tokens actuels = panne programmée du CRON — au minimum, documenter la
  date d'expiration et mettre une alerte calendrier ; l'App supprime le
  problème).
- **MCP/agent** : exposer l'index via un petit serveur MCP interne pour que
  les assistants de code des devs répondent nativement à « qui utilise ce
  composant ? » pendant une modification du FF.

---

## 5. Synthèse

Le livrable est **solide et honnête** : architecture contractuelle respectée,
sécurité des accès soignée et testée, résilience CI réfléchie, limites
documentées plutôt que masquées. Les 7 jalons annoncés sont réellement livrés.

Les trois chantiers qui comptent maintenant :
1. **Crédibilité du diff** (P1) : génériques, héritage, robustesse aux
   fichiers malformés — c'est la promesse produit, les faux négatifs s'y
   attaquent directement.
2. **Viewer au niveau du reste** (P3) : deep-linking et tenue en charge —
   sans URL partageable, l'outil restera consulté par son auteur.
3. **Boucle de feedback** (§4.1, §4.3) : brancher le diff sur les PR et
   calibrer le score avec la QA — c'est ce qui transformera un index exact en
   changement de pratique d'équipe, l'objectif de départ (§11 du plan).
