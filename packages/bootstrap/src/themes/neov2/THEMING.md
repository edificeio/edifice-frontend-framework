# Thème neov2

Le thème **neov2** repose sur l’API de thème (maps + mixins) définie dans `_theme-api.scss`. Les variables CSS sont générées à partir de la configuration dans `configs/_neov2.scss`.

## Structure

- **configs/_neov2.scss** : map `$theme-neov2` (couleurs, typo, layout, components).
- **overrides/** : surcharges par composant (header, buttons, container, treeview, variants).
- **_icons.scss** : couleurs des icônes (applications et connecteurs) pour le thème.
- Les overrides utilisent `[data-product="neov2"]` pour cibler le thème.

## Icônes (obligatoire pour tout nouveau thème)

Les couleurs des icônes par application et par connecteur sont définies dans un fichier dédié, **obligatoire** pour la création d’un thème :

- **Fichier de référence** : [packages/bootstrap/src/abstracts/_icons.scss](../../abstracts/_icons.scss)  
  Ce fichier centralise la liste des applications et connecteurs et leurs couleurs par thème. C’est le fichier à compléter ou à utiliser comme référence lorsque vous créez un nouveau thème.

- **Structure attendue** : pour chaque thème, une variable `$<thème>-icons` (ex. `$neov2-icons`) contenant deux maps :
  - **applications** : nom d’application → couleur (ex. `'blog': $orange`).
  - **connectors** : nom de connecteur → couleur (ex. `'absences': $red`).

- **Emplacement** : la définition peut vivre dans `abstracts/_icons.scss` (référence partagée) ou dans le dossier du thème (ex. `themes/neov2/_icons.scss`) qui exporte `$neov2-icons`. Le thème doit exposer sa variable d’icônes pour que [tokens/_icons.scss](../../tokens/_icons.scss) génère les classes `.color-app-*`, `.bg-app-*`, etc.

Sans ce fichier (ou cette variable) rempli, les icônes d’applications et de connecteurs n’auront pas de couleurs pour le thème.

## Utilisation

Sur le conteneur racine de l’app, définir `data-product="neov2"` pour activer le thème. Les variantes (sous-thèmes) utilisent `data-theme="<variant>"` (voir `overrides/_variants.scss`).

## Migration depuis neo/one

Voir `MIGRATION-STRATEGY.md` et `PROMPT-MIGRATION.md` dans ce dossier.
