# Stratégie de migration vers neov2

- **Objectif** : migrer progressivement vers le thème neov2 (API map + overrides par composant) sans tout réécrire d’un coup.
- **Conserver** : les thèmes `one` et `neo` tels quels ; neov2 coexiste.
- **Étapes** :
  1. Activer neov2 côté app (`data-product="neov2"`).
  2. Ajuster les overrides dans `themes/neov2/overrides/` par composant.
  3. Utiliser les variables CSS `--edifice-*` issues de la config pour les personnalisations.
- **Référence** : `configs/_theme-config.schema.scss` liste les variables de thème utilisées dans le package.
- **Icônes** : pour tout nouveau thème, il est obligatoire de renseigner les couleurs des icônes (applications et connecteurs). Fichier de référence : `packages/bootstrap/src/abstracts/_icons.scss`. Le thème doit exposer `$<thème>-icons` (applications + connectors) pour que les classes `.color-app-*`, `.bg-app-*`, etc. soient générées.
