# Recensement des TODO / FIXME non référencés — ENABLING-1013

Ce fichier est un **inventaire de travail**, pas une doc finale : il liste les **68** `TODO`/`FIXME`
présents dans `packages/` au 2026-08-06 (0 référencent un ticket `ENABLING-XXXX`), avec une
action recommandée par item. Rien n'a été modifié dans le code à ce stade — c'est la base pour
décider, item par item, quoi faire avant de merger la passe de résorption.

La liste vient directement de la sortie ESLint (`todo-plz/ticket-ref`), pas d'un `grep` manuel :
un premier passage au `grep` n'en trouvait que 51 car il ratait les commentaires `/* */` et
`/** */` (seuls les `//` étaient couverts). Le compte réel (68) est cohérent avec l'estimation du
ticket (« ~69 »).

Nouvelle règle ESLint en place (`todo-plz/ticket-ref`, niveau `warn`) : chaque `TODO`/`FIXME`
restant doit désormais suivre le format `// TODO(ENABLING-XXXX): ...` /
`// FIXME(ENABLING-XXXX): ...`.

**⚠️ `@edifice.io/client` est volontairement exclu de la règle pour l'instant** (62 des 68 items
recensés y sont concentrés). Objectif : recueillir les retours des auteurs d'origine sur les
items 🗑️ Obsolète et ❓ À clarifier avant de trancher, plutôt que de créer des tickets à l'aveugle
sur du code qu'on ne comprend pas totalement. La règle sera activée sur ce package une fois cette
passe de retours faite. Les tickets créés dans l'immédiat (voir plus bas) ne couvrent donc que les
items 🆕 hors `client` (`react`, `extensions`).

**Tickets créés** — regroupés sous l'Epic **ENABLING-1150** « Résorption de la dette TODO/FIXME
non référencée », tous liés à ENABLING-1013 :

| Ticket | Item |
| --- | --- |
| ENABLING-1151 | `extensions/speech-recognition.ts:95` — extension tiptap "feedback" |
| ENABLING-1152 | `useTipTapEditor.ts:113` — hack de langue codé en dur |
| ENABLING-1153 | `notificationService.ts:32` — erreur silencieuse |
| ENABLING-1154 | `useShare.ts:244` — logique à déplacer vers un service |
| ENABLING-1155 | `MediaLibrary.tsx:162` — typage `any` temporaire |
| ENABLING-1156 | `MediaLibrary.tsx:355` — Tabs, chemin non implémenté (priorité Majeur) |

Les items `client` (62/68, dont les 5 🔗 ENABLING-366 et les 40 🆕/❓ restants) seront traités
dans un ou plusieurs lots suivants, sous le même Epic, après retour des auteurs d'origine.

**Tri préalable** : **ENABLING-1157** (affecté à Pascal, Epic ENABLING-1150) demande une relecture
de ce fichier pour `@edifice.io/client` — les tickets de correction pour ce package ne seront
créés qu'une fois ce tri fait.

**Note sur les blocs de commentaires** : ESLint traite un commentaire `/* ... */` multi-lignes
comme un seul nœud, signalé une seule fois à sa ligne de *début* — même s'il contient plusieurs
occurrences de TODO/FIXME à l'intérieur (ex. `globals.ts:47`, cf. plus bas). C'est pour ça que
certaines lignes signalées peuvent sembler « en avance » par rapport au texte qui vous intéresse
réellement dans le bloc.

## Légende des actions

| Action | Signification |
| --- | --- |
| 🗑️ **Obsolète** | Code mort / commentaire déjà résolu ou dans un bloc commenté — à supprimer, aucun ticket. |
| 🔗 **Ticket existant** | Rattachable à un ticket ENABLING déjà ouvert. |
| 🆕 **Ticket à créer** | Dette réelle et actionnable, pas de ticket existant trouvé. |
| ❓ **À clarifier** | Trop vague pour trancher seul — reformuler avec l'auteur ou décider (garder/supprimer) avant de créer un ticket. |

## Résumé

| Action | Nombre |
| --- | --- |
| 🗑️ Obsolète | 9 |
| 🔗 Ticket existant | 5 |
| 🆕 Ticket à créer | 40 |
| ❓ À clarifier | 14 |
| **Total** | **68** |

## Détail par fichier

### `packages/client/src/ts/analytics/Service.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 78 | `FIXME change servers config to only keep the "all-in-one" query to /analyticsConf.` | 🔗 Ticket existant | **ENABLING-366** « [XiTi] Ménage suite à la suppression de XiTi » (ouvert, A FAIRE). Dupliqué avec `configure/Analytics.ts:88`. |

### `packages/client/src/ts/apps/timeline/Framework.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 116 | `TODO notify error` | 🆕 Ticket à créer | Groupe **« erreurs de notifications avalées silencieusement »**, avec les lignes 134, 140 et `notificationService.ts:32`. |
| 134 | `FIXME model.trigger('notifications.change')` | 🆕 Ticket à créer | Appel de rafraîchissement UI absent (code vivant, pas un bloc mort) — même groupe que ligne 116. |
| 140 | `FIXME notify.error(data);` | 🆕 Ticket à créer | `.catch` ne fait rien d'autre que `_loading = false` — même groupe que ligne 116. |

### `packages/client/src/ts/configure/Analytics.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 88 | `FIXME change servers config to only keep the "all-in-one" query to /analyticsConf.` | 🔗 Ticket existant | **ENABLING-366**. Dupliqué avec `analytics/Service.ts:78`. |
| 93 | `FIXME what to do with type "multiple" ?` | 🔗 Ticket existant | **ENABLING-366** — à vérifier au moment du traitement du ticket (sanitization xiti). |

### `packages/client/src/ts/configure/Framework.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 47 | `FIXME add ${h.toFixed(0)} to change the tag every 10 minutes` | ❓ À clarifier | Cache-busting peu granulaire ; faible valeur, à trancher (garder tel quel avec ticket léger, ou laisser tomber). |
| 65 | `TODO this.School.initialize( v ),` | ❓ À clarifier | Ligne commentée, mais `this.School` existe et est défini (L.25) — `School.initialize()` n'est donc jamais appelé. Bug potentiel ou init inutile ? À vérifier avec quelqu'un qui connaît ce module avant de trancher. |
| 82 | `//     version = ... //FIXME add ${h.toFixed(0)} ...` | 🗑️ Obsolète | Dans un bloc entièrement commenté — doublon mort de la ligne 47. |

### `packages/client/src/ts/configure/Service.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 61 | `TODO to implement` | 🆕 Ticket à créer | `getCdnUrl()` retourne `undefined` sans implémentation — fonctionnalité manquante réelle. |

### `packages/client/src/ts/configure/Theme.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 139 | `FIXME semble mal placé car a peut-être déjà été résolu !` | 🆕 Ticket à créer | L'auteur signale lui-même une logique suspecte (`reject(e)` après un `resolve()`) — à investiguer. |

### `packages/client/src/ts/configure/User.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 42 | `FIXME code review` | ❓ À clarifier | Aucun contexte sur ce qui doit être revu — décider si le code est stable (→ suppression) ou s'il reste un doute réel (→ ticket). |
| 150 | `TODO Finir l'interface, voir infra-front/me.ts` | 🆕 Ticket à créer | Groupe **« finir le bootstrapping / voir infra-front »**, avec `session/Framework.ts:11`. |

### `packages/client/src/ts/configure/interfaces.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 44 | JSDoc du `xiti()` : `... //FIXME refactor xiti configuration` (bloc L.44-48) | 🔗 Ticket existant | **ENABLING-366**. |
| 60 | `/** Legacy option (//FIXME which use ?).*/` | ❓ À clarifier | `keepOpenOnLogout` : à vérifier si un consommateur l'utilise encore avant de décider (garder documenté vs déprécier). |
| 116 | `/** (legacy) FIXME Seems to be equal to themeName. */` | ❓ À clarifier | `skin` semble redondant avec `themeName` — à vérifier avant de fusionner/supprimer. |
| 151 | `TODO: refactor, move to user's configuration ?` | 🆕 Ticket à créer | Léger. |

### `packages/client/src/ts/data/Service.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 49 | `FIXME When to call that ??` | ❓ À clarifier | `predestroy()` — le moment d'appel n'est pas défini ; à vérifier si la méthode est appelée quelque part avant de trancher. |

### `packages/client/src/ts/globals.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 29 | `FIXME userbook OR directory : ... @see IXitiTrackingParams.NOM_PAGE` | 🔗 Ticket existant | **ENABLING-366**. |
| 46 | `// TODO compléter/trier les apps suivantes` | 🗑️ Obsolète | Introduit le bloc mort de la ligne 47 (liste de noms d'apps jamais triée). |
| 47 | Bloc `/* ... */` mort (liste d'apps non triée), contient 2 mentions `FIXME` (`"userbook"`, `"directory"`) | 🗑️ Obsolète | Tout le bloc (L.47-≈100) est un scratch mort. **Ne pas perdre l'avertissement** « `ode-ts-client` ne doit pas accéder à `window.location` » — le reprendre en commentaire réel si `directory` est un jour ajouté à l'énum vivante. |
| 120 | `// TODO compléter` | 🆕 Ticket à créer | Fin d'un objet `const` vivant (pas un bloc mort) — énumération réellement incomplète. |

### `packages/client/src/ts/resources/behaviours/CommunityBehaviour.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 39 | `modified: data.name, // FIXME date ?` | 🆕 Ticket à créer | **Bug potentiel** : un champ `modified` (date attendue) reçoit `data.name` — à prioriser. |

### `packages/client/src/ts/resources/interface.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 80 | `/** FIXME */` (sans autre texte, sur `IWebResourceService`) | ❓ À clarifier | Aucune information sur ce qui est en cause — demander à l'auteur ou retirer. |
| 102 | `createdAt: string; // FIXME: S'entendre sur un format de date` | 🆕 Ticket à créer | Groupe **« format de date des ressources »**, avec la ligne 106. |
| 104 | `folderIds?: ID[]; // TODO à confirmer` | ❓ À clarifier | Pas assez de contexte pour juger si le typage est correct. |
| 106 | `modifiedAt: string; // FIXME: S'entendre sur un format de date` | 🆕 Ticket à créer | Même groupe que la ligne 102. |
| 146 | `/* FIXME only core actions here ! */` (avant `PAGES_LIST`, `DISTRIBUTE`, ...) | 🆕 Ticket à créer | Groupe **« nettoyage du registre d'actions / dépréciation des behaviours »**, avec la ligne 225. |
| 193 | Bloc `/* ... */` mort (ancien tri par champ de ressource) | 🗑️ Obsolète | Bloc entièrement commenté. |
| 225 | `//FIXME comment relier les actions aux behaviours, qu'on va remplacer.` | 🆕 Ticket à créer | Même groupe que la ligne 146 et `services/index.ts:12,15`. |
| 266 | `// TODO : other common parameters should be placed here` | ❓ À clarifier | Interface vide en attente (`IActionParameters`) — faible valeur, à trancher. |
| 271 | `// TODO : common results should be placed here` | ❓ À clarifier | Idem, `IActionResult`. |
| 437 | `/* TODO resources ? */` (devant `GetResourceParameters`) | ❓ À clarifier | Intention peu claire — à demander à l'auteur. |

### `packages/client/src/ts/rights/interface.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 25 | `/** FIXME */` (sans autre texte, sur `RightStringified`) | ❓ À clarifier | Même problème que `resources/interface.ts:80` — aucune information exploitable. |

### `packages/client/src/ts/services/index.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 1 | `TODO should be loaded from React app in future` | 🆕 Ticket à créer | Sujet architecture (chargement des resource services). |
| 12 | `export type { ILinkedResource } from ... ; // FIXME to be removed when dropping behaviours` | 🆕 Ticket à créer | Groupe **« dépréciation des behaviours »**, avec la ligne 15 et `resources/interface.ts:146,225`. |
| 15 | `export * from '../resources/SnipletsService'; // FIXME to be removed when dropping behaviours` | 🆕 Ticket à créer | Même groupe que la ligne 12. |

### `packages/client/src/ts/session/Framework.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 11 | `TODO Finir le bootstrapping, voir infra-front/lib.ts` | 🆕 Ticket à créer | Groupe **« finir le bootstrapping / voir infra-front »**, avec `configure/User.ts:150`. |
| 36 | `case 200: // error, TODO look for error message in returned html...` | 🆕 Ticket à créer | Groupe **« parsing de la réponse de login »**, avec la ligne 38 et `session/Service.ts:103,105`. |
| 38 | `case 302: // success TODO redirects cannot be intercepted with axios in a browser !!!` | 🆕 Ticket à créer | Limitation connue et non résolue (axios + redirect côté navigateur) — même groupe que la ligne 36. |

### `packages/client/src/ts/session/Service.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 103 | `case 200: // error, TODO look for error message in returned html...` | 🆕 Ticket à créer | Doublon exact de `session/Framework.ts:36` — même groupe. |
| 105 | `case 302: // success TODO redirects cannot be intercepted with axios in a browser !!!` | 🆕 Ticket à créer | Doublon exact de `session/Framework.ts:38` — même groupe. |
| 219 | `FIXME The full user's description should be obtainable from a single endpoint in the backend.` | 🆕 Ticket à créer | Sujet back+front (endpoint à fournir) — dupliqué avec `session/Session.ts:212`, même ticket. |

### `packages/client/src/ts/session/Session.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 23 | `/* TODO IResourceRight model */ type IResourceRight = any;` | 🆕 Ticket à créer | Typage `any` en attente d'un vrai modèle. |
| 212 | `FIXME The full user's description should be obtainable from a single endpoint in the backend.` | 🆕 Ticket à créer | Même ticket que `session/Service.ts:219`. |

### `packages/client/src/ts/session/interfaces.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 226 | `TODO: position pourrait être étendu à d'autres valeurs: ...` | ❓ À clarifier | Évolution future non urgente — garder en l'état avec ticket très léger, ou retirer si personne n'en a besoin. |

### `packages/client/src/ts/transport/Http.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 84 | `/* TODO : manage params.requestName through an events[]. See infra-front http.ts */` | 🆕 Ticket à créer | Groupe **« gestion de `requestName` via un système d'events »**, avec les lignes 138, 157 et `transport/Service.ts:116,171,198` (6 occurrences du même sujet, référencées vers `infra-front`). |
| 138 | Idem ligne 84 | 🆕 Ticket à créer | Même groupe. |
| 142 | `FIXME This really should be an rxjs Subject` | 🗑️ Obsolète | L'appel `notify.onEvent(...)` associé est déjà commenté (ligne suivante) et introuvable ailleurs dans le code actif (`configure/User.ts` aussi commenté) — mécanisme de notification déjà mort. |
| 157 | Idem ligne 84 | 🆕 Ticket à créer | Même groupe. |
| 158 | `FIXME: should we check response.status and only accept if range is 2xx ?` | 🆕 Ticket à créer | Groupe **« robustesse HTTP (statut 2xx) »**, avec `transport/Service.ts:199`. |
| 208 | Bloc `/* ... */` mort (`putFile` jamais activée) | 🗑️ Obsolète | Méthode entièrement commentée. |

### `packages/client/src/ts/transport/Service.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 116 | Idem `transport/Http.ts:84` | 🆕 Ticket à créer | Groupe « gestion de `requestName` via un système d'events ». |
| 171 | Idem `transport/Http.ts:84` | 🆕 Ticket à créer | Même groupe. |
| 198 | Idem `transport/Http.ts:84` | 🆕 Ticket à créer | Même groupe. |
| 199 | `FIXME: should we check response.status and only accept if range is 2xx ?` | 🆕 Ticket à créer | Même ticket que `transport/Http.ts:158`. |

### `packages/client/src/ts/transport/interfaces.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 115 | `//readonly matrixParams: ... // TODO maybe later ?` | 🗑️ Obsolète | Ligne entièrement commentée (code mort), pas un membre actif du type. |

### `packages/client/src/ts/utilities/DocumentHelper.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 74 | `FIXME add edumedia support` | 🆕 Ticket à créer | Support manquant confirmé, au niveau classe. |

### `packages/client/src/ts/widget/Framework.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 202 | `FIXME: this is a port of the old code. No longer required by widgets from ode-ngjs-front.` | 🗑️ Obsolète | L'auteur dit explicitement que ce n'est plus nécessaire — bloc mort à supprimer. |
| 204 | `// TODO Wait for the translation to be loaded ? => uncomment "return" below.` | 🗑️ Obsolète | Dans le même bloc mort que la ligne 202. |

### `packages/client/src/ts/widget/interfaces.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 56 | `/* TODO readonly schoolConf:any; */` | ❓ À clarifier | Propriété candidate jamais ajoutée à `IWidget` — à trancher (ajouter réellement, ou abandonner l'idée). |

### `packages/client/src/ts/workspace/Service.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 174 | `FIXME no more cache, how to do this ?` | 🆕 Ticket à créer | Fonctionnalité désactivée (masquer un doc partagé visible dans un dossier) — le bloc d'implémentation juste après est commenté, donc le comportement n'est pas géré aujourd'hui. |

### `packages/extensions/src/speech-recognition/speech-recognition.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 95 | `TODO create a "feedback" tiptap extension, to display user friendly error messages ?` | 🆕 Ticket à créer | UX manquante confirmée (erreurs de reconnaissance vocale seulement loguées en console). |

### `packages/react/src/modules/editor/hooks/useTipTapEditor.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 113 | `FIXME very dirty hack for demo` | 🆕 Ticket à créer | Auto-qualifié comme hack de démo resté en prod — à prioriser. |

### `packages/react/src/modules/homepage/components/Notifications/services/api/notificationService.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 32 | `TODO notify error` | 🆕 Ticket à créer | Erreur silencieuse (retourne `[]`) — même groupe que `apps/timeline/Framework.ts:116,134,140`. |

### `packages/react/src/modules/modals/ShareModal/hooks/useShare.ts`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 244 | `TODO move this logic into services` | 🆕 Ticket à créer | Refactor identifié par l'auteur — logique métier dans un hook au lieu d'un service. |

### `packages/react/src/modules/multimedia/MediaLibrary/MediaLibrary.tsx`

| Ligne | Commentaire | Action | Notes |
| --- | --- | --- | --- |
| 162 | `/*TODO type des autres résultats ?*/ any` (dans `MediaLibraryResult`) | 🆕 Ticket à créer | Typage `any` en attente — regroupable avec `session/Session.ts:23` si un ticket « nettoyage des `any` temporaires » est créé. |
| 355 | `// TODO améliorer le composant Tabs pour pouvoir le piloter depuis le parent.` | 🆕 Ticket à créer | **Priorité plus élevée** : le code path associé fait `throw 'not.implemented.yet'` (L.356) — pas juste de la dette documentaire, un chemin de code qui plante si atteint. |

## Tickets à créer — regroupements proposés

Pour éviter de créer ~40 tickets pour ~40 lignes, voici les regroupements suggérés par sujet
(à valider) :

1. **Erreurs de notifications avalées silencieusement** — `apps/timeline/Framework.ts:116,134,140` + `notificationService.ts:32`.
2. **Dépréciation des « behaviours » / nettoyage du registre d'actions** — `services/index.ts:12,15` + `resources/interface.ts:146,225`.
3. **Format de date des ressources** (`createdAt`/`modifiedAt`) — `resources/interface.ts:102,106`.
4. **Robustesse HTTP (statut 2xx)** — `transport/Http.ts:158` + `transport/Service.ts:199`.
5. **Gestion de `requestName` via un système d'events (voir infra-front)** — `transport/Http.ts:84,138,157` + `transport/Service.ts:116,171,198` (6 occurrences).
6. **Endpoint unique pour la description utilisateur** — `session/Service.ts:219` + `session/Session.ts:212`.
7. **Finir le bootstrapping / voir infra-front** — `configure/User.ts:150` + `session/Framework.ts:11`.
8. **Parsing de la réponse de login (erreur HTML / redirects axios)** — `session/Framework.ts:36,38` + `session/Service.ts:103,105`.
9. **Analytics/XiTi** (items 🔗) — à traiter dans **ENABLING-366**, pas un nouveau ticket.
10. **Typages `any` temporaires** (optionnel, faible priorité) — `session/Session.ts:23` + `MediaLibrary.tsx:162`.
11. Les autres 🆕 restent des tickets unitaires (`getCdnUrl` non implémenté, hack démo `useTipTapEditor`, `useShare` à refactorer, `MediaLibrary` Tabs — priorité plus élevée, `DocumentHelper` edumedia, `speech-recognition` feedback UX, bug potentiel `CommunityBehaviour.ts:39`, `workspace/Service.ts:174` cache, `Theme.ts:139` logique suspecte, `globals.ts:120` énumération incomplète, `configure/interfaces.ts:151`, `services/index.ts:1`).

Cela ramènerait le total à environ **19-21 tickets** au lieu de ~40 lignes isolées.

## Items « à clarifier » (❓) — à trancher avant de créer quoi que ce soit

Ces 14 items sont trop vagues en l'état pour juger seul (annotations `FIXME`/`TODO` sans aucun
contexte, ou questions ouvertes sans enjeu clair) : `configure/Framework.ts:47,65`,
`configure/User.ts:42`, `configure/interfaces.ts:60,116`, `data/Service.ts:49`,
`resources/interface.ts:80,104,266,271,437`, `rights/interface.ts:25`,
`session/interfaces.ts:226`, `widget/interfaces.ts:56`. À revoir avec les auteurs d'origine si
possible, sinon décider en équipe (garder + ticket léger, ou supprimer).
