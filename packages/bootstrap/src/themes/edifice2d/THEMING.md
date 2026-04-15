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

## Migration depuis neo/one

Voir `MIGRATION-STRATEGY.md` dans ce dossier.
