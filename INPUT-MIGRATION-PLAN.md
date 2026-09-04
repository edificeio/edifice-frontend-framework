# Input Migration Plan

**Objectif** : aligner `Input`, `Label` et `FormText` sur la maquette Figma "Text field" (EdificeLibrary_Web, [node 159-648](https://www.figma.com/design/WtPICxhTgsapVmABPlETrZ/EdificeLibrary_Web?node-id=159-648&m=dev)) — en place, sans nouveau composant (`InputBeta`), sans dépendance Bootstrap/SASS legacy.

- **Composants touchés** : `Input`, `Label`, `FormText`, `FormControl`
- **Consommateurs** : 7 usages partagés (`PublishModal`, `ResourceModal`, `ImageEditor`, `VideoRecorder`, `ExternalLinker`, `Editor`, `LinkForm`)
- **Thèmes** : `one`, `neo`, `edifice1d`, `edifice2d`, `crna`
- **Statut** : analyse validée — prêt à coder
- **Ticket associé** : IMPULS-5881 (widget Liens utiles)

## 00 — Contexte

Le champ de formulaire "Text field" du nouveau design system (états `empty`/`focus`/`filled`/`error`/`success`/`disable`, tailles `Big`/`Medium`) doit remplacer visuellement l'`Input` actuel. Contrairement à `ModalBeta`/`ButtonBeta`/`LinkPill`, on ne crée **pas** de variante "Beta" : on modifie `Input`/`Label` en place, pour que les 7 usages existants héritent automatiquement du nouveau rendu sans changement d'import.

Aujourd'hui, `Input` pose la classe Bootstrap native `form-control` — stylée par le vrai `forms.scss` importé dans `vendors/_bootstrap.scss` (vérifié en direct : c'est ce moteur, pas notre CSS, qui produit aujourd'hui bordure/icône/anneau des états valid/invalid). Tant que cette classe reste posée, le composant reste sous la coupe du cascade Bootstrap quoi qu'on ajoute par-dessus.

## 01 — Contraintes non négociables

- **Zéro SASS var** : uniquement des `var(--primitive-*)` / `var(--color-*)`. Aucun `$variable`, même issu de `configs/primitives` (contrairement à `_buttons-beta.scss` qui en garde encore). Modèle à suivre : `_modal-beta.scss` / `_link-pill.scss`, 100% conformes.
- **Zéro classe Bootstrap en JSX** : pas de `px-12`, `py-8`, `pe-64`, etc. posés dans les composants React. Padding/gap vivent uniquement dans la nouvelle feuille CSS ; le JSX ne pose que des classes modificatrices d'état (`--focus`, `--error`…).
- **Zéro dépendance `abstracts/`/`base/`** : aucun `@use '../abstracts/'`. Nouvelles classes CSS (pas `form-control`/`form-label`/`form-text`) pour ne récupérer aucune règle du `forms.scss` Bootstrap natif.
- **API React inchangée** : mêmes props, mêmes imports pour les 7 consommateurs. Le changement est interne au rendu — sauf le mapping de tailles (voir §06).

## 02 — Table de tokens

Toutes les valeurs sont déjà émises globalement sur `:root` par `theme.primitive-vars` / `theme.theme-vars` — indépendamment de Bootstrap. Les gris/erreur/succès sont identiques sur les 5 thèmes ; le focus neutre s'adapte à la couleur de marque de chaque thème.

| Rôle | Valeur | Token |
|---|---|---|
| Texte saisi | `#383838` | `--primitive-text-color-default` |
| Placeholder / subtext / message neutre | `#696969` | `--primitive-text-color-subtext` |
| Bordure — vide | `#e4e4e4` | `--primitive-grey-300` |
| Bordure — remplie (non focus) | `#c7c7c7` | `--primitive-grey-500` |
| Fond désactivé | `#f2f2f2` | `--primitive-grey-200` |
| Bordure désactivée | `#c7c7c7` | `--primitive-grey-500` |
| Texte désactivé | `#949494` | `--primitive-grey-700` ⚠️ fix requis — §03 |
| Bordure + icône erreur | `#f63131` | `--color-support-danger-500` |
| Anneau focus erreur | `#ffbdbd` | `--color-support-danger-300` |
| Bordure + icône succès | `#33c77d` | `--color-support-success-500` |
| Anneau focus succès | `#bdf0d5` | `--color-support-success-300` |
| Bordure + anneau focus neutre | `#ffd357` / `#fcf3cf` | `--color-buttons-primary-default` / `-pale` ⚠️ theme-aware |

## 03 — Correction de primitives préalable

`configs/_primitives.scss` a `$grey-700: #828282` aujourd'hui, alors que la maquette référence `grey/700 = #949494` pour le texte désactivé — désynchro entre l'échelle Figma et le code. `$grey-700` n'a aucun consommateur dans le repo actuellement (grep exhaustif) : le corriger à `#949494` est sans risque de régression, à faire en premier.

## 04 — Comportements — pas de simples couleurs

- **[−] Icônes de validation dans le champ** : la maquette n'affiche aucune icône (coche/exclamation) à l'intérieur de la boîte de saisie, pour aucun état. Supprimer le mécanisme natif Bootstrap (`is-valid`/`is-invalid` background-image) — le flag `noValidationIcon` devient le comportement permanent, pas une option.
- **[+] Icône dans le message d'aide** : nouvelle icône 20px accolée au texte du message, uniquement pour erreur/succès (jamais pour le message neutre) — à construire dans `FormText`. Assets à récupérer depuis Figma.
- **[+] Anneau de focus systématique** : halo `box-shadow` 2px, couleur pleine, sur le focus dans tous les états (neutre inclus). Remplace le `box-shadow: none` actuel sur le focus neutre et recalibre l'anneau erreur/succès (aujourd'hui hérité de Bootstrap : 4px, `rgba(...,.25)` translucide).
- **[+] Bouton clear (×) au focus** : n'existe pas dans `Input` aujourd'hui (comportement natif de `type="search"` sur certains navigateurs seulement). À construire comme un vrai bouton, affiché tant que le champ est focus — cf. décision ouverte en §07.

## 05 — Plan d'exécution

### Phase 0 — Tokens
Remettre les primitives à niveau avant tout le reste.
- [ ] Corriger `$grey-700` → `#949494` dans `packages/bootstrap/src/themes/configs/_primitives.scss`

### Phase 1 — CSS, feuille neuve, zéro Bootstrap
Nouvelles classes, uniquement `var(--primitive-*)`/`var(--color-*)`.
- [ ] Réécrire le champ (bordure/bg/padding par état, tailles Big/Medium, sans `form-control`) → `packages/bootstrap/src/components/_input.scss` (nouveau fichier, remplace `_form-control.scss`)
- [ ] Réécrire le label (poids normal, line-height 22px, "- Optional" en subtext) → `packages/bootstrap/src/components/_label.scss` (remplace `_form-label.scss`)
- [ ] Message d'aide + variantes icône erreur/succès → `packages/bootstrap/src/components/_form-text.scss` (nouveau)
- [ ] Anneau de focus par état + bouton clear, en CSS pur (pas d'utilitaire Bootstrap)
- [ ] Enregistrer les nouveaux fichiers dans l'index components et retirer les anciens du bundle une fois la bascule faite

### Phase 2 — React, composants
Nouvelles classNames, comportements ajoutés, API publique inchangée.
- [ ] Retirer `form-control`/`is-valid`/`is-invalid`/`pe-64`, poser les nouvelles classes + état focus suivi en JS pour le clear-button → `packages/react/src/components/Input/Input.tsx`
- [ ] Nouvelle classe, line-height corrigé → `packages/react/src/components/Label/Label.tsx`
- [ ] Ajout de l'icône conditionnelle erreur/succès → `packages/react/src/components/Form/FormText.tsx`

### Phase 3 — Vérification
Un composant partagé, 7 usages, 5 thèmes — vérifier avant de fusionner.
- [ ] Étendre `Input.stories.tsx` / `FormControl.stories.tsx` aux nouveaux états (anneau focus, disabled, message avec icône)
- [ ] Screenshot des 7 consommateurs sous `edifice2d` et un thème legacy (`one` ou `neo`) pour vérifier l'adaptation theme-aware du focus
- [ ] `pnpm lint` / `pnpm test` / type-check sur `@edifice.io/react` et `@edifice.io/bootstrap`

## 06 — Tailles, mapping à valider

Big et Medium partagent la même typo (16px / line-height 24px) ; seul le padding change (`Big` = 12px/8px, `Medium` = 8px/4px). Aujourd'hui `size="md"` ne fait rien de spécifique et retombe sur les valeurs de `lg` par accident.

| Prop actuelle | Usages | Proposition |
|---|---|---|
| `size="md"` | 12 usages sur 7 fichiers | → `Big` (padding inchangé pour la quasi-totalité des consommateurs) |
| `size="sm"` | 1 usage (`ResourceModal.tsx:374`) | → `Medium` (changement visuel réel — à repasser en revue) |
| `size="lg"` | 0 usage sur Input | alias de `Big` ou à retirer du type |

## 07 — Décisions ouvertes avant/pendant l'implémentation

- **Texte désactivé #949494** : on part sur le fix primitives (§03) plutôt que sur `#828282`/`#909090` existants. À confirmer que c'est bien la valeur voulue côté Figma (possible désynchro token, cf. échange).
- **Icônes du message d'aide** : assets SVG erreur/succès (20px) à récupérer depuis Figma — pas encore exportés à ce stade.
- **Bouton clear conditionné au focus** : la maquette ne l'affiche qu'au focus (pas dès que le champ est rempli, contrairement à `SearchBar` existant). Comportement plus restrictif que l'usage web courant — à confirmer que c'est intentionnel avant de coder.
- **Mapping `size="sm"` → Medium** : seul `ResourceModal.tsx:374` est concerné — repasser cet écran en revue visuelle une fois la bascule faite.
