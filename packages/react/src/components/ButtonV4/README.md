# ButtonV4 - Composant Bouton avec Mantine

## Description

ButtonV4 est un composant bouton moderne basé sur Mantine qui remplace progressivement les boutons Bootstrap dans l'écosystème Edifice. Il offre une meilleure accessibilité, des performances optimisées et une API plus flexible.

## Installation

Le composant ButtonV4 est automatiquement inclus dans le package `@edifice.io/react`. Aucune installation supplémentaire n'est requise.

## Utilisation

### Import basique

```tsx
import { ButtonV4 } from '@edifice.io/react';

function MyComponent() {
  return (
    <ButtonV4 variant="filled" color="primary">
      Cliquez ici
    </ButtonV4>
  );
}
```

### Avec le Provider Mantine

Pour utiliser ButtonV4, vous devez envelopper votre application avec le `MantineProvider` :

```tsx
import { MantineProvider, ButtonV4 } from '@edifice.io/react';

function App() {
  return (
    <MantineProvider>
      <ButtonV4 variant="filled" color="primary">
        Mon bouton
      </ButtonV4>
    </MantineProvider>
  );
}
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `variant` | `'filled' \| 'outline' \| 'light' \| 'subtle' \| 'gradient' \| 'default'` | `'filled'` | Style visuel du bouton |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'gray'` | `'primary'` | Couleur du bouton |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Taille du bouton |
| `loading` | `boolean` | `false` | État de chargement |
| `disabled` | `boolean` | `false` | Bouton désactivé |
| `children` | `React.ReactNode` | - | Contenu du bouton |
| `className` | `string` | - | Classe CSS personnalisée |
| `onClick` | `(event: React.MouseEvent<HTMLButtonElement>) => void` | - | Fonction appelée au clic |

## Exemples

### Variants

```tsx
// Bouton rempli (par défaut)
<ButtonV4 variant="filled" color="primary">Primary</ButtonV4>

// Bouton avec contour
<ButtonV4 variant="outline" color="primary">Outline</ButtonV4>

// Bouton léger
<ButtonV4 variant="light" color="primary">Light</ButtonV4>

// Bouton subtil
<ButtonV4 variant="subtle" color="primary">Subtle</ButtonV4>

// Bouton avec dégradé
<ButtonV4 variant="gradient" color="primary">Gradient</ButtonV4>
```

### Couleurs

```tsx
<ButtonV4 color="primary">Primary</ButtonV4>
<ButtonV4 color="secondary">Secondary</ButtonV4>
<ButtonV4 color="success">Success</ButtonV4>
<ButtonV4 color="danger">Danger</ButtonV4>
<ButtonV4 color="warning">Warning</ButtonV4>
<ButtonV4 color="info">Info</ButtonV4>
<ButtonV4 color="gray">Gray</ButtonV4>
```

### Tailles

```tsx
<ButtonV4 size="xs">Extra Small</ButtonV4>
<ButtonV4 size="sm">Small</ButtonV4>
<ButtonV4 size="md">Medium</ButtonV4>
<ButtonV4 size="lg">Large</ButtonV4>
<ButtonV4 size="xl">Extra Large</ButtonV4>
```

### États

```tsx
// Bouton en chargement
<ButtonV4 loading>Chargement...</ButtonV4>

// Bouton désactivé
<ButtonV4 disabled>Désactivé</ButtonV4>
```

## Migration depuis Bootstrap

### Avant (Bootstrap)

```tsx
<button className="btn btn-primary">Bouton Primary</button>
<button className="btn btn-outline-primary">Bouton Outline</button>
<button className="btn btn-sm">Petit bouton</button>
```

### Après (ButtonV4)

```tsx
<ButtonV4 variant="filled" color="primary">Bouton Primary</ButtonV4>
<ButtonV4 variant="outline" color="primary">Bouton Outline</ButtonV4>
<ButtonV4 size="sm">Petit bouton</ButtonV4>
```

## Avantages par rapport à Bootstrap

1. **Meilleure accessibilité** : Support natif des attributs ARIA
2. **Performance** : Rendu optimisé avec React
3. **Flexibilité** : API plus riche et extensible
4. **Thème cohérent** : Intégration parfaite avec le système de design Edifice
5. **TypeScript** : Support complet des types
6. **Animations** : Transitions fluides intégrées

## Thème personnalisé

ButtonV4 utilise le thème Mantine personnalisé d'Edifice qui reprend les couleurs et l'identité visuelle existante :

- **Primary** : Orange (#ff8d2e)
- **Secondary** : Bleu (#2a9cc8)
- **Success** : Vert (#7dbf85)
- **Danger** : Rouge (#e13a3a)
- **Warning** : Jaune (#f59700)
- **Info** : Bleu clair (#4bafd5)

## Storybook

Consultez le Storybook pour voir tous les exemples interactifs :

```bash
pnpm storybook
```

## Support

Pour toute question ou problème, consultez la documentation Mantine ou contactez l'équipe Edifice.
