# ButtonV2

Nouveau composant bouton utilisant Chakra UI v3. Ce composant remplace progressivement le composant `Button` basé sur Bootstrap.

## Installation

Le composant ButtonV2 nécessite Chakra UI v3 et ses dépendances :

```bash
pnpm add @chakra-ui/react @chakra-ui/theme-tools @emotion/react @emotion/styled framer-motion
```

## Utilisation

### Import

```tsx
import { ButtonV2 } from '@edifice.io/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '@edifice.io/react/theme';
```

### Exemple basique

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

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `color` | `'primary' \| 'secondary' \| 'tertiary' \| 'danger' \| 'success' \| 'warning' \| 'info'` | `'primary'` | Couleur du bouton |
| `variant` | `'solid' \| 'outline' \| 'ghost'` | `'solid'` | Style du bouton |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Taille du bouton |
| `isLoading` | `boolean` | `false` | État de chargement |
| `loadingPosition` | `'left' \| 'right'` | `'left'` | Position du spinner de chargement |
| `leftIcon` | `ReactNode` | - | Icône à gauche |
| `rightIcon` | `ReactNode` | - | Icône à droite |
| `disabled` | `boolean` | `false` | État désactivé |
| `children` | `ReactNode` | - | Contenu du bouton |

## Exemples

### Couleurs

```tsx
<ButtonV2 color="primary">Primary</ButtonV2>
<ButtonV2 color="secondary">Secondary</ButtonV2>
<ButtonV2 color="danger">Danger</ButtonV2>
<ButtonV2 color="success">Success</ButtonV2>
<ButtonV2 color="warning">Warning</ButtonV2>
<ButtonV2 color="info">Info</ButtonV2>
```

### Variants

```tsx
<ButtonV2 variant="solid">Solid</ButtonV2>
<ButtonV2 variant="outline">Outline</ButtonV2>
<ButtonV2 variant="ghost">Ghost</ButtonV2>
```

### Tailles

```tsx
<ButtonV2 size="sm">Small</ButtonV2>
<ButtonV2 size="md">Medium</ButtonV2>
<ButtonV2 size="lg">Large</ButtonV2>
```

### États

```tsx
<ButtonV2>Normal</ButtonV2>
<ButtonV2 isLoading>Loading</ButtonV2>
<ButtonV2 disabled>Disabled</ButtonV2>
```

### Avec icônes

```tsx
<ButtonV2 leftIcon={<Icon />}>Avec icône gauche</ButtonV2>
<ButtonV2 rightIcon={<Icon />}>Avec icône droite</ButtonV2>
<ButtonV2 leftIcon={<Icon />} rightIcon={<Icon />}>Avec les deux</ButtonV2>
```

## Migration depuis Button

Le composant ButtonV2 est conçu pour être une alternative directe au composant `Button` existant :

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

## Thème

Le composant utilise un thème personnalisé qui s'intègre avec votre système de couleurs Bootstrap existant. Les couleurs sont mappées comme suit :

- `primary` → Orange (#ff8d2e)
- `secondary` → Bleu (#2a9cc8)
- `danger` → Rouge (#e13a3a)
- `success` → Vert (#7dbf85)
- `warning` → Orange (#f59700)
- `info` → Bleu (#4bafd5)

## Storybook

Le composant inclut des stories Storybook complètes pour tester tous les cas d'usage. Lancez Storybook pour voir tous les exemples :

```bash
pnpm storybook
```
