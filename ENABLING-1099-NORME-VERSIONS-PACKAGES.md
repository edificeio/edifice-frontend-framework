# ENABLING-1099 — Norme de gestion des versions `@edifice.io/*` dans les apps React

> **Ticket** : [ENABLING-1099](https://edifice-community.atlassian.net/browse/ENABLING-1099)
> **Mesures datées du 28/07/2026** — les dist-tags sont mouvants, toute mesure a une date.
> **Périmètre** : 14 fronts React (13 apps + 1 lib partagée), dont **3 publiés sur npm**.
> Un nom en texte simple désigne un **repo**, un nom en code un **package npm** — voir
> [la correspondance](docs/enabling-1099/1-constats.md#repo-ou-package-npm).
> **Statut** : analyse et norme. Aucun code applicatif modifié.

| Document | Contenu |
| --- | --- |
| [1 — Constats](docs/enabling-1099/1-constats.md) | Mécanisme du bug, mesures, banc d'essai |
| [2 — Actions](docs/enabling-1099/2-actions.md) | Les 10 règles : contenu exact, impact, inconvénients |
| [3 — Méthode](docs/enabling-1099/3-methode.md) | Comment mesurer et vérifier |
| [**4 — Actions par repo**](docs/enabling-1099/4-actions-par-repo.md) | **Le code exact à appliquer, repo par repo, avec les chemins de fichiers** |

---

## Le problème

`EdificeClientProvider` crée son contexte React au niveau module. **Deux copies physiques de
`@edifice.io/react` dans un `node_modules` produisent deux objets de contexte distincts** : le Provider
monté par la copie A ne remplit pas le contexte lu par la copie B → `Cannot be used outside of
EdificeClientProvider`.

Ce n'est pas la version qui compte, c'est l'unicité : deux copies de la même version suffisent. La
duplication est une condition **nécessaire et non suffisante** — il faut qu'un Provider et un
consommateur tombent de part et d'autre. Une app peut donc fonctionner avec deux copies, la panne
n'apparaissant qu'au moment où un refactor, un nouvel écran ou un nouvel embarquement franchit la
frontière.

Deux packages sont concernés, tous deux singletons à contexte React : **`@edifice.io/react`** et
**`@tanstack/react-query`** (`QueryClient` diffusé par `QueryClientProvider`).

---

## État mesuré

Résolution de la configuration de la **branche de référence** de chaque repo. **4 fronts sur 14 sont
dupliqués** :

| Front | Socle : copies | `react-query` : copies / versions |
| --- | --- | --- |
| **communities** | **3** | **2** / 2 |
| **rack** | **2** | **2** / 2 |
| **collect** | **2** | **2** / 2 |
| **boilerplate** | **2** | **2** / 2 |
| Les 10 autres | 1 | 1 / 1 |

Sur les branches de référence, le socle n'a **qu'une version** partout — le dist-tag l'unifie. Toute la
duplication vient des **variantes de peers**, et la cause tient en une ligne :

> `ode-explorer` épingle `"@tanstack/react-query": "5.62.7"` en version exacte. **Une app est dupliquée si
> et seulement si son pin `@tanstack/react-query` diffère de `5.62.7` et qu'elle compose un package
> Edifice tiers.**

La corrélation est totale : `blog`, `collaborative-wall`, `mindmap` et `wiki` composent `ode-explorer` et
n'ont **qu'une copie**, parce qu'ils épinglent `5.62.7` comme lui. `rack`, `collect` et `communities`
épinglent `5.81.5`, `boilerplate` épingle `5.90.21` : ils sont dupliqués. `homeworks` épingle `5.90.21`
mais son override racine l'impose aussi à `ode-explorer` — une seule copie.

→ [mesures et détail par front](docs/enabling-1099/1-constats.md#copies-actives-par-front)

**Deux défauts à corriger** :

| Défaut | Où | Nature |
| --- | --- | --- |
| `@edifice.io/collect-frontend` est publié avec un spec `workspace:*` → **package ininstallable** hors workspace, sur `latest` et `develop`. Cause : `npm publish` au lieu de `pnpm publish`. | `collect` | Bug bloquant |
| `ode-explorer`, `@edifice.io/collect-frontend` et `@edifice.io/wiki` — les **3 seuls fronts publiés sur npm** — déclarent le socle en `dependencies` au lieu de `peerDependencies` → pnpm leur installe leur propre copie. | repos `explorer`, `collect`, `wiki` | Cause structurelle de la duplication |
| `rack`, `collect` et `boilerplate` déclarent `ode-explorer` **sans jamais l'importer** — déclaration héritée du boilerplate. Retirer la ligne fait passer `collect` et `boilerplate` de 2 à 1 copie. | 3 fronts | Duplication gratuite |

→ [tous les constats mesurés](docs/enabling-1099/1-constats.md)

---

## Contraintes respectées

| Contrainte | Conséquence |
| --- | --- |
| Les dist-tags sont le mécanisme de ciblage **environnement de recette + squad**, manifestes publiés inclus. | Aucun tag modifié, aucun pin exact imposé sur `@edifice.io/*`. |
| `pnpm-lock.yaml` reste non versionné. | La norme fonctionne sur un `node_modules` reconstruit de zéro. |

---

## Les actions

Principe : **`@edifice.io/react`, `@edifice.io/client` et `@tanstack/react-query` sont des singletons.
Une app doit garantir qu'il n'en existe qu'une copie physique.**

| # | Action | Portée | Coût | Importance |
| --- | --- | --- | --- | --- |
| **N11** | Retirer les dépendances `ode-explorer` **inutilisées** — `rack`, `collect`, `boilerplate` ne l'importent jamais | 3 `package.json` | 3 lignes | **Élevée, coût nul** : mesuré, `collect` et `boilerplate` passent de 2 à 1 copie. |
| **N6** | `pnpm publish`, jamais `npm publish`, dans un workspace | `collect/package.json:50` | 1 ligne | **Bloquant** : un package publié est ininstallable. Prérequis de N9 sur `collect`. |
| **N5** | Check CI « une seule copie physique » des singletons, dans le pipeline qui livre | `@edifice.io/cli` + 10 Jenkinsfile | ~½ j | **Élevée** : c'est le seul garde-fou automatique, et il fournit la mesure avant/après N9. |
| **N9** | `peerDependencies` au lieu de `dependencies` dans tout package publié qui consomme le socle | 3 `package.json` + republication | ~2 j | **Élevée** : supprime la cause structurelle. Se propage seule aux 8 fronts consommateurs. |
| **N4** | `resolve.dedupe` dans chaque `vite.config` | 14 `vite.config.ts` | 7 lignes | Moyenne : filet bundler, défense en profondeur. |
| **N3** | Supprimer les `resolutions` placés dans un membre de workspace — ignorés par pnpm | 3 `package.json` | 1 h | Moyenne : supprime une configuration trompeuse. |
| **N10** | Ne pas committer d'artefact de build généré (`explorer/frontend/package.json`) | 1 `.gitignore` | 1 h | Moyenne : le fichier commité contredit le train de sa branche. |
| **N8** | Retirer `sync:lockfile` (`pnpm update`) de `install:prod` | 3 `package.json` | ½ j | Moyenne : supprime une re-résolution non contrôlée au build de prod. |
| **N2** | Un seul train (tag) par app | Règle de revue | — | Préventive : aucune occurrence aujourd'hui, risque mesuré. |
| **N7** | Aligner la toolchain, en priorité l'écart intra-repo (`pnpm@10.x` racine vs `9.12.2` front) | 14 + 4 `package.json` | ~2 j | Faible : aucun incident constaté. |

→ [contenu exact, impact et inconvénients de chaque règle](docs/enabling-1099/2-actions.md)
→ [**le code à copier, repo par repo**](docs/enabling-1099/4-actions-par-repo.md)

### N9 se propage sans intervention des squads

Deux faits mesurés le permettent :

1. Les 10 fronts qui composent un package Edifice tiers le spécifient par un **dist-tag** (`develop`),
   jamais par une version exacte.
2. 13 des 14 `frontend/build.sh` font `rm -f pnpm-lock.yaml` dans `clean()`, appelée par Jenkins avant
   l'install : chaque build de CI re-résout tout.

Republier `ode-explorer@develop` avec des `peerDependencies` suffit donc : le tag bouge et les 8 fronts
consommateurs récupèrent la correction au build suivant. **Aucune squad n'a de configuration à écrire.**
Seul le train de release (`master`/`latest`) demande un bump explicite ; `rack` y a déjà un override.

### Risque à couvrir pendant N9

La copie privée du socle dont dispose aujourd'hui `ode-explorer` **masque les incompatibilités de
version**. En passant au socle fourni par l'app hôte, une incompatibilité réelle se manifestera par une
erreur d'export manquant. Dérouler donc **un package à la fois, avec validation d'une app pilote**.

---

## Récapitulatif par front

Configuration lue sur la branche d'intégration de référence de chaque repo.

| Front | Réf. | Racine pnpm | Tag socle | `react-query` | Compose | Overrides racine | `resolutions` ignoré | `dedupe` | **Copies socle** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **communities** | `develop` | ws | `develop` | **5.81.5** | collect-frontend, wiki | oui | oui | non | **3** |
| **rack** | `dev` | ws | `develop` | **5.81.5** | ode-explorer, collect-frontend | oui | oui | non | **2** |
| **collect** | `develop` | ws | `develop` | **5.81.5** | ode-explorer | non | oui | non | **2** |
| **boilerplate** | `main` | standalone | `develop` | **5.90.21** | ode-explorer | non | – | non | **2** |
| blog | `develop` | standalone | `develop` | 5.62.7 | ode-explorer | non | – | non | 1 |
| collaborative-wall | `develop` | standalone | `develop` | 5.62.7 | ode-explorer | non | – | non | 1 |
| mindmap | `develop` | standalone | `develop` | 5.62.7 | ode-explorer | non | – | non | 1 |
| wiki | `develop` | standalone | `develop` | 5.62.7 | ode-explorer | oui (`katex`) | – | non | 1 |
| actualites | `dev` | standalone | `develop` | 5.62.7 | — | non | – | non | 1 |
| support | `dev` | standalone | `develop` | 5.90.21 | — | non | – | non | 1 |
| entcore/auth | `dev` | standalone | `develop-enabling` | 5.90.21 | — | non | – | non | 1 |
| entcore/timeline | `dev` | standalone | `develop-b2school` | 5.90.21 | — | non | – | non | 1 |
| explorer *(lib partagée)* | `develop` | standalone | template | 5.62.7 | — | non | – | non | 1 |
| homeworks | `dev` | ws | `develop` | 5.90.21 | ode-explorer | **oui** | – | **oui** | **1** |

Les 4 fronts dupliqués sont exactement ceux qui **composent** un package Edifice tiers **et** dont le pin
`react-query` diffère de `5.62.7`. `homeworks` échappe à la règle grâce à son override racine.

**Il n'existe aucun couplage runtime entre apps.** rack et actualites sont buildées, livrées et
consommées séparément : aucun scénario où l'une casse l'autre.

---

## Ordre d'exécution

| Étape | Contenu | Coût |
| --- | --- | --- |
| 1 | **N11** — retirer `ode-explorer` de `rack`, `collect` et `boilerplate` (+ du boilerplate lui-même, pour ne plus propager) | ~1 h |
| 2 | **N6** sur `collect` + republication de `collect-frontend` — corrige aussi `rack` et `communities`, qui héritaient de son `ode-explorer` | ~1 h |
| 3 | **N5** dans `@edifice.io/cli`, branché sur `collect` et `rack` — remesure après les étapes 1 et 2 | ~½ j |
| 4 | **N9 sur `ode-explorer`** (dans `package.json.template`) + **N10** + republication + validation sur `wiki` ou `blog` | ~1 j |
| 5 | **N9 sur `@edifice.io/wiki`** puis **`@edifice.io/collect-frontend`**, un package à la fois | ~1 j |
| 6 | **N4** généralisé | ~½ j |
| 7 | **N3** — suppression des 3 blocs ignorés | ~1 h |
| 8 | **N8** · **N2** en règle de revue | ~½ j |
| 9 | **N7** par vagues | ~2 j |

Les étapes 1 et 2 coûtent deux heures et retirent la duplication de `collect` et `boilerplate` — la moitié
des fronts concernés — sans toucher au socle ni republier `ode-explorer`.

Les étapes 1 à 4 se font dans `collect` et `explorer` et couvrent l'essentiel : elles ne demandent
aucune coordination inter-squads.

**Actions par repo :**

| Repo | À faire |
| --- | --- |
| **explorer** | N9 sur `explorer/frontend` (publié sous `ode-explorer`), dans le `.template` · N10 · N4 · N5 |
| **collect** | **N11** (retirer `ode-explorer` inutilisé) · **N6** + republication · N9 sur `collect/frontend`, publié sous `@edifice.io/collect-frontend` · N3 · N4 · N5 · N8 · N7 |
| **wiki** | N9 sur `wiki/frontend`, publié sous `@edifice.io/wiki` |
| **socle** | script N5 dans `@edifice.io/cli` |
| rack | **N11** (retirer `ode-explorer` inutilisé) · N3 · N4 · N5 · N8 · N7 |
| communities | N3 · N4 · N5 · N8 · N7 |
| **boilerplate** | **N11** — et retirer la déclaration du gabarit, pour ne plus la propager |
| blog · collaborative-wall · mindmap · homeworks | N4 · N5 |
| actualites · support · entcore/auth · entcore/timeline | N4 · N5 |

---

## Hors périmètre

**La reproductibilité des builds n'est pas traitée.** Avec des dist-tags dans les `dependencies`, sans
lockfile versionné et avec `rm -f pnpm-lock.yaml` dans 13 `build.sh`, rebuilder le même commit produit un
artefact différent. La norme garantit qu'il n'y aura qu'une copie du socle, pas laquelle.

Deux leviers écartés pour ce ticket : versionner `pnpm-lock.yaml`, et pinner les versions
`@edifice.io/*`.
