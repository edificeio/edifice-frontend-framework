# Edifice Rich Text Editor Extensions

![npm](https://img.shields.io/npm/v/@edifice.io/tiptap-extensions?style=flat-square)
![bundlephobia](https://img.shields.io/bundlephobia/min/@edifice.io/tiptap-extensions?style=flat-square)

Extensions basées sur [Tiptap Editor](https://tiptap.dev/). Étend les fonctionnalités de l'éditeur.

## Prérequis

- `pnpm: >= 9`
- `node: >= 20`

## Démarrage

### Installation

```bash
pnpm add @edifice.io/tiptap-extensions
```

### Imports

#### Global

```bash
import { Alert, Video } from "@edifice.io/tiptap-extensions"
```

#### Imports ciblés

```bash
import { Alert } from "@edifice.io/tiptap-extensions/alert"
```

## Tests

Chaque extension est testée contre les formes HTML réelles qu'elle doit parser et rendre — format
actuel et formats legacy quand c'est pertinent — en utilisant `generateJSON`/`generateHTML` de
`@tiptap/core` (les mêmes fonctions que `src/transform/` expose en production) sous `jsdom`, qui se
comporte comme un vrai navigateur. Les tests sont colocalisés avec leur extension :
`src/<nom>/<nom>.spec.ts`.

Pour chaque extension, quand c'est pertinent :

1. **HTML → JSON** : la ou les formes HTML réelles (actuelle et legacy) se parsent dans le bon type de
   nœud/mark avec les bons attributs.
2. **JSON → HTML** : le rendu d'un document stocké produit le HTML attendu.

Contrairement à la suite golden-fixture d'`edifice-tiptap-transformer` (qui fige un snapshot JSON v2
externe pour comparer), chaque test ici écrit son HTML/JSON attendu directement en dur dans le fichier :
il n'y a pas de "snapshot v2 navigateur" préexistant à comparer, et tester une extension isolément
(pas 20 combinées) rend une assertion écrite à la main à la fois fiable et facile à lire.

Un smoke test séparé, `packages/react/src/modules/editor/hooks/useTipTapEditor.spec.tsx`, combine un
exemple de chaque extension réellement branchée dans l'éditeur réel (un "kitchen sink", sur le même
principe que celui du backend) — c'est lui qui attrape les interactions *entre* extensions (ex. un nom
dupliqué entre deux kits) qu'un test par extension isolée ne peut pas voir.

### Extensions couvertes

| Extension | Ce qui est testé |
|---|---|
| `heading`, `hyperlink` | ne sont pas masquées par les `heading`/`link` que StarterKit v3 embarque désormais par défaut |
| `linker` | distinction avec un lien simple via `data-id`+`data-app-prefix` ; sanitization du `href` `javascript:` ; également masqué par le `link` de StarterKit si non désactivé |
| `paragraph` | forme legacy `div[style]:has(> span)` *(exportée, non branchée dans l'éditeur actuellement)* |
| `alert` | balises legacy `p.info`/`div.warning`/`div.info` |
| `highlight` (CustomHighlight) | style `background-color` → attribut `color` |
| `abbr` | mark `<abbr>` |
| `mathjax` | extraction/rendu de l'équation *(exportée pour le contenu legacy ; l'éditeur réel utilise `@tiptap/extension-mathematics` à la place)* |
| `image` (custom-image) | largeur héritée du conteneur legacy `.image-container`, détection "smiley" legacy, attributs standards, URI `data:` ignorées |
| `video` | coercion de `controls` (attribut nu vs chaîne `"true"` vs absent), indicateur de captation |
| `audio` | `src`/`documentId`, balisage du conteneur |
| `iframe` | `width: "100%"` conservé tel quel vs une largeur numérique convertie en nombre, défaut d'`allowfullscreen` |
| `information-pane` | `type` via `data-type`, défaut `info` |
| `attachment` | parse les `<a>` enfants en `links[]`, retombe sur le dernier segment du `href` pour l'identifiant du document |
| `conversation-history` | le plugin ProseMirror qui regroupe tout ce qui suit un `<hr>` (nécessite une vraie instance `Editor`/transaction, pas juste `generateJSON` — le `content` initial seul ne le déclenche pas) |
| `conversation-history-body` | parse/rendu simple |
| `font-size`, `line-height`, `table-cell` | comportement actuel, **y compris** le défaut préexistant `""` au lieu de `null` pour une valeur non définie (même cause racine que `StyleCompat.ts` côté backend, non introduite par cette migration, non corrigée ici — voir le commentaire de chaque spec) |

`line-height` est exportée mais non branchée actuellement dans `useTipTapEditor.ts`.

**Volontairement non couvertes** : `speech-recognition` et `speech-synthesis` n'ont aucune logique
`parseHTML`/`renderHTML` — elles ne font que piloter les API navigateur `SpeechRecognition`/
`speechSynthesis` et n'ont aucun effet sur le contenu du document, donc hors du périmètre de cette suite
de sérialisation de contenu. `attachment-transformer.ts` (`AttachmentTransformer`) est backend-only —
l'éditeur réel utilise `Attachment` d'`attachment.ts` (confirmé via `AttachmentNodeView.tsx`).

### Ajouter un test pour une nouvelle extension

1. Créer `src/<nom>/<nom>.spec.ts` à côté de l'extension.
2. Écrire le HTML que le `parseHTML` de l'extension est censé reconnaître (format actuel, et tout
   format legacy encore supporté), et vérifier le type de nœud/mark et les attributs obtenus avec
   `generateJSON`.
3. Si l'extension produit un rendu non trivial, vérifier que `generateHTML` sur un JSON écrit à la main
   produit le HTML attendu.
4. Si l'extension est branchée dans `useTipTapEditor.ts`, ajouter un court exemple représentatif au
   contenu kitchen-sink de `useTipTapEditor.spec.tsx` aussi.

### Lancer les tests

```bash
pnpm --filter @edifice.io/react test 
pnpm --filter @edifice.io/tiptap-extensions test
```

## Régressions de la migration v2 → v3

Le passage à TipTap v3 a introduit plusieurs régressions dans `packages/extensions` et
`packages/react` (l'éditeur réel), toutes trouvées grâce à la suite de tests ci-dessus et
corrigées. Listées ici pour référence — chaque fichier porte un commentaire court expliquant le
bug précis.

| Régression | Corrigé dans |
|---|---|
| Import brut `prosemirror-state` au lieu de `@tiptap/pm/state` — risque une seconde instance ProseMirror incompatible | `src/image/image.ts`, `src/conversation-history/conversation-history.ts` |
| `@tiptap/extension-table-header`/`-row` n'existent plus en paquets séparés en v3 (fusionnés dans `@tiptap/extension-table`) | `packages/react/.../test-utils/createTestEditor.ts` |
| `StarterKit` nu entre en collision avec son `heading`/`underline`/`link` embarqués par défaut en v3, masquant nos extensions custom | `useTipTapEditor.ts`, `useCommentEditor.ts`, `createTestEditor.ts`, `EditorToolbar.spec.tsx` |
| `TextStyleKit` nu entre en collision avec les `Color`/`FontFamily`/`FontSize` ajoutés séparément | `useTipTapEditor.ts` |
| L'extension undo/redo de StarterKit a été renommée de `history` à `undoRedo` en v3 — `hasExtension('history', ...)` renvoyait toujours faux | `EditorToolbar.tsx` |
| `TextStyle` de `@tiptap/extension-text-style` a perdu son export par défaut en v3 | plusieurs `EditorToolbar.*.spec.tsx`, `has-text-style.spec.ts` |
| `FloatingMenu`/`BubbleMenu` ont déménagé de `@tiptap/react` vers `@tiptap/react/menus` | `TableToolbar.spec.tsx`, `LinkToolbar.spec.tsx`, `BubbleMenuEditImage.spec.tsx`, `BubbleMenuEditInformationPane.spec.tsx` |
| `setContent` émet désormais `'update'` par défaut (pas en v2), déclenchant `onContentChange` sur une synchronisation programmatique, pas seulement sur une vraie édition | `useTipTapEditor.ts` |
| Le bouton fusionner/scinder de `TableToolbar` restait périmé sur un simple déplacement de sélection : le hook partagé `useEditorState` n'écoutait que `'update'` (changements de contenu), pas les changements de sélection | `useEditorState.ts`, `TableToolbar.tsx` |
| Propriété `keepOnSplit` morte sur une config de `Node` (valide uniquement sur les `Mark`) — inoffensif mais faisait échouer `tsc` | `src/linker/linker.ts` |

## Nouvelle extension

Pour créer une nouvelle extension, procéder comme suit :

- Créer un sous-dossier dans `src` avec le nom de l'extension (ex : `my-extension`)

```
my-extension
```

- Créer deux fichiers dans ce nouveau dossier :
  - `index.ts`
  - `my-extension.ts`

```
my-extension
└── my-extension.ts
└── index.ts
```

- Consulter une extension existante ou se référer à la [documentation officielle](https://tiptap.dev/docs/editor/extensions/custom-extensions) pour développer une extension.
- Ajouter ensuite l'extension dans les sub-exports du `package.json`, par ordre alphabétique.

```
"./my-extension": {
  "import": "./dist/my-extension/my-extension.js",
  "require": "./dist/my-extension/my-extension.cjs"
}
```

- Lancer `pnpm run build` pour générer un bundle
- Ajouter des tests avant de committer et pousser sur le dépôt distant — voir "Tests" ci-dessus
