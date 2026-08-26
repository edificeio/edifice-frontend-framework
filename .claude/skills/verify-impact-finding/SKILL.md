---
name: verify-impact-finding
description: >
  Vérifie si les changements listés dans un rapport de diff de l'Impact
  Analyzer (@edifice.io/impact-analyzer, ce repo) cassent réellement les
  usages détectés chez les apps consommatrices d'une squad donnée. Lit le
  rapport JSON dans le repo privé edificeio/impact-analyzer-data, déduit la
  squad courante depuis la branche git active de ce repo, ne vérifie que
  les consommateurs de cette squad, et va lire le code réel (repos sibling
  ../<repo> si disponibles, sinon GitHub) pour juger. À déclencher quand on
  demande de « vérifier l'impact » d'un rapport Impact Analyzer, ou qu'on
  colle un pointeur du type « edificeio/impact-analyzer-data, fichier
  diff.X..Y.json » (généré par le bouton « Copier le prompt de
  vérification » du viewer). Analyse et verdict uniquement — ne modifie
  jamais de fichier consommateur, ne pas l'utiliser pour appliquer un
  correctif.
---

# Vérification d'un rapport Impact Analyzer

Le rapport de diff dit déjà « ce symbole a changé, ces apps l'utilisent,
voici les fichiers ». Ce qu'il ne dit pas, c'est si l'usage réel casse
vraiment — l'analyse statique du tool est volontairement prudente (§`plan
§6` : un `needs-review` n'est pas prouvé cassant, un `breaking` sans
consommateur connu n'est pas forcément sans risque). Cette skill comble ce
dernier pas : lire le code des deux côtés (la déclaration FF, l'usage
consommateur) et trancher.

## Entrée attendue

Un pointeur vers un rapport, sous la forme donnée par le bouton du viewer :
`edificeio/impact-analyzer-data, fichier diff.<base>..<head>.json (branche
main)`. Si l'utilisateur donne autre chose (un nom de rapport partiel, "le
dernier rapport de develop-enabling"...), résous-le au mieux ou demande.

## Procédure

### 1. Récupérer le rapport

`edificeio/impact-analyzer-data` est un repo **privé** — peu probable qu'il
soit cloné en local. Dans l'ordre :
1. S'il existe en sibling (`../impact-analyzer-data`), le lire directement.
2. Sinon, `gh api -H "Accept: application/vnd.github.raw" "repos/edificeio/impact-analyzer-data/contents/<fichier>?ref=main"` — utiliser le media type `raw`, jamais le JSON par défaut (les gros fichiers de ce repo renvoient un `content` vide en JSON au-delà de 1 Mo, cf. `tools/impact-analyzer/viewer/server/refresh-data.mjs`).

Le rapport (`DiffReport`, cf. `tools/impact-analyzer/src/types/index-schema.ts` ou son équivalent diff) contient `base`/`head` (ref + commit du FF), `symbolDiffs[]` et `cssDiffs[]`, chacun avec `severity`, `changeKind`, `riskScore`, `consumers[]` (`app`, `org`, `repo?`, `appBranch`, `appCommit`, `files[]` déjà repo-root-relative, `usageSites`).

### 2. Déterminer la squad cible

1. `git -C <racine de ce repo FF> rev-parse --abbrev-ref HEAD`.
2. Si ce nom est déjà une branche de squad connue (`develop`, `develop-enabling`, `develop-b2school`, `develop-pedago`, `develop-integration`, `develop-orga` — liste faisant foi : la matrice `ff_branch` de `.github/workflows/impact-analyzer-generate.yml`), c'est la squad. **Ne pas essayer de déduire la squad du nom d'une branche de travail** (préfixe de ticket Jira type `ENABLING-`/`PEDAGO-`/`IMPULS-`/`INTEG-`/`ORGA-`) : la correspondance entre projet Jira et branche de squad n'est ni garantie ni connue de cette skill (`INTEG` ne matche même pas `develop-integration` en substring, `IMPULS` ne correspond à aucune branche de squad connue) — deviner à partir de ça produirait un résultat faux avec confiance.
3. Sinon (branche de travail du type `chore-ENABLING-1175-...`), calculer `git merge-base HEAD <branche>` pour chaque branche de squad connue à partir des refs **déjà présentes localement** (`origin/<branche>`) — **ne pas `git fetch` avant cette étape**, la fraîcheur ne compte pas pour cette déduction grossière (elle compte à l'étape 5, sur le contenu réellement lu). Retenir la branche dont le merge-base est **le commit le plus récent** parmi tous les candidats (`git log -1 --format=%ct <sha>`) — c'est l'ancêtre commun le plus proche, donc la squad la plus probable.
4. Si aucune branche ne matche clairement ou si plusieurs candidats sont à égalité, **demander explicitement** plutôt que deviner — une mauvaise squad fait vérifier les mauvaises apps pour rien. Une égalité n'est pas un échec de l'heuristique à corriger : quand deux branches de squad partagent le même point de fork (branches peu divergées, ou rebase récent de l'une sur l'autre), rien dans l'historique git ne permet de les distinguer — c'est une ambiguïté réelle, pas un bug.

`develop`/`dev` sont la squad "mainline" — traiter les deux noms comme équivalents (convention déjà en place dans le viewer, cf. `branchGroupKey` dans `tools/impact-analyzer/viewer/src/lib/branch-group.ts`).

### 3. Filtrer les consommateurs

Ne garder, dans `symbolDiffs[].consumers`/`cssDiffs[].consumers`, que les entrées dont `appBranch` correspond à la squad résolue. **Ne jamais vérifier une app sur une branche qu'elle n'a pas listée pour cette squad** — inutile et coûteux en tokens.

Prioriser par défaut : `breaking` et `likely-breaking` d'abord (le tool y attache déjà le risque réel), `needs-review` en second (corps changé, signature identique — souvent un non-événement, à survoler plutôt qu'creuser en profondeur sauf demande explicite).

**`cssDiffs` de type risque global** (`CssGlobalRisk` : un champ `affectedApps` en liste plate, pas de `consumers[]`/`appBranch`) échappent à ce filtrage par squad — pas de granularité par branche possible, ils s'appliquent à tout le monde par nature (fichier de thème compilé globalement). Toujours les regarder au moins une fois, quelle que soit la squad résolue.

Si le nombre de (app, fichier) à vérifier après filtrage reste important une fois l'étape 6 appliquée (au-delà d'une quinzaine), ne pas foncer tête baissée : proposer un périmètre réduit (les N plus gros risques, ou une app précise) et laisser l'utilisateur trancher.

### 4. Résoudre les repos locaux

Pour chaque app retenue, l'org/repo/path viennent de `tools/impact-analyzer/apps.json` (source de vérité, déjà exacte pour ce que le tool a scanné).

1. Chercher dans le cache utilisateur `~/.claude/impact-analyzer/local-repos.json` (clé `"<org>/<repo>"`, valeur = chemin absolu). Si présent, vérifier que le chemin existe encore et contient un `.git` — sinon l'ignorer.
2. Sinon, chercher `../<repo>` (convention sibling déjà en place dans ce tool, cf. `IMPACT_ANALYZER_REPOS_ROOT` dans le README). Informer l'utilisateur des repos qu'on va regarder dans `../` avant de le faire.
3. Si toujours introuvable, demander le chemin à l'utilisateur, puis l'écrire dans le cache (créer le fichier/dossier si besoin) pour ne plus le redemander la prochaine fois.
4. Revalider le cache à chaque usage : un chemin caché mais qui n'existe plus doit retomber sur l'étape 2, pas planter.

### 5. Lire le code

**Déclaration FF (le symbole qui a changé)** : toujours disponible localement, c'est le repo dans lequel cette skill tourne. Lire l'ancienne et la nouvelle version via `git show <base.commit>:<fichier>` et `git show <head.commit>:<fichier>` (les chemins sont dans `sourceFilesBase`/`sourceFilesHead` du symbolDiff) — jamais de checkout, `git show` lit un blob à un commit donné sans toucher au working tree.

**Fichier consommateur** :
- Si le repo est résolu en local (étape 4) : `git -C <chemin> fetch origin <appBranch> --quiet` (lecture seule, ne touche jamais au working tree ni à la branche courante de l'utilisateur — juste la ref distante), puis `git -C <chemin> show origin/<appBranch>:<fichier>`. Ça garantit de lire l'état réel de la branche même si le clone local est resté sur une autre branche ou est en retard.
- Sinon : `gh api -H "Accept: application/vnd.github.raw" "repos/<org>/<repo>/contents/<fichier>?ref=<appBranch>"` — uniquement les fichiers réellement flaggés, jamais un dump du repo entier.
- **Plusieurs repos consommateurs à fetch : les lancer en parallèle**, jamais en boucle séquentielle — ils sont indépendants (ex. `for r in ...; do git -C "$r" fetch origin "$branche" --quiet & done; wait`). Un fetch réseau par repo l'un après l'autre n'a aucune justification ici.

### 6. Juger

**Toujours commencer par le diff FF** (`git show base.commit:fichier` vs `git show head.commit:fichier`) **avant de lire un seul fichier consommateur** — pour chaque symbole, pas seulement quand le volume est gros. Un changement `needs-review`/`body-changed` a par construction une signature identique : si le diff FF ne montre aucun changement de contrat (paramètres, valeur de retour, comportement documenté) qu'un appelant normal pourrait observer, la vérification exhaustive fichier par fichier est souvent inutile et peut être court-circuitée directement à partir de cette lecture. Ne descendre au niveau des fichiers consommateurs que pour un point précis que le diff FF laisse en doute (ex. une classe CSS ou un attribut supprimé — vérifier par un grep ciblé si un consommateur en dépend, pas par une lecture exhaustive), ou quand le diff FF lui-même ne permet pas de trancher.

Pour chaque (app, fichier, symbole) [ou le point ciblé identifié ci-dessus] : comparer précisément ce qui a changé côté FF avec l'usage réel. Trancher :
- 🔴 **casse** — l'usage est incompatible avec le nouvel état, citer les lignes concernées des deux côtés.
- 🟢 **ne casse pas** — l'usage reste valide malgré le changement, expliquer pourquoi (ex. un paramètre optionnel ajouté, ou directement établi par la lecture du diff FF sans avoir eu besoin d'ouvrir le fichier consommateur).
- 🟡 **à vérifier manuellement** — l'analyse ne peut pas trancher avec certitude (ex. usage dynamique, comportement runtime, changement hors du périmètre annoncé de la PR type palette de couleur) ; dire précisément quoi vérifier et par qui (dev, PM, QA — pas toujours du code).

Ne jamais rendre un verdict sans base réelle (diff FF lu à minima, fichier consommateur si le diff FF ne suffit pas) — un verdict basé uniquement sur `changeKind`/`severity` du rapport n'apporte rien de plus que le rapport lui-même.

## Restitution

Un résumé groupé par app, puis par fichier, avec le verdict, la citation du code pertinent (avant/après si utile) et le raisonnement. Terminer par un décompte (X casse, Y à vérifier, Z ok) pour une lecture rapide.

Toujours clore par un **court paragraphe à destination de la QA**, distinct du bilan technique et écrit sans jargon de code : quoi tester manuellement, quoi vérifier visuellement, points d'attention — y compris quand le bilan technique conclut "ne casse pas" (un changement peut être correct techniquement et mériter un contrôle visuel/fonctionnel quand même, ex. un composant visuel modifié, un timing à observer). Mettre en avant en premier tout point resté 🟡 nécessitant une confirmation humaine.

## Pièges connus

- **Ne jamais checkout ni modifier le working tree** d'un repo sibling — `git show`/`git fetch` seulement. Ce tool a pour principe établi (cf. README `tools/impact-analyzer/`) de ne jamais muter l'état local d'un autre repo automatiquement ; cette skill suit la même règle.
- **Ne jamais éditer de fichier consommateur** — analyse et verdict uniquement, même quand le correctif semble évident.
- **Squad mal déduite = travail inutile** — en cas de doute sur l'étape 2, demander plutôt que deviner.
- **`develop` vs `dev`** — certains repos consommateurs utilisent `dev` comme branche mainline (cf. `apps.json`) ; c'est la même squad que `develop`, pas une squad différente.
- **Apps monorepo** (`conversation`/`portal`/`timeline` dans `entcore`) : `apps.json` a un champ `path` par app, mais les chemins de fichiers du rapport sont déjà repo-root-relative (le `path` y est inclus) — pas besoin de le reconcaténer.
- **Media type GitHub** : toujours `application/vnd.github.raw` pour lire le contenu d'un fichier, jamais le défaut JSON (silencieusement vide au-delà de 1 Mo).
