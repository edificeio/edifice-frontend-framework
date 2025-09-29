# Intégration de Chakra UI dans Edifice

## Résumé

L'intégration de Chakra UI a été réalisée avec succès dans la bibliothèque de composants Edifice. Cette intégration permet de commencer la migration progressive depuis Bootstrap vers Chakra UI.

## Ce qui a été fait

### 1. Installation des dépendances
- `@chakra-ui/react` v3.27.0
- `@chakra-ui/theme-tools` v2.2.6
- `@emotion/react` v11.14.0
- `@emotion/styled` v11.14.1
- `framer-motion` v12.23.22

### 2. Configuration du thème
- **Fichier**: `src/theme/index.ts`
- **Fonctionnalités**:
  - Intégration des couleurs Bootstrap existantes
  - Mapping des couleurs principales (primary, secondary, danger, success, warning, info)
  - Configuration compatible avec Chakra UI v3

### 3. Nouveau composant ButtonV2
- **Fichier**: `src/components/ButtonV2/ButtonV2.tsx`
- **Fonctionnalités**:
  - API similaire au composant Button existant
  - Support des couleurs, variants et tailles
  - Gestion des états (loading, disabled)
  - Support des icônes (leftIcon, rightIcon)
  - Styles personnalisés basés sur votre système Bootstrap

### 4. Stories Storybook
- **Fichier**: `src/components/ButtonV2/ButtonV2.stories.tsx`
- **Fonctionnalités**:
  - Stories complètes pour tous les cas d'usage
  - Comparaison avec l'ancien composant Button
  - Documentation interactive

### 5. Provider Chakra UI
- **Fichier**: `src/providers/ChakraProvider.tsx`
- **Fonctionnalités**:
  - Provider personnalisé avec le thème Edifice
  - Intégration dans l'index des providers

### 6. Documentation
- **Fichier**: `src/components/ButtonV2/README.md`
- **Fonctionnalités**:
  - Guide d'utilisation complet
  - Exemples de migration
  - Documentation des props

## Utilisation

### Import du composant
```tsx
import { ButtonV2 } from '@edifice.io/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '@edifice.io/react/theme';
```

### Exemple d'utilisation
```tsx
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ButtonV2 } from '@edifice.io/react';
import theme from '@edifice.io/react/theme';

function App() {
  return (
    <ChakraProvider value={theme}>
      <ButtonV2 color="primary" variant="solid" size="md">
        Mon bouton
      </ButtonV2>
    </ChakraProvider>
  );
}
```

## Migration depuis Button

Le composant ButtonV2 est conçu pour être une alternative directe :

```tsx
// Ancien Button (Bootstrap)
<Button color="primary" variant="filled" size="md">
  Mon bouton
</Button>

// Nouveau ButtonV2 (Chakra UI)
<ButtonV2 color="primary" variant="solid" size="md">
  Mon bouton
</ButtonV2>
```

## Couleurs disponibles

- `primary` → Orange (#ff8d2e)
- `secondary` → Bleu (#2a9cc8)
- `danger` → Rouge (#e13a3a)
- `success` → Vert (#7dbf85)
- `warning` → Orange (#f59700)
- `info` → Bleu (#4bafd5)

## Variants disponibles

- `solid` → Bouton rempli
- `outline` → Bouton avec bordure
- `ghost` → Bouton transparent

## Tailles disponibles

- `sm` → Petite (3.2rem de hauteur)
- `md` → Moyenne (4rem de hauteur)
- `lg` → Grande (4.8rem de hauteur)

## Prochaines étapes

1. **Tester le composant** dans votre application
2. **Migrer progressivement** les boutons existants
3. **Créer d'autres composants** avec Chakra UI (InputV2, CardV2, etc.)
4. **Déprécier progressivement** les composants Bootstrap

## Avantages de Chakra UI

- **Performance** : Meilleure optimisation des rendus
- **Accessibilité** : Support natif de l'accessibilité
- **Thème** : Système de thème plus flexible
- **TypeScript** : Meilleur support TypeScript
- **Bundle size** : Taille de bundle optimisée

## Notes importantes

- Chakra UI v3 a une API différente des versions précédentes
- Le thème est configuré pour être compatible avec votre système de couleurs existant
- Le composant ButtonV2 maintient la même API que Button pour faciliter la migration
- Tous les styles sont basés sur votre système Bootstrap existant

## Support

Pour toute question ou problème, consultez :
- La documentation Chakra UI : https://chakra-ui.com/
- Les stories Storybook du composant
- Le README du composant ButtonV2
