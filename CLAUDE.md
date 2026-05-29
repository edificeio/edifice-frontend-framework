# CLAUDE.md

Ce fichier fournit des indications à Claude Code (claude.ai/code) pour travailler dans ce dépôt.

## Commandes

```bash
pnpm install              # Installe toutes les dépendances (pnpm uniquement — imposé)
pnpm run build            # Build tous les packages via Turbo
pnpm run docs             # Lance le serveur Storybook (port 6006)
pnpm run docs:build       # Build le site Storybook statique
pnpm run lint             # ESLint sur tous les packages
pnpm run fix              # ESLint avec correction automatique
pnpm run format           # Vérification + écriture Prettier
pnpm run test             # Lance les tests du package React (Vitest)
pnpm run test:client      # Lance les tests du package client
```

**Lancer un seul fichier de test :**
```bash
cd packages/react && pnpm vitest run src/path/to/component.spec.tsx
```

**Builder un seul package :**
```bash
pnpm --filter @edifice.io/react build
```

**Les icônes doivent être buildées avant le package React** (géré automatiquement par le script `build`) :
```bash
pnpm --filter @edifice.io/react build:icons   # génère les composants SVG via SVGR
```

## Architecture

Monorepo **pnpm + Turbo** (Node 20/22 requis).

### Packages

| Package | Nom | Rôle |
|---|---|---|
| `packages/react` | `@edifice.io/react` | Bibliothèque de composants React principale |
| `packages/client` | `@edifice.io/client` | Client HTTP (Axios, class-validator) |
| `packages/bootstrap` | `@edifice.io/bootstrap` | Framework CSS basé sur Bootstrap 5.3.8 SCSS |
| `packages/utilities` | `@edifice.io/utilities` | Fonctions utilitaires TypeScript partagées |
| `packages/extensions` | `@edifice.io/tiptap-extensions` | Extensions Tiptap personnalisées |
| `packages/config` | `@edifice.io/config` | Config frontend partagée (handlers MSW, thèmes) |
| `apps/docs` | — | Site de documentation Storybook |

### Structure du package React (`packages/react/src/`)

```
components/       60+ composants UI primitifs (Button, Modal, Input, etc.)
modules/
  audience/       Fonctionnalités de ciblage d'audience
  comments/       Système de commentaires
  editor/         Éditeur de texte riche (intégration Tiptap)
  homepage/       Composants spécifiques à la page d'accueil
  icons/          Composants SVG (auto-générés via SVGR depuis assets/)
  modals/         Bibliothèque de modales
  multimedia/     Gestion des médias (image, vidéo, PDF)
  widgets/        Composants widgets
hooks/            50+ hooks React personnalisés
providers/        Providers de contexte (EdificeThemeProvider, EdificeClientProvider, AntThemeProvider, MockedProvider)
utilities/        Helpers React (react-query, mime-types, styling)
types/            Définitions de types TypeScript
```

### Points d'entrée multiples

Le package React publie **10 points d'entrée distincts** pour permettre le tree-shaking :
- `@edifice.io/react` — principal (composants, hooks, providers)
- `@edifice.io/react/audience`, `/comments`, `/editor`, `/homepage`
- `@edifice.io/react/modals`, `/multimedia`, `/widgets`
- `@edifice.io/react/icons`, `/icons/nav`, `/icons/apps`, `/icons/audience`

### Tests

- Framework : Vitest avec environnement jsdom
- Fichiers de test : `src/**/*.spec.tsx`
- Fichier de setup : `packages/react/vitest.setup.ts`
- MSW est utilisé pour le mock d'API dans les tests et dans Storybook

### Storybook

Les stories sont réparties dans deux endroits :
- `packages/react/src/**/*.stories.tsx` — stories au plus proche des composants
- `apps/docs/src/stories/` — stories de documentation additionnelles

Storybook supporte 5 thèmes : `one`, `neo`, `edifice2d`, `edifice1d`, `side-by-side`.

## Conventions

### Git & Branches

- **Branche de base pour les PRs : `develop`** — ne jamais pousser sur `main` (réservé aux releases/publication npm)
- Rebaser sur `develop` avant de commencer tout développement

### Messages de commit (Conventional Commits)

```
feat(react): add new component
fix(icons): rename incorrect icon
chore(deps): update eslint config
```

Toujours indiquer le package/scope concerné entre parenthèses.

### Versionnage (Semantic Versioning)

- `patch` — refactoring ou correction non cassante
- `minor` — nouvelle fonctionnalité non cassante
- `major` — changement cassant

### Versions des dépendances

Toutes les versions partagées sont centralisées dans `pnpm-workspace.yaml` sous la clé `catalog:`. Utiliser `catalog:` dans les `package.json` individuels plutôt que de spécifier les versions directement.
