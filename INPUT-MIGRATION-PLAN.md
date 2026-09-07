# Input Migration Plan

**Objectif** : aligner `Input`, `Label` et `FormText` sur la maquette Figma "Text field" (EdificeLibrary_Web, [node 159-648](https://www.figma.com/design/WtPICxhTgsapVmABPlETrZ/EdificeLibrary_Web?node-id=159-648&m=dev)) — en place, sans nouveau composant (`InputBeta`), sans dépendance Bootstrap/SASS legacy.

- **Composants touchés** : `Input`, `Label`, `FormText`, `FormControl`
- **Consommateurs** : 7 usages partagés (`PublishModal`, `ResourceModal`, `ImageEditor`, `VideoRecorder`, `ExternalLinker`, `Editor`, `LinkForm`)
- **Thèmes** : `one`, `neo`, `edifice1d`, `edifice2d`, `crna`
- **Statut** : implémenté (Phases 0-2), tailles résolues (§06) — reste la Phase 3 (vérification visuelle multi-thèmes/multi-consommateurs)
- **Ticket associé** : IMPULS-5881 (widget Liens utiles)

## 00 — Contexte

Le champ de formulaire "Text field" du nouveau design system (états `empty`/`focus`/`filled`/`error`/`success`/`disable`, tailles `Big`/`Medium`) doit remplacer visuellement l'`Input` actuel. Contrairement à `ModalBeta`/`ButtonBeta`/`LinkPill`, on ne crée **pas** de variante "Beta" : on modifie `Input`/`Label` en place, pour que les 7 usages existants héritent automatiquement du nouveau rendu sans changement d'import.

Aujourd'hui, `Input` pose la classe Bootstrap native `form-control` — stylée par le vrai `forms.scss` importé dans `vendors/_bootstrap.scss` (vérifié en direct : c'est ce moteur, pas notre CSS, qui produit aujourd'hui bordure/icône/anneau des états valid/invalid). Tant que cette classe reste posée, le composant reste sous la coupe du cascade Bootstrap quoi qu'on ajoute par-dessus.

## 01 — Contraintes non négociables

- **Zéro SASS var** : uniquement des `var(--primitive-*)` / `var(--color-*)`. Aucun `$variable`, même issu de `configs/primitives` (contrairement à `_buttons-beta.scss` qui en garde encore). Modèle à suivre : `_modal-beta.scss` / `_link-pill.scss`, 100% conformes.
- **Zéro classe Bootstrap en JSX** : pas de `px-12`, `py-8`, `pe-64`, etc. posés dans les composants React. Padding/gap vivent uniquement dans la nouvelle feuille CSS ; le JSX ne pose que des classes modificatrices d'état (`--focus`, `--error`…).
- **Zéro dépendance `abstracts/`/`base/`** : aucun `@use '../abstracts/'`. Nouvelles classes CSS (pas `form-control`/`form-label`/`form-text`) pour ne récupérer aucune règle du `forms.scss` Bootstrap natif.
- **API React inchangée** : mêmes props, mêmes imports pour les 7 consommateurs. Le changement est interne au rendu — sauf le mapping de tailles (voir §06).

**Précision actée pendant l'implémentation** : "pas de nom de classe partagé avec Bootstrap" ne veut pas dire supprimer `_form-control.scss`/`_form-label.scss`/`_form-text.scss` — ces fichiers restent **intacts**, car `.form-control`/`.form-label` sont aussi posés en dur (hors composant `Input`/`Label`) par `TextArea.tsx`, `Comment.tsx`, `CommentForm.tsx`, `PublishModal.tsx`, et par des apps externes (`communities` → `CopyableInput.tsx` + `index.css`, `collect`, `wiki`) qui n'importent jamais nos composants React. `Input`/`Label`/`FormText` arrêtent simplement de poser ces classes et utilisent des classes entièrement nouvelles (`input`, `input-label`, `input-message`) dans des fichiers séparés — zéro fichier existant supprimé ou modifié en profondeur, zéro risque pour ces consommateurs. Seuls deux fichiers qui composent avec le **composant** `Input` (pas la classe CSS) ont dû être ajustés : `_input-group.scss` (utilisé par `SearchBar`) et `_combobox.scss` (utilisé par `Combobox`), pour cibler `.input` en plus de `.form-control`.

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
| Texte désactivé | `#949494` | `--primitive-grey-700` (fix requis — §03) |
| Bordure + icône erreur | `#f63131` | `--color-support-danger-500` |
| Anneau focus erreur | `#ffbdbd` | `--color-support-danger-300` |
| Bordure + icône succès | `#33c77d` | `--color-support-success-500` |
| Anneau focus succès | `#bdf0d5` | `--color-support-success-300` |
| Bordure + anneau focus neutre | `#ffd357` / `#fcf3cf` | `--color-buttons-primary-default` / `-pale` ⚠️ theme-aware |

## 03 — Correction de primitives préalable

`configs/_primitives.scss` a `$grey-700: #828282` aujourd'hui, alors que la maquette référence `grey/700 = #949494` pour le texte désactivé — désynchro entre l'échelle Figma et le code. `$grey-700` n'a aucun consommateur dans le repo actuellement (grep exhaustif) : le corriger à `#949494` est sans risque de régression, à faire en premier. Valeur `#949494` confirmée côté Design.

## 04 — Comportements — pas de simples couleurs

- **[−] Icônes de validation dans le champ** ✅ : `Input` ne pose plus `.form-control`/`.is-invalid`/`.is-valid`, donc la règle native Bootstrap qui posait l'icône ne s'applique jamais — rien à annuler explicitement. `noValidationIcon` est gardé dans le type (`@deprecated`, no-op) pour ne pas casser la compilation des consommateurs qui le passent encore.
- **[+] Icône dans le message d'aide** ✅ : `FormText` affiche `IconError`/`IconSuccessOutline` (icônes déjà existantes dans la lib, pas les assets Figma — voir décision ouverte ci-dessous) à côté du message, uniquement pour erreur/succès.
- **[+] Anneau de focus systématique** ✅ : `box-shadow` 2px sur `.input:focus-within`, y compris à l'état neutre (`--color-buttons-primary-pale`), recalibré aussi pour erreur/succès avec nos propres tokens (`--color-support-danger-300`/`-success-300`) — écrit indépendamment, sans lire aucune variable `--bs-*`.
- **[+] Bouton clear (×)** ⚠️ **changé en cours d'implémentation** : d'abord fait "systématique au focus" comme demandé, mais ça a cassé deux tests existants (`SearchBar` a son propre bouton clear positionné différemment ; `VideoEmbed` vérifie qu'aucun bouton n'apparaît dans un certain état) — sans audit exhaustif de tous les usages d'`Input` dans l'écosystème, rendre ce bouton universel par défaut est risqué. **Reverti en opt-in** : nouvelle prop `clearable?: boolean` (défaut `false`). `SearchBar` n'a pas besoin de s'en exclure puisque c'est déjà désactivé par défaut.

## 05 — Plan d'exécution

### Phase 0 — Tokens ✅
- [x] Corriger `$grey-700` → `#949494` dans `packages/bootstrap/src/themes/configs/_primitives.scss`

### Phase 1 — CSS, fichiers neufs, zéro Bootstrap ✅
`_form-control.scss`/`_form-label.scss`/`_form-text.scss` sont **laissés intacts** (cf. §01) — trois fichiers neufs à côté, uniquement `var(--primitive-*)`/`var(--color-*)`, zéro `$variable`.
- [x] `packages/bootstrap/src/components/_input.scss` (nouveau) — `.input`/`.input--lg`/`.input--invalid`/`.input--valid`/`.input--plaintext`, `.input-field`, `.input-counter`, `.input-clear`
- [x] `packages/bootstrap/src/components/_label.scss` (nouveau) — `.input-label`
- [x] `packages/bootstrap/src/components/_input-message.scss` (nouveau) — `.input-message`
- [x] `packages/bootstrap/src/components/_index.scss` — forward des 3 nouveaux fichiers
- [x] `packages/bootstrap/src/components/_input-group.scss` — bloc `.input` ajouté à côté du bloc `.form-control` existant (pour `SearchBar`, qui compose avec le composant `Input`)
- [x] `packages/bootstrap/src/components/_combobox.scss` — `> .input` ajouté au sélecteur existant (pour `Combobox`)
- [x] Build `sass` de `@edifice.io/bootstrap` vérifié sans erreur, tokens/`:has()` présents dans le CSS compilé

### Phase 2 — React, composants ✅
- [x] `packages/react/src/components/Input/Input.tsx` — nouvelles classes, wrapper `<div className="input">` autour du `<input className="input-field">`, compteur rendu en interne (plus de `Textcounter` partagé — évite d'impacter `TextArea`, qui le réutilise aussi), bouton clear en opt-in (`clearable`, voir §04)
- [x] `packages/react/src/components/Label/Label.tsx` — `input-label`/`input-label--has-icon`
- [x] `packages/react/src/components/Form/FormText.tsx` — `input-message`, icône `IconError`/`IconSuccessOutline`
- [x] `packages/react/src/components/SearchBar/SearchBar.tsx` — aucun changement requis au final (le clear-button d'`Input` est opt-in par défaut)
- [x] Tests mis à jour pour le nouveau DOM (état/validité désormais sur le wrapper, pas sur l'`<input>` lui-même) : `Input.spec.tsx`, `Label.spec.tsx`, `Form.spec.tsx`, `Combobox.spec.tsx`
- [x] Suite complète (`pnpm test`, 2490 tests) : tout passe sauf `Header.spec.tsx` (échec pré-existant, confirmé identique sur la base non modifiée, sans rapport avec ce chantier)
- [x] `tsc --noEmit` et `eslint` sur `@edifice.io/react` : aucune erreur

### Phase 3 — Vérification visuelle (en attente §06)
Un composant partagé, 7 usages, 5 thèmes — à faire une fois les tailles validées par Design pour ne pas la refaire deux fois.
- [ ] Étendre `Input.stories.tsx` / `FormControl.stories.tsx` aux nouveaux états (anneau focus, disabled, message avec icône)
- [ ] Screenshot des 7 consommateurs sous `edifice2d` et un thème legacy (`one` ou `neo`) pour vérifier l'adaptation theme-aware du focus
- [ ] Repasser en revue `ResourceModal.tsx:374` (`size="sm"`) et les 12 usages externes de `size="lg"` une fois le mapping tranché

## 06 — Tailles ✅ (résolu — padding recalculé, plus de resserrement de `md`)

Big et Medium partagent la même typo (16px / line-height 24px) ; seul le padding change. Aujourd'hui `size="md"` ne fait rien de spécifique et retombe sur les valeurs de `lg` par accident.

**Audit élargi** : le premier passage ne regardait que les 7 usages internes à ce monorepo. En élargissant à 18 apps consommatrices réelles de `@edifice.io/react` trouvées en `../` (checkouts locaux sous `/Volumes/Work/`, hors `claude-homeworks` qui est un repo d'outillage de migration contenant des copies de référence, pas une vraie app en prod — et sans garantie que ces checkouts soient exhaustifs ou à jour avec leurs remotes) :

| Taille | Usages réels (hors ce repo) | Où |
|---|---|---|
| `size="sm"` | **0** | aucun en dehors du seul usage interne (`ResourceModal.tsx:374`) |
| `size="md"` (explicite + implicite par défaut) | **~44** | quasi toutes les apps (actualites, blog, entcore, homeworks, wiki, magneto, support…) |
| `size="lg"` | **12** | `livret-scolaire-front-web` (9× — `TabEtab.tsx`, `ExportInformations.tsx`, `NoUaiModal.tsx`), `entcore/conversation` (`MessageEdit.tsx`), `explorer` (`SearchForm.tsx`), `support` (`TicketCreateForm.tsx`) |

`lg` a donc un vrai usage en prod (contrairement à ce qui avait été supposé initialement) et ne peut pas être retiré ou fusionné silencieusement.

**Correction du padding trouvée en implémentant** : la maquette Figma empile en fait deux couches de padding (le `_input` extérieur avec 4px uniforme + bordure, puis un `inputElementsWrap` intérieur avec son propre padding) — la première lecture n'avait pris que la couche intérieure. Fusionnées en une seule couche (+4px, sans dupliquer un bord), les valeurs de Medium/Big retombent **exactement** sur les paddings actuels de `md`/`lg`. Mapping retenu : `sm`/`md` → Medium (renommé `md`), `lg` → Big (renommé `lg`), API inchangée à 3 valeurs.

| | `sm` (1 usage interne) | `md` (~44 usages, quasi toutes les apps) | `lg` (12 usages externes, 4 apps) |
|---|---|---|---|
| → cible | `md` (ex-Medium) | `md` (ex-Medium) | `lg` (ex-Big) |
| padding vertical | 4px → **8px** (+4px) | 8px → 8px (0) | 12px → 12px (0) |
| padding horizontal | 12px → 12px (0) | 12px → 12px (0) | 16px → 16px (0) |
| taille de texte | 14px → 16px (+14%) | 16px → 16px (0) | 16px → 16px (0) |
| line-height | 22px → 24px (+9%) | 22px → 24px (+9%) | 22px → 24px (+9%) |
| border-radius | 8px → 12px (+50%) | 12px → 12px (0) | 12px → 12px (0) |

`md` et `lg` ne changent donc plus visuellement (padding identique à aujourd'hui) — seul `sm` (1 usage interne, `ResourceModal.tsx:374`) change encore, et seulement sur le padding vertical (+4px). Le point sensible soulevé plus haut (`md` perdrait 50% de padding vertical) est caduc.

## 07 — Décisions ouvertes avant/pendant l'implémentation

- **Icônes du message d'aide** : implémenté avec `IconError`/`IconSuccessOutline`, déjà existantes dans la lib (cercle + croix / cercle + coche) — pas les assets exacts de la maquette Figma (jamais récupérés). À comparer visuellement une fois possible et remplacer si Design veut les icônes exactes.
- **Bouton clear conditionné au focus** ✅ : affiné en `:focus-within` **ET** champ non vide (`:has(.input-field:not(:placeholder-shown))`) — n'apparaît plus sur un champ vide juste focus. Le bouton reste **opt-in** (`clearable`, voir §04) suite aux régressions trouvées sur `SearchBar`/`VideoEmbed` — reste à savoir si on veut un jour le rendre par défaut partout une fois un audit plus large fait. Premier usage réel : champ "Nom" du formulaire `LinkForm` (widget Liens utiles).
- **Mapping `size="sm"` → Medium** : seul `ResourceModal.tsx:374` est concerné — repasser cet écran en revue visuelle une fois la bascule faite.
- **Faut-il garder la prop `sm` ?** : `sm` n'a qu'un seul usage connu, interne à ce repo (`ResourceModal.tsx:374`) — potentiellement une prop morte. Recommandation : **ne pas la retirer du type** pour l'instant. L'audit d'usage ne couvre que les apps présentes en local sous `/Volumes/Work/` (18 apps, checkouts non garantis exhaustifs ni à jour) — retirer une valeur d'un type public exposé (`@edifice.io/react`) casserait la compilation de tout consommateur externe non couvert par cet audit qui l'utiliserait encore. Plutôt : neutraliser `sm` **au niveau CSS** (le style de base non qualifié devient directement le spec `md`/Medium, seul `lg` reçoit une classe modificatrice) — ainsi même une valeur `sm` non reconnue ou dépréciée retombe sans casse sur le rendu par défaut. Marquer `sm` `@deprecated` dans le JSDoc de la prop pour décourager tout nouvel usage, et envisager son retrait du type dans une future version majeure une fois l'absence d'usage confirmée plus largement.
