# Stratégie de migration vers edifice2d

- **Objectif** : migrer progressivement vers le thème edifice2d (API map + overrides par composant) sans tout réécrire d'un coup.
- **Conserver** : les thèmes `one` et `neo` tels quels ; edifice2d coexiste.
- **Étapes** :
  1. Activer edifice2d côté app (`data-product="edifice2d"`).
  2. Ajuster les overrides dans `themes/edifice2d/overrides/` par composant.
  3. Utiliser les variables CSS `--edifice-*` issues de la config pour les personnalisations.
- **Primitives** : `configs/_primitives.scss` contient les valeurs de base du design system (couleurs, dimensions, spacers, radius) utilisées par la config edifice2d.
