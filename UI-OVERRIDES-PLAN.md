# Plan — Overrides de composants pilotés par le theme-conf

> Objectif : permettre à Intégration d'activer le nouveau Header (et d'autres variantes de composants) **par plateforme**, sans `if CRNA` dans le code, sans modification de controllers, sans nouvelle API publique sur les composants.
> Principe directeur : **on active par capacité, jamais par identité client** — et le theme-conf de la plateforme est la source unique de vérité.

---

## 1. Contexte

- La généralisation du nouveau Header sur les anciennes apps React est **en roadmap IMPULSION (fin d'année)**, mais Intégration doit livrer CRNA **pour la rentrée** → conflit de **timing**, pas de divergence produit.
- CRNA consomme **les mêmes versions npm publiques** `@edifice.io/*` que tout le monde → tout code Intégration finit dans `develop` et sur le registre public.
- Un `if crna` dans `Layout` est refusé : non scalable, non maintenable, nom de client dans un repo public.
- Le pattern va se reproduire avec d'autres clients → il faut un mécanisme pérenne.

## 2. Constat technique (vérifié dans le code)

- Chaque plateforme sert un asset statique **`/assets/theme-conf.js`** (source : le springboard de la plateforme). Vérifié en prod CRNA : `https://mon.lyceeconnecte.fr/assets/theme-conf.js` (entrée `child: "na"`).
- `@edifice.io/client` le charge via `odeServices.conf().getConf(appCode)` (`configure/Service.ts` → `getThemeConf()`), et construit `IOdeTheme` exposé par `EdificeThemeProvider` / `useEdificeTheme()` — **déjà monté à la racine de toutes les apps React** (dont `timeline/frontend` et `timeline/frontend-crna`).
- **L'entrée `overriding` est résolue par utilisateur, pas par plateforme** : `getTheme()` fait `conf.overriding.find(e => e.child === theme.themeName)` où `/theme` reflète la préférence/le degré de l'utilisateur. Une plateforme mixte a deux entrées (1D + 2D), la préférence tranche ; une plateforme mono-degré n'en a qu'une. → le cas « 1D/2D paramétré par l'utilisateur » est déjà géré, tout champ ajouté à l'entrée en hérite gratuitement.
- Le conf prod CRNA contient déjà un champ ad-hoc hors typage (`legacyVersion: "na"`) → étendre une entrée est une pratique établie et sans risque.
- Précédent historique : le système d'overrides de templates par skin d'entcore (`Theme.templateOverrides`). Ce plan en est le successeur React.
- `data-product` est aujourd'hui posé à **deux endroits** : dynamiquement sur `<html>` par `EdificeThemeProvider` (dérivé du dernier segment de `bootstrapVersion` → `"neo"` sur CRNA prod), et **forcé en dur** sur `<body>` dans `timeline/frontend/homepage.html` (`edifice2d`) et `timeline/frontend-crna/homepage-crna.html` (`crna`). Fragile → à unifier via la conf.

## 3. La mécanique de theming existante (package bootstrap)

Tout ce dont on a besoin côté CSS existe déjà dans `packages/bootstrap/src/themes/` :

| Attribut DOM | Rôle | Source (conf) | Exemples |
| --- | --- | --- | --- |
| `data-product` | **Le thème** (scope de variables CSS émis par `theme-vars()`) | `bootstrapVersion` (dernier segment) | `neo`, `one`, `edifice1d`, `edifice2d`, `crna` |
| `data-theme` | **La variation / le sous-thème** au sein d'un thème | `npmTheme ?? themeName` | `na`, `cg77`, `monlycee` |
| `data-skin` | Le skin choisi par l'utilisateur | `skinName` | `default`, `dyslexic`, `desert`… |

Faits structurants (`_theme-api.scss`) :

- **Tous les thèmes sont égaux** : `edifice2d`, `edifice1d` et `crna` sont déclarés à l'identique (`theme-vars('<name>', $config)` → variables sous `[data-product='<name>']`). Il n'y a pas de différence de nature entre un thème produit et un thème client — `neo` et `one` sont des portages transitoires des anciens thèmes, voués à disparaître.
- **Les sous-thèmes existent** : `theme-variant($product, $variant, $config)` → `[data-product='X'][data-theme='Y']`. Pas encore utilisé (exemples commentés dans les `_variants.scss`), mais le contrat est prêt.
- **La variation client par `data-theme` est déjà pratiquée** sur les anciens thèmes : `_overrides.scss` contient `[data-product='neo'][data-theme='na']` (branding CRNA actuel), `[data-theme='cg77']`, `[data-theme='monlycee']`…
- **Un thème se scope spatialement** : un thème n'étant qu'un scope de custom properties, poser `data-product="crna"` sur la racine d'un sous-arbre applique le thème à ce sous-arbre seulement (les variables cascadent), pendant que le reste de la page reste résolu par le `data-product` du `<html>`. C'est ce que font déjà — en dur — les `<body data-product>` des templates timeline.

→ Conséquence : **aucun nouvel attribut ni champ de conf n'est nécessaire pour le CSS.** Le besoin « header stylisé `crna` dans une app stylisée `neo` » = du theming scopé par sous-arbre, piloté par la conf (§4/§6).

## 4. Exemple de conf finale (entrée CRNA dans `theme-conf.js`)

```js
exports.conf = {
  overriding: [
    {
      parent: 'theme-open-ent',
      child: 'na',
      skins: ['default', 'dyslexic'],
      bootstrapVersion: 'ode-bootstrap-neo', // inchangé : l'app reste en neo (+ branding [data-theme='na'] existant)
      help: '/help-2d',
      edumedia: { /* … */ },

      // NOUVEAU — variantes de composants activées sur cette plateforme.
      // Clés = capacités définies par le framework. Valeurs = variantes PRODUIT
      // (string), ou objet enrichi si le sous-arbre doit porter un thème scopé.
      // Aucun nom de client dans le code : la "crna-itude" ne vit qu'ici.
      uiOverrides: {
        'layout.header': { variant: 'v2', theme: 'crna' },
        'notifications.panel': 'with-flash-history',
      },
    },
    // Plateforme mixte : une 2e entrée (parent: 'panda', …) sélectionnée par la
    // préférence utilisateur — chaque entrée peut avoir ses propres uiOverrides.
  ],
};
```

## 5. Changements par brique

### `@edifice.io/client` (PR 1 — additive, pas de breaking change)

```ts
// interfaces.ts
export type UiOverride = string | { variant: string; theme?: string };

export interface IThemeConfOverriding {
  // … champs existants …
  uiOverrides?: Record<string, UiOverride>;
}
```

```ts
// Service.ts — getTheme() fait déjà le lookup de l'entrée courante (par utilisateur)
return {
  // … champs existants …
  uiOverrides: themeOverride?.uiOverrides,
};
```

### `@edifice.io/react` (PR 2)

Hook de confort qui normalise la valeur :

```ts
export function useUiOverride(key: string) {
  const { theme } = useEdificeTheme();
  const raw = theme?.uiOverrides?.[key];
  return typeof raw === 'string' ? { variant: raw } : raw; // { variant, theme? } | undefined
}
```

### Springboard CRNA (Intégration)

Une ligne dans `assets/theme-conf.js` de la plateforme. Activation/rollback = édition d'un asset, sans release ni redéploiement d'apps.

## 6. Usage dans les composants (illustratif)

### `Layout` — switch interne, API publique inchangée

```tsx
const HeaderV2 = lazy(() => import('./components/HeaderV2'));

export const Layout = ({ children, headless = false, ...props }: LayoutProps) => {
  const { theme } = useEdificeTheme();
  const override = useUiOverride('layout.header');

  const renderHeader = !headless ? (
    override?.variant === 'v2' ? (
      <Suspense fallback={null}>
        <HeaderV2 />
      </Suspense>
    ) : (
      <Header is1d={theme?.is1d} src={theme?.basePath} />
    )
  ) : null;

  return (
    <>
      {renderHeader}
      <main>{children}</main>
    </>
  );
};
```

### Thème scopé au sous-arbre — le header en `crna` dans une app en `neo`

```tsx
export const HeaderV2 = () => {
  const override = useUiOverride('layout.header');

  return (
    // Si la conf fournit un thème, le sous-arbre le porte ; sinon il hérite
    // du data-product de la page. Valeur issue de la conf, jamais en dur.
    <header data-product={override?.theme}>
      {/* … */}
    </header>
  );
};
```

### `Notifications` — même mécanisme pour l'historique Flash

```tsx
export const NotificationsPanel = () => {
  const override = useUiOverride('notifications.panel');

  return (
    <Panel>
      <NotificationsList />
      {override?.variant === 'with-flash-history' && <FlashMessagesHistory />}
    </Panel>
  );
};
```

> ⚠️ Prérequis : `FlashMessagesHistory` doit être du **code produit** (PR reviewée dans `packages/react`). Si le produit refuse la feature, l'override ne peut rien — il faudra un vrai slot + code externe. → arbitrage produit à lancer.

## 7. Overrides complets ou partiels via compound components

Le switch de variante (§6) remplace un composant **en entier**. Pour les besoins plus fins — remplacer *une partie* d'un composant sans dupliquer le reste — la mécanique **compound** s'articule naturellement avec `uiOverrides` :

### Principe

Un composant compound expose ses sous-parties ; chaque sous-partie peut résoudre sa propre clé d'override. La granularité des clés suit la structure compound :

```js
uiOverrides: {
  'layout.header': { variant: 'v2', theme: 'crna' },   // override COMPLET : tout le Header
  'header.notifications': 'with-flash-history',        // override PARTIEL : seulement la cloche
}
```

Convention de résolution : **la clé la plus fine gagne** (une variante partielle s'applique à l'intérieur de la variante complète active).

### Illustration

```tsx
// Assemblage compound par défaut (interne au framework)
export const HeaderV2 = () => (
  <HeaderV2.Root>
    <HeaderV2.Logo />
    <HeaderV2.Search />
    <HeaderV2.Notifications />   {/* résout sa propre clé */}
    <HeaderV2.UserMenu />
  </HeaderV2.Root>
);

// Helper générique : une sous-partie déclare ses variantes produit
HeaderV2.Notifications = withUiOverride('header.notifications', {
  default: NotificationsBell,
  'with-flash-history': NotificationsBellWithFlash,
});
```

```tsx
// Le helper (illustratif)
export function withUiOverride(
  key: string,
  variants: Record<string, ComponentType>,
) {
  return function Overridable(props) {
    const override = useUiOverride(key);
    const Component = variants[override?.variant ?? 'default'] ?? variants.default;
    return <Component {...props} />;
  };
}
```

Bénéfice : `NotificationsBellWithFlash` peut lui-même réutiliser les sous-parties par défaut et ne réécrire que ce qui change — pas de fork du composant entier.

### Quand rendre un composant compound ?

- **Pas d'anticipation systématique** (YAGNI) : on découpe en compound quand un besoin réel d'override partiel se présente. Le refactoring est non-breaking tant que l'export par défaut garde la même API.
- Les nouveaux composants structurants (Header v2, panneau Notifications) ont vocation à naître compound — c'est le bon moment puisqu'ils sont en cours de développement.
- Chaque sous-partie overridable = une clé documentée, même gouvernance qu'au §8 (créée par l'équipe framework, variantes produit uniquement, durée de vie déclarée).

## 8. Garde-fous

- **Seule l'équipe framework crée des clés d'override** ; une clé ne référence que du code produit (roadmap ou généralisé) présent dans le package.
- Chaque clé a une **durée de vie déclarée** : `layout.header` meurt quand le Header v2 devient le défaut. C'est un mécanisme de **transition/rollout**, pas de customisation permanente.
- Les variantes ont leurs **stories Storybook** (→ Chromatic).
- Frontière visuel/comportement : le **CSS** client passe par les thèmes bootstrap (`data-product`/`data-theme`, y compris scopés à un sous-arbre), le **comportement** passe par les variantes produit + `uiOverrides`. Jamais de nom de client dans le TS/TSX.
- (Plus tard) lint CI : grep des noms de clients dans le code TS/TSX du framework.

## 9. Points de vigilance

- **Theming scopé et sélecteurs descendants** : les variables cascadent proprement dans le sous-arbre, mais les règles du type `[data-product='crna'] .xxx { … }` matchent aussi tous les descendants du scope. Les overrides « composant » d'un thème destiné au scoping (dossier `crna/overrides/`) doivent rester ciblés — c'est déjà leur style d'écriture, à maintenir.
- **Modélisation du thème `crna` à terme** (équipe bootstrap, non urgent) : quand CRNA migrera sur le nouveau DS, garder `crna` en thème complet, ou le redéclarer en **sous-thème** d'`edifice2d` via `theme-variant('edifice2d', 'crna', …)` (partage des tokens, seules les couleurs surchargées, sélecteur `[data-product='edifice2d'][data-theme='crna']`). Les deux sont supportés par l'API telle quelle.
- **Accès public** : `getTheme()` a un cas particulier (fix WB2-2660) qui force le thème neo hors connexion → vérifier le comportement attendu des overrides sur les pages publiques.
- **Déploiement** : les apps doivent monter sur une version du FF contenant le mécanisme (simple bump de dépendance, pas de modif de code app).
- **Nettoyage (dette)** : supprimer à terme les `<body data-product>` en dur dans `homepage.html` / `homepage-crna.html` — le theming scopé piloté par la conf les remplace.
- **`develop-integration`** (FF et entcore) : mêmes versions npm ⇒ ces branches doivent converger ; le travail de découplage du Header (panneau Notifications notamment) se fait en PRs sur `develop`, sous review framework/IMPULSION.

## 10. Plan d'action

1. [ ] PR `@edifice.io/client` : type `UiOverride` + champ `uiOverrides` (types + passthrough `getTheme()`).
2. [ ] PR `@edifice.io/react` : hook `useUiOverride` (+ helper `withUiOverride`) + switch lazy dans `Layout` + thème scopé sur la racine de `HeaderV2`.
3. [ ] Chantier Intégration (PRs produit sur `develop`, sous review) : découpler `HeaderV2` de la homepage (panneau Notifications accessible partout), en le faisant naître **compound** (§7).
4. [ ] Intégration : `uiOverrides` dans le theme-conf du springboard CRNA ; CRNA = première plateforme opt-in.
5. [ ] Arbitrage produit : historique des messages Flash (variante produit vs refus → slot).
6. [ ] Vérifier le rendu du theming scopé (header `crna` / app `neo`) sur 1–2 vieilles apps CRNA, y compris le cas accès public (WB2-2660).
7. [ ] Fin d'année : IMPULSION réutilise le même mécanisme pour son rollout progressif ; bascule du défaut, mort de la clé `layout.header` ; décision thème complet vs sous-thème pour `crna` sur le nouveau DS.
