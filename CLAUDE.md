# edifice-frontend-framework — monorepo de librairies front Edifice

Monorepo publiant les **packages `@edifice.io/*`** consommés par les apps Edifice (communities, actualités, blog, explorer, fronts entcore…). Ce n'est **pas** une application : pas de base path, pas de backend.

## Tooling

- **pnpm@9.12.2** **workspaces** (`pnpm-workspace.yaml`) — ne pas mélanger avec npm/yarn (`preinstall` force `only-allow pnpm`).
- Orchestration des tâches : **Turbo** (`turbo.json`).
- Build par package : **Vite** + `vite-plugin-dts` (génération des types).
- Versions partagées via le **catalog** pnpm (`catalog:` dans les `package.json`).
- Node : `>=20.19.0 <21 || >=22.12.0 <23`.

## Packages (`packages/`)

| Package | Rôle |
| --- | --- |
| `@edifice.io/react` | Composants & hooks React (sous-exports : audience, comments, editor, icons, modals, multimedia, widgets) |
| `@edifice.io/bootstrap` | Framework CSS (Bootstrap + Sass Edifice → CSS) |
| `@edifice.io/client` | Client REST TypeScript |
| `@edifice.io/rest-client-base` | Base abstraite des SDK clients Edifice (sans logique applicative) |
| `@edifice.io/tiptap-extensions` | Extensions éditeur Tiptap |
| `@edifice.io/utilities` | Utilitaires partagés |
| `@edifice.io/cli` | Outil CLI front Edifice |
| `@edifice.io/config` | Config partagée ESLint/TS/Vite — **privé**, non publié |

`apps/` : `docs` (**Storybook**, design system) et `tiptap-playground`.

## Commandes (racine)

| But | Commande |
| --- | --- |
| Build des packages | `pnpm build` <!-- turbo run build --filter=./packages/** --> |
| Tests | `pnpm test` <!-- turbo run test --filter=./packages/react --> |
| Lint | `pnpm lint` |
| Format | `pnpm format` |
| Fix lint | `pnpm fix` |
| Régénérer les icônes | `pnpm --filter @edifice.io/react generate:icons` <!-- svgr … --silent --> |
| Vérifier la synchro des icônes | `pnpm --filter @edifice.io/react icons:check` |
| Storybook (dev) | `pnpm docs` <!-- storybook dev -p 6006 --> |
| Storybook (build) | `pnpm docs:build` |

> Pre-commit (Husky) : `lint && format && test`. Cibler un package via le filtre Turbo (`--filter=./packages/<pkg>`).

## Conventions

- **Tous les commentaires dans le code doivent être écrits en anglais.**
- Scope npm **`@edifice.io/`**, packages en **kebab-case**, **versions synchronisées** entre packages.
- Publication sur le **registre npm public**. Pas de changesets : **semver manuel**.
- ESLint **flat config**, Prettier (`singleQuote: true`, `printWidth: 80`, `tabWidth: 2`, `trailingComma: all`).
- Tests : **Vitest** (unit + navigateur via **Playwright**).
- Icônes : composants générés par **SVGR** depuis `packages/react/src/modules/icons/assets/` **et commités** dans `…/components/`. La génération **ne tourne plus pendant `pnpm build`** : régénérer manuellement via `generate:icons` après avoir ajouté/modifié un `.svg`. Un garde-fou `icons:check` vérifie la synchro en pre-commit (Husky, si un SVG est staged) **et** en CI (`.github/workflows/icons-check.yml`, sur PR).

## À faire / à éviter

- ✅ **Avant tout push, lancer et valider impérativement** : linters (`pnpm lint`), formatters (`pnpm format`) et tests (`pnpm test`).
- ✅ Modifier le bon package et **builder via Turbo** (respecter le graphe de dépendances).
- ✅ Documenter les composants dans **Storybook** (`*.stories.tsx`).
- ✅ Penser **API publique** : un changement de signature impacte toutes les apps consommatrices.
- ❌ Ne pas créer de dépendances croisées non déclarées entre packages.
- ❌ Ne pas publier à la main hors du process de release.
- ❌ Ne pas figer une version en dur quand le **catalog** pnpm la fournit (`catalog:`).

## CI

GitHub Actions (`.github/workflows/`) : `chromatic.yml` (régression visuelle Chromatic) et `deploy-storybook.yml` (déploiement Storybook sur GitHub Pages).
