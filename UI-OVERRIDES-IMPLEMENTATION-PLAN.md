# Implémentation des `uiOverrides` (theme-conf) — Header v2 pour `Layout`

## Contexte

Le ticket ENABLING-1117 (`UI-OVERRIDES-PLAN.md` à la racine du repo) décrit un mécanisme permettant à une plateforme (via son `theme-conf.js`) d'activer des variantes de composants — en premier lieu le nouveau Header — **sans `if CRNA` dans le code**, sans nouvelle API publique côté apps. Objectif immédiat : permettre à Intégration d'activer le nouveau Header sur CRNA pour la rentrée, en attendant la généralisation portée par IMPULSION en fin d'année.

L'exploration du code a confirmé/précisé plusieurs points par rapport au plan original, validés avec l'utilisateur :

1. **Le "Header v2" existe déjà** : c'est `packages/react/src/modules/homepage/components/Header/Header.tsx`. Il est déjà découplé de toute logique homepage-spécifique (hooks génériques `useConversation`/`useUser`/`useHasWorkflow`/`useHover`) et déjà utilisé en dehors de la homepage par `PageLayout.Header` (`components/PageLayout/components/PageLayoutHeader.tsx:5,24-27`). **On réutilise ce composant tel quel**, on n'en crée pas un nouveau.
2. **Pas de sujet FlashMessagesHistory dans ce ticket** — la variante "historique Flash" du panneau notifications (plan §6, second exemple) reste un arbitrage produit non tranché, hors scope.
3. **Vérification en recette CRNA** (theming scopé, cas accès public WB2-2660) : différée, pas bloquante pour l'implémentation.
4. **Le vrai sujet du point "notifications" n'est pas un compound component, c'est un panneau manquant.** Le Header v2 a été conçu pour vivre dans `PageLayout`, qui lui offre la mécanique permettant d'afficher un panneau de notifications au clic sur la cloche (`useOverlay` + `PageLayout.Overlay`). En sortant ce Header vers `Layout` (legacy), on perd cette mécanique — `Layout` n'a pas d'équivalent. Il faut la reproduire, **a minima et sans toucher au code existant qui fonctionne** (fenêtre de MEP courte, pas de marge pour des retours QA). L'idée de restructurer `Header` en compound component (`withUiOverride`, `Header.Notifications`) est **abandonnée** : elle ajoutait un risque de régression sur un composant existant sans nécessité — voir section C.

Scope de ce ticket, en deux phases séquentielles :
- **Phase 1 — mécanisme de base** : PR `@edifice.io/client` (types + passthrough de conf) et PR `@edifice.io/react` (hook `useUiOverride` + switch dans `Layout` vers le Header existant, avec theming scopé).
- **Phase 2 — panneau Notifications fonctionnel sur `Layout`** : réutilisation à l'identique de briques déjà existantes et déjà découplées (`useOverlay`, `PageLayoutOverlay`, `NotificationListContainer`), assemblées dans un unique nouveau fichier colocalisé avec `Layout`. **Aucune modification de `Header.tsx`, `PageLayout.tsx` ou du module Notifications.**

## A. Phase 1 — `@edifice.io/client` : types + passthrough

**`packages/client/src/ts/configure/interfaces.ts`**

- Ajouter, à côté des autres exports du fichier :
  ```ts
  export type UiOverride = string | { variant: string; theme?: string };
  ```
- Étendre `IThemeConfOverriding` (ligne ~180-193) :
  ```ts
  export interface IThemeConfOverriding {
    // … champs existants (parent, child, bootstrapVersion, skins, help, group?, edumedia) …
    uiOverrides?: Record<string, UiOverride>;
  }
  ```
- Étendre `IOdeTheme` (ligne ~235-246) — **c'est cette interface, pas `IThemeConfOverriding`, qui est réellement consommée côté React** via `useEdificeTheme()` :
  ```ts
  export interface IOdeTheme {
    // … champs existants …
    uiOverrides?: Record<string, UiOverride>;
  }
  ```

**`packages/client/src/ts/configure/Service.ts`**

Dans la méthode privée `getTheme()` (ligne ~115-169), le `themeOverride` est déjà résolu (ligne 130, `conf?.overriding?.find(...)`, typé `any` donc le passthrough ne casse rien côté compilation même avant l'étape A). Ajouter un champ au `return` final (ligne ~157-168) :
```ts
return {
  // … champs existants …
  uiOverrides: themeOverride?.uiOverrides,
};
```

Pas de nouveau test unitaire pour `ConfService` : aucun test n'existe aujourd'hui pour cette classe (seul `transport/Service.spec.ts` existe, pour une autre classe), le changement est un passthrough additif d'une ligne. Couverture assurée par le typecheck + les tests du hook React (section D) + la vérification manuelle en recette (déjà actée comme différée).

## B. Phase 1 — `@edifice.io/react` : hook + switch dans `Layout`

**Nouveau hook `packages/react/src/hooks/useUiOverride/useUiOverride.ts`** (+ `index.ts`), suivant le pattern exact de `useZendeskGuide` (export par défaut dans le fichier d'implémentation, réexport nommé via `index.ts`) :
```ts
// useUiOverride.ts
import { useEdificeTheme } from '../../providers/EdificeThemeProvider/EdificeThemeProvider.hook';

export default function useUiOverride(key: string) {
  const { theme } = useEdificeTheme();
  const raw = theme?.uiOverrides?.[key];
  return typeof raw === 'string' ? { variant: raw } : raw;
}
```
```ts
// index.ts
export { default as useUiOverride } from './useUiOverride';
```
Ajouter `export * from './useUiOverride';` dans `hooks/index.ts` (ordre alphabétique).

**`packages/react/src/modules/homepage/components/Header/Header.tsx`** — ajout additif d'une prop optionnelle pour le theming scopé (§3/§6 du plan : poser `data-product` sur la racine du sous-arbre). Attention : le nom `theme` est déjà pris par `useEdificeTheme()` (ligne 57) → nommer la prop différemment :
```ts
export interface HeaderProps {
  src: string | undefined;
  onNotificationsClick?: () => void;
  dataProduct?: string;
}

const Header = ({ src = '', onNotificationsClick, dataProduct }: HeaderProps) => {
  // … inchangé …
  return (
    <header className={classes} data-product={dataProduct}>
      {/* … inchangé … */}
```
Quand `dataProduct` est `undefined` (cas `PageLayoutHeader`, qui ne passera pas cette prop), React n'émet pas l'attribut → comportement actuel préservé, le sous-arbre hérite du `data-product` ambiant.

**`packages/react/src/components/Layout/Layout.tsx`** — switch lazy :
```tsx
import { lazy, Suspense, /* … */ } from 'react';
// …
const HeaderV2 = lazy(() => import('../../modules/homepage/components/Header/Header'));
// …
export const Layout = ({ children, headless = false, whiteBg = true, className, ...restProps }: LayoutProps) => {
  const { theme } = useEdificeTheme();
  const override = useUiOverride('layout.header');
  // …
  const renderHeader = !headless ? (
    override?.variant === 'v2' ? (
      <Suspense fallback={null}>
        <HeaderV2 src={theme?.basePath} dataProduct={override?.theme} />
      </Suspense>
    ) : (
      <Header is1d={theme?.is1d} src={theme?.basePath} />
    )
  ) : null;
  // … reste inchangé
```
`lazy()` limite l'impact bundle pour les apps qui n'activent pas l'override (le Header v2 embarque des composants `*Beta` distincts). Précédent existant pour `lazy()` dans le package : `modules/comments/components/Comment.tsx`.

## C. Phase 2 — panneau Notifications fonctionnel sur `Layout`

À faire **après** la Phase 1. Constat vérifié dans le code (rien n'est câblé nulle part aujourd'hui, ni pour `PageLayout` ni ailleurs — pas de story, pas de doc, pas d'app dans ce repo qui connecte les trois) : les briques nécessaires existent déjà, **indépendamment de `PageLayout`**, et n'ont besoin d'aucune modification :

- `useOverlay()` (`packages/react/src/components/PageLayout/hook/useOverlay.ts`) : simple store Zustand global (`overlayOpen: boolean`, `updateOverlayOpen`, `toggleOverlay`), déjà exporté publiquement depuis le barrel `components`. **Aucune dépendance à `PageLayoutContext`.**
- `PageLayoutOverlay` (`packages/react/src/components/PageLayout/components/PageLayoutOverlay.tsx`) : un simple `<aside>` piloté par ce même `useOverlay()`, sans dépendance à `PageLayoutContext` non plus (juste des classes CSS + `inert`).
- `NotificationListContainer` (`packages/react/src/modules/homepage/components/Notifications/NotificationListContainer.tsx`) : entièrement autonome, une seule prop (`onCloseNotifications?`), dépend uniquement de TanStack Query + `odeServices` (déjà montés à la racine de toute app React) — **aucune dépendance à `PageLayout`**.

→ Ces trois briques sont *composables* sans que `Layout` ait besoin d'adopter la structure compound de `PageLayout`. On les assemble dans **un seul nouveau fichier**, sans toucher à `Header.tsx`, `PageLayout.tsx`, ni au module Notifications.

**Nouveau fichier `packages/react/src/components/Layout/components/HeaderNotificationsOverlay.tsx`** :
```tsx
import PageLayoutOverlay from '../../PageLayout/components/PageLayoutOverlay';
import { NotificationListContainer } from '../../../modules/homepage/components/Notifications/NotificationListContainer';
import { useOverlay } from '../../PageLayout/hook/useOverlay';

const HeaderNotificationsOverlay = () => {
  const { isOverlayOpen, updateOverlayOpen } = useOverlay();
  const handleClose = () => updateOverlayOpen(false);

  return (
    <PageLayoutOverlay onClose={handleClose}>
      {/* monté seulement à l'ouverture : pas de fetch tant que le panneau n'a jamais été ouvert */}
      {isOverlayOpen && (
        <NotificationListContainer onCloseNotifications={handleClose} />
      )}
    </PageLayoutOverlay>
  );
};

HeaderNotificationsOverlay.displayName = 'Layout.HeaderNotificationsOverlay';

export default HeaderNotificationsOverlay;
```

**`packages/react/src/components/Layout/Layout.tsx`** — deux ajouts, dans le prolongement du switch déjà posé en Phase 1 :
```tsx
import { Alert, Button, useOverlay } from '..'; // useOverlay ajouté à l'import existant
import HeaderNotificationsOverlay from './components/HeaderNotificationsOverlay';
// …
export const Layout = ({ children, headless = false, ... }: LayoutProps) => {
  const { theme } = useEdificeTheme();
  const override = useUiOverride('layout.header');
  const { toggleOverlay } = useOverlay();
  const isHeaderV2 = override?.variant === 'v2';
  // …
  const renderHeader = !headless ? (
    isHeaderV2 ? (
      <Suspense fallback={null}>
        <HeaderV2
          src={theme?.basePath}
          dataProduct={override?.theme}
          onNotificationsClick={toggleOverlay}
        />
      </Suspense>
    ) : (
      <Header is1d={theme?.is1d} src={theme?.basePath} />
    )
  ) : null;

  const renderNotificationsOverlay = !headless && isHeaderV2 && (
    <HeaderNotificationsOverlay />
  );

  return (
    <>
      {renderHeader}
      {renderNotificationsOverlay}
      <main className={classes} {...restProps}>{children}</main>
      {/* … reste inchangé … */}
```

**Zéro impact pour les apps qui n'activent pas l'override** : `isHeaderV2` reste `false`, donc ni l'overlay ni `NotificationListContainer` ne sont montés — le seul changement de comportement possible est pour l'app qui active `layout.header: v2` (aujourd'hui : CRNA, opt-in explicite).

**Filet de sécurité explicite** : `NotificationListContainer` suppose un `QueryClientProvider` déjà monté (vrai pour toute app React moderne, cf. CLAUDE.md — pas de vérification supplémentaire à coder, ce serait de la défense contre un cas qui ne devrait pas arriver). Si la recette CRNA (point 3) révèle un problème bloquant sur ce panneau, le point de repli le plus simple est de ne pas passer `onNotificationsClick`/de ne pas monter `HeaderNotificationsOverlay` — la cloche du Header reste alors visuellement présente mais inactive, sans aucune régression sur l'existant. Pas de code défensif à écrire pour ce cas tant qu'il ne s'est pas produit.

## D. Tests

**Phase 1** — nouveau fichier `packages/react/src/hooks/useUiOverride/useUiOverride.spec.tsx`, suivant la convention établie (mémoire `project_react_hooks_test_pattern`) :
- `renderHook` depuis `~/setup`, avec `{ wrapper }` (le hook lit un contexte).
- Mocker `@edifice.io/client` (`vi.hoisted` + `vi.mock('@edifice.io/client', ...)`) pour contrôler `odeServices.conf().getConf(...)` → `theme.uiOverrides`.
- Cas à couvrir : clé absente → `undefined` ; valeur `string` → `{ variant: string }` ; valeur objet `{ variant, theme }` → passthrough identique.

Pas de nouveau test pour `Layout`/`Header` en Phase 1 (aucun fichier de spec n'existe aujourd'hui pour ces composants, et on ne touche pas à `Header.tsx`) — la vérification du switch visuel est différée en recette (point 3 acté).

**Phase 2** — nouveau fichier `packages/react/src/components/Layout/components/HeaderNotificationsOverlay.spec.tsx` :
- `isOverlayOpen: false` (store mocké) → `NotificationListContainer` n'est pas monté (pas de requête déclenchée).
- `isOverlayOpen: true` → `NotificationListContainer` est monté et rendu.
- Clic sur le bouton de fermeture (`PageLayoutOverlay`) ou `onCloseNotifications` → `updateOverlayOpen(false)` appelé.

Pas de nouveau test pour `Header.tsx`, `PageLayoutOverlay` ni `NotificationListContainer` : ces composants ne sont pas modifiés, leur couverture existante (le cas échéant) reste valable telle quelle.

## Hors scope de ce ticket (explicitement acté avec l'utilisateur)

- La variante "historique Flash" du panneau notifications (`with-flash-history`, plan §6) — arbitrage produit non tranché.
- Toute restructuration de `Header.tsx` en compound component (`withUiOverride`, `Header.Notifications`) — écartée, cf. point 4 du Contexte.
- Modification du `theme-conf.js` springboard CRNA — côté Intégration, hors de ce repo.
- Vérification manuelle du theming scopé sur une vieille app CRNA (plan §10, étape 6) — différée en recette.

## Vérification

1. `pnpm lint` et `pnpm format` à la racine (pré-commit Husky : lint + format + test).
2. `pnpm test --filter=./packages/react` (specs `useUiOverride` et `HeaderNotificationsOverlay`, suite existante non cassée).
3. `pnpm build --filter=./packages/client` puis `--filter=./packages/react` (le build doit passer avec les nouveaux champs de types ; l'ordre respecte le graphe de dépendances Turbo).
4. Test manuel en recette différé (point acté avec l'utilisateur) : activer `uiOverrides: { 'layout.header': { variant: 'v2', theme: 'crna' } }` dans un `theme-conf.js` de test et vérifier (a) le rendu du Header v2 scopé et (b) l'ouverture/fermeture fonctionnelle du panneau de notifications, dans une app encore sur `Layout`.
