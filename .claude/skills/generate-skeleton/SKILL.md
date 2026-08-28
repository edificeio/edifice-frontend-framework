---
name: generate-skeleton
description: >
  Génère la variante skeleton d'un composant existant du FrontendFramework Edifice,
  en réutilisant sa mise en page réelle et en dérivant ses dimensions du CSS plutôt
  que d'une maquette. À utiliser quand on demande le skeleton / placeholder de
  chargement d'un composant du FF (« fais le skeleton de X », « ajoute un
  placeholder de chargement à X », « génère le loading state de X »). NE PAS
  utiliser pour créer la primitive Skeleton elle-même (elle existe), ni pour un
  fallback `<Suspense>` de module entier (maquette de page, non générable).
---

# Génération d'une variante skeleton

Un skeleton n'est pas un composant autonome : c'est **un état du composant**. Sa
seule raison d'être correcte est de reproduire la géométrie exacte du composant
qu'il remplace, sinon il produit du layout shift à l'arrivée des données. Toute la
skill découle de ça : on ne dessine pas des rectangles gris, on **recopie une mise
en page et on remplace les slots de contenu**.

La brique de base est la primitive `<Skeleton>` de `@edifice.io/react`
(`variant`, `tone`, `animation`, `width`, `height`). Ne jamais réimplémenter un
bloc gris à la main, ne jamais utiliser la classe Bootstrap `.placeholder` : son
animation est inconditionnelle et son opacité de 50% n'est pas désactivable.

Exemple de référence, à lire avant de commencer :
`packages/react/src/modules/homepage/components/Notifications/NotificationSkeleton.tsx`.

## Étape 1 — Trouver le vrai propriétaire de la mise en page

Le composant nommé dans la demande est rarement celui qui porte le layout. Remonter
la chaîne de délégation jusqu'au composant qui écrit réellement les wrappers et les
classes.

Dans le cas Notification, la demande porte sur « Notification », mais
`NotificationItem` délègue à `UserNotificationItem` ou `SystemNotificationItem`,
qui délèguent tous deux à `CommonNotificationItem` : c'est **ce dernier** que le
skeleton doit refléter. Reproduire la mise en page du composant d'entrée aurait
produit un placeholder sans rapport avec le DOM réel.

Vérifier aussi qui **consomme** le composant : s'il existe déjà un skeleton, un
appelant peut lui passer une `ref` (dans le cas Notification, `NotificationList`
s'en sert comme sentinelle d'infinite scroll). Un `forwardRef` supprimé casse
silencieusement l'appelant.

## Étape 2 — Inventorier les slots et leurs sources de vérité

Lire le JSX du propriétaire de la mise en page **et** son SCSS dans
`packages/bootstrap/src/components/`. Produire, avant d'écrire une ligne, un
inventaire de cette forme :

| Slot | Élément réel | Classe | Dimension | D'où elle vient |
| --- | --- | --- | --- | --- |
| avatar | `Avatar variant="circle"` | `.notification-item-avatar` | 32 × 32 | `width/height: var(--primitive-numbers-32)` |
| message | `div` | `.notification-item-message` | 22 par ligne | `font-size-small` sur `font-lineheight-xs` |
| chip | `div` | `.notification-item-resource` | h 28, largeur contenu | padding 2 + (icône 20 + padding 2) |
| horodatage | `p` | `.notification-item-date` | h 18 | `font-lineheight-3xs` |

Si une ligne de ce tableau n'a pas de source de vérité dans le CSS, **elle n'est
pas dérivable** : voir l'étape 6.

## Étape 3 — Dériver les dimensions, ne jamais les inventer

C'est le cœur de la skill. Une skill qui invente des dimensions est pire que pas de
skill : elle produit du layout shift avec l'apparence du sérieux.

Les règles de dérivation sont les suivantes. Une **ligne de texte** vaut la
`line-height` de son slot, pas la taille de police : chercher le couple
`--primitive-font-size-*` / `--primitive-font-lineheight-*` du sélecteur. Un
**média** a une largeur et une hauteur explicites, souvent via
`--primitive-numbers-*` : réutiliser directement la classe du composant plutôt que
de recopier le nombre, la primitive laisse la classe gagner quand `width` et
`height` ne sont pas passés. Un **chip ou un badge** a une hauteur calculable :
padding vertical du conteneur, plus le plus grand de son contenu (une icône avec son
propre padding, ou la `line-height` de son label). Un **conteneur** apporte son
padding et ses gaps : reprendre sa classe donne tout gratuitement.

Attention au piège arithmétique des lignes multiples. Une maquette dessine souvent
des lignes plus courtes que la vraie `line-height`, séparées par un gap. Pour que le
bloc totalise exactement `n` lignes réelles, la hauteur de bloc dépend du nombre de
lignes :

```
hauteurBloc(n) = (ligneRéelle × n − gap × (n − 1)) / n
```

Un couple constant hauteur/gap n'est juste que pour un `n` donné. Sur Notification,
le 20 avec un gap de 4 de la maquette tombe juste pour 2 lignes (44 = 2 × 22) et
dérive de 2px par ligne supplémentaire.

## Étape 4 — Écrire la variante

Reprendre les mêmes wrappers, les mêmes classes et les mêmes gaps que le
propriétaire de la mise en page, et ne remplacer que les slots de contenu par des
`<Skeleton>`. Ce qui n'est pas du contenu — conteneurs, paddings, gaps — n'est pas
recopié : il est **hérité** par les classes.

Deux simplifications sont permises parce qu'elles ne changent pas la géométrie. Un
élément inline qui est un flex item est blockifié par le moteur de rendu : un `<a>`
enveloppant peut donc devenir un `<div>`, ce qui évite une ancre morte sans `href`.
Et si cet enveloppant dimensionnait ses enfants par son contenu, lui donner
`flex-fill` pour que les largeurs en pourcentage se résolvent.

Convertir les largeurs absolues de la maquette en **relatif** : sur Notification, les
276 et 217 de la maquette sont 100% et 79% de la colonne, ce qui reste juste à une
autre largeur de conteneur alors que les pixels ne le seraient pas.

Côté accessibilité, le conteneur porte `role="status"` et `aria-busy="true"` et
contient un `<VisuallyHidden>` avec un libellé i18n. Les blocs eux-mêmes sont déjà
`aria-hidden` par la primitive : ne rien ajouter dessus, sinon le lecteur d'écran
énumère chaque rectangle. **Un seul** `role="status"` par région de chargement : si
un skeleton de liste empile des skeletons de ligne, la région appartient à la liste,
pas aux lignes.

Si le composant cible expose déjà une prop `loading`, intégrer le skeleton dedans.
Sinon livrer un composant frère `<Nom>Skeleton.tsx` à côté du composant, exporté par
le même barrel.

Les commentaires du code généré sont en anglais, comme partout dans le repo.

## Étape 5 — Générer la story de comparaison

Deux stories, pas une. La première empile le skeleton et le composant chargé, ce qui
rend visible un écart de hauteur. La seconde les **superpose** en opacité partielle,
ce qui rend visible un écart de position que l'empilement ne montre pas. Réutiliser
les mocks de `@edifice.io/config` déjà employés par les stories du composant cible.

## Étape 6 — Vérifier, et ne pas se contenter du visuel

Un skeleton n'est acceptable que si **chaque slot se superpose au pixel** au contenu
qu'il remplace. Ça se mesure, ça ne s'apprécie pas à l'œil.

D'abord un contrôle statique : vérifier que chaque classe utilisée existe vraiment
dans le CSS compilé. C'est ce qui manquait à l'ancien `NotificationSkeleton`, qui
portait `notification` et `notification-message` alors que les vraies classes sont
`notification-item` et `notification-item-message` — il n'était donc pas stylé comme
le composant qu'il remplaçait.

```bash
pnpm --filter @edifice.io/bootstrap build
grep -o "\.notification-item[a-z-]*" packages/bootstrap/dist/index.css | sort -u
```

Ensuite la mesure. Construire le Storybook, le servir, ouvrir la story de
superposition et comparer les boîtes :

```bash
pnpm docs:build
cd apps/docs/dist && python3 -m http.server 6099
```

```js
// Sur /iframe.html?id=<story-id>&viewMode=story
const [real, skel] = document.querySelectorAll('.<classe-racine>');
const box = (el) => { const r = el.getBoundingClientRect(); return { y: +r.y.toFixed(1), h: +r.height.toFixed(1) }; };
// Comparer slot par slot : deltaY et deltaH doivent valoir 0.
```

**Critère d'acceptation : `deltaY` et `deltaH` nuls sur la racine et sur chaque
slot.** Un écart non nul n'est pas un détail cosmétique, c'est le layout shift que
l'utilisateur verra. Si l'écart vient du nombre de lignes de texte, voir l'étape
suivante ; s'il vient d'autre chose, la dérivation de l'étape 3 est fausse.

Vérifier enfin que l'animation est bien coupée sous `prefers-reduced-motion`, via
`page.emulateMedia({ reducedMotion: 'reduce' })` : `animationName` doit passer à
`none`.

## Ce que la skill ne sait pas faire

Ces cas ne sont pas des imprécisions à combler par une estimation. **Il faut
s'arrêter et demander un arbitrage humain**, ou exposer une prop et le dire
explicitement dans la sortie.

Le **nombre de lignes d'un texte replié** est indécidable : il dépend d'un contenu
pas encore chargé. C'est mesuré, pas théorique — sur Notification, supposer 2 lignes
là où le mock en fait 3 décalait la ligne de 22px. La bonne réponse est une prop
`lines` avec un défaut assumé, jamais une constante silencieuse.

Les **largeurs pilotées par le contenu** — un label d'application traduit, une date
relative, un nom d'utilisateur — ne sont pas dérivables du CSS. C'est le seul endroit
où une valeur représentative est admise, et elle doit être signalée comme telle dans
la sortie.

Les **listes de longueur inconnue** ne se génèrent pas : combien de lignes afficher
pendant le chargement est une décision produit, pas une déduction. Générer le
skeleton de la ligne, et laisser le skeleton de liste à un arbitrage.

Les **layouts conditionnels** — un composant dont le JSX branche sur une prop ou un
type de données — demandent de savoir quelle branche est l'état de chargement.
S'arrêter et demander, ou générer une variante par branche si elles sont toutes
plausibles.

Les **contenus à hauteur intrinsèque** — image dont le ratio n'est connu qu'au
chargement, iframe, embed, éditeur riche — n'ont pas de hauteur dérivable. S'arrêter.

Les composants **sans SCSS propre**, qui ne s'habillent que d'utilitaires Bootstrap,
n'offrent aucune source de vérité pour les dimensions. Signaler qu'il faut d'abord
donner au composant ses propres classes, ou renoncer.

Enfin, un **fallback `<Suspense>` de module entier** est hors périmètre : ce n'est
pas la variante d'un composant mais la maquette d'une page, avec un layout et des
zones. Ça ne se déduit pas mécaniquement d'un composant.
