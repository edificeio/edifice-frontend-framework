# Thème edifice2d

Le thème **edifice2d** repose sur l'API de thème (maps + mixins) définie dans `_theme-api.scss`. Les variables CSS sont générées à partir de la configuration dans `configs/_edifice2d.scss`.

## Structure

- **configs/\_primitives.scss** : valeurs de base du design system (couleurs, dimensions, spacers, radius).
- **configs/\_edifice2d.scss** : map `$edifice2d` (color, font, radius).
- **overrides/** : surcharges par composant (container, variants ou composants à rajouter).
- **\_icons.scss** : couleurs des icônes (applications et connecteurs) pour le thème.
- Les overrides utilisent `[data-product="edifice2d"]` pour cibler le thème.

## Utilisation

Sur le conteneur racine de l'app, définir `data-product="edifice2d"` pour activer le thème. Les variantes (sous-thèmes) utilisent `data-theme="<variant>"` (voir `overrides/_variants.scss`).

## Skins

Les skins sont des choix d'affichage de l'utilisateur (ex. police « Dyslexique »), indépendants du thème. `EdificeThemeProvider` pose `data-skin` sur `<html>`.

- **configs/\_skins.scss** : une map partielle par skin (`$skin-dyslexic`), de même forme que les configs de thème. Seules les clés fournies sont surchargées. `$skin-products` liste les produits concernés.
- **\_skins.scss** (dossier `themes/`) : appelle `theme.theme-skin('<skin>', $config, $skin-products)`.
- Le mixin `theme-skin` (`_theme-api.scss`) génère les variables sous `[data-skin][data-product]` et `[data-skin] [data-product]`. `data-product` peut ainsi être sur `<html>` ou sur un descendant (ex. `<body>` de la homepage).
- Les composants n'ont rien à faire : il suffit qu'ils utilisent les variables sémantiques (`--font-family-title`, `--font-family-body`, `--font-button-family`, `--font-button-tertiary-family`…) et jamais une police en dur ni une primitive.

Ajouter un skin : créer sa map dans `configs/_skins.scss`, puis l'inclure dans `themes/_skins.scss`.

Les skins legacy (`[data-product='neo'][data-skin='dyslexic']`, variables `--bs-*`, fonds d'écran 1D) restent dans `themes/_skins.scss` pour les apps legacy.

## Migration depuis neo/one

Voir `MIGRATION-STRATEGY.md` dans ce dossier.
