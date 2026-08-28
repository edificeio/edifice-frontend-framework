# Frontière `modules/` vs `components/` dans `@edifice.io/react`

> Synthèse d'audit — 2026-08-11 (ENABLING-1014). Aucune définition écrite de cette frontière n'existait avant ce document : ni dans `CLAUDE.md`, ni dans `CONTRIBUTING.md`, ni sous forme d'ADR. Seul `modules/homepage/README.md` documentait un pattern interne à ce module précis.

## Définition retenue

- **`modules/`** = feature métier cohérente qui possède son propre **état métier et/ou accès réseau** (appels `odeServices`, `@edifice.io/client`, react-query), exposée comme sous-export dédié du package (`@edifice.io/react/<module>`).
- **`components/`** = brique UI réutilisable qui **ne connaît jamais le réseau/le backend** — tout entre par props, tout effet de bord sort par callbacks.

Deux précisions actées pendant l'audit :

- Le pattern **Container/Presentational** (vu dans `modules/homepage/`) est une bonne pratique d'implémentation *à l'intérieur* d'un module — pas un critère de la frontière elle-même.
- Le découpage en sous-exports / entries Rollup dédiées est un mécanisme technique réel, mais son bénéfice actuel **n'est pas du lazy-loading** : aucune app consommatrice n'utilise `React.lazy`/`import()` dynamique sur ces subpaths. Le bénéfice réel est une **isolation du bundle racine** (éviter que toute app paie le poids de Tiptap, etc., même si elle n'utilise pas l'éditeur).

## Comment on y est arrivé

Le folklore répandu ("un composant trop complexe ou qui compose d'autres composants va dans `modules/`") a été testé et invalidé : `modules/widgets/` (6 fichiers, 2 composants isolés, aucun hook) est plus simple que `components/PageLayout/`, `components/Dropdown/` ou `components/UserRightsList/`.

La règle "état métier/réseau" a ensuite été vérifiée directement dans le code, module par module :

| Module/Component | Réseau/état métier vérifié | Conclusion |
|---|---|---|
| `modules/audience/` | `useReactions`/`useViews` appellent `odeServices.audience(...)` | Confirme la règle |
| `modules/comments/` | `provider/CommentProvider.tsx` + 5 hooks, appels réseau | Confirme la règle |
| `modules/homepage/` | `services/api`, `services/queries` (react-query) par sous-widget, pattern Container/Presenter documenté dans son propre README | Confirme la règle |
| `modules/multimedia/` | `MediaLibrary` orchestre 6 des 8 sous-domaines (Audio/VideoRecorder, Workspace, Linker, Embed, UploadFiles+ImageEditor) comme "innertabs", couplés par imports directs depuis le premier commit (sept. 2023) ; `MediaLibrary`, `VideoRecorder`, `InternalLinker`, `VideoEmbed` appellent tous `odeServices` | Confirme la règle — **n'est pas un grab-bag** malgré l'apparence hétérogène des sous-dossiers |
| `components/UserRightsList/` | `useBookmarkEntries`/`useSharingItems` : aucun `fetch`/`odeServices`/react-query, uniquement `useState`/`useMemo` + callbacks props | Confirme la règle côté `components/` |
| `components/AddAttachments/`, `MediaViewer/`, `Card/`, `Button/` | Aucune trace de réseau | Confirme la règle |
| `modules/widgets/` | Aucun hook, aucun provider, aucun appel réseau | **Exception — voir anomalies** |

## Anomalies identifiées (constats factuels, pas d'action corrective ici)

1. **`modules/widgets/` est du code mort.** `Widget`/`BookmarkedApps` ont été créés en août 2023 (commit `78f6da5bd`) comme le début d'un refactor du bookmarked-apps widget, jamais terminé : `components/Layout/components/WidgetApps.tsx` (préexistant) implémente le même concept et c'est lui qui est réellement branché dans `Header.tsx`, avec deux ans de vrais correctifs (i18n, gestion des liens externes, `title`). `modules/widgets` n'est utilisé nulle part, même pas en interne. Son export est de plus cassé en prod : `package.json` expose `./widgets` → `dist/widgets.js`, mais `vite.config.ts` n'a jamais défini d'entrée Rollup `widgets` (depuis le commit fondateur `a1a323a3d`, déc. 2024) — `dist/widgets.js` n'existe pas, et aucun garde-fou CI ne le détecte.
2. **`WorkspaceFolders`** (dans `modules/multimedia/`) est un corps étranger : aucun lien avec `MediaLibrary`/`Workspace`, son seul consommateur interne au repo est `components/AddAttachments/components/AddAttachmentToWorkspaceModal.tsx` — une feature différente.
3. **`ImagePicker`** (dans `modules/multimedia/`) est un second corps étranger : sert à choisir une icône d'app (`ResourceModal`/`PublishModal`, type `IWebApp`), sans rapport avec les ressources workspace que gère le reste du module.
4. **`modules/modals` et `modules/multimedia` sont dupliqués dans l'export racine** (`src/index.ts` réexporte `./modules/modals` et `./modules/multimedia`, mais pas `audience`/`comments`/`editor`/`homepage`/`widgets`). Origine : héritage de la structure pré-2.0 pour `modals` (présent dès le commit fondateur), effet de bord non documenté de la PR #347 pour `multimedia` (avril 2025, déplacement de `WorkspaceFolders`). Conséquence côté apps consommatrices : usage incohérent constaté (ex. `communities` importe `ResourceModal` depuis la racine `@edifice.io/react` mais `MediaLibrary`/`ImagePicker` depuis `@edifice.io/react/multimedia` dans d'autres fichiers du même repo). Le sous-export dédié perd une partie de son intérêt pour ces deux modules.

## Ce que ça implique pour la suite d'ENABLING-1014

La règle mécanisable pour l'outillage CI (dependency-cruiser / eslint-plugin-boundaries) envisagée par le ticket peut désormais s'appuyer sur un critère vérifiable : **un fichier sous `components/` ne doit jamais importer `@edifice.io/client` ou appeler `odeServices` directement.** C'est la version outillable de la définition retenue ci-dessus, et elle est cohérente avec tout ce qui a été vérifié pendant cet audit (aucun contre-exemple confirmé une fois les anomalies ci-dessus mises à part).

## Méthode de l'audit

Réalisé en lecture seule via 6 recherches successives (agents dédiés) : cartographie de `modules/`/`components/`, vérification du pattern Container/Presentational et des appels réseau fichier par fichier, archéologie git (`git log --follow -p`) sur `widgets`, `modals`, `multimedia` et `vite.config.ts`/`package.json`, et grep des imports `@edifice.io/react` dans 9 repos d'apps consommatrices clonés localement (communities, actualites, blog, explorer, collaborative-wall, magneto, wiki, collect, homeworks) pour vérifier l'usage réel des subpaths dédiés et l'absence de lazy-loading effectif.
