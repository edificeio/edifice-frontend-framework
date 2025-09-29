# Guide de Migration : Bootstrap vers Mantine

Ce guide vous aide à migrer progressivement de Bootstrap vers Mantine dans votre application Edifice.

## Vue d'ensemble

Mantine est une bibliothèque de composants React moderne qui offre :
- Meilleure accessibilité
- Performance optimisée
- API plus flexible
- Intégration TypeScript native
- Thème personnalisable

## Installation

Mantine est déjà installé dans le package `@edifice.io/react`. Aucune installation supplémentaire n'est requise.

## Configuration

### 1. Provider Mantine

Enveloppez votre application avec le `MantineProvider` :

```tsx
import { MantineProvider } from '@edifice.io/react';

function App() {
  return (
    <MantineProvider>
      {/* Votre application */}
    </MantineProvider>
  );
}
```

### 2. Thème personnalisé

Le thème Mantine d'Edifice reprend automatiquement vos couleurs existantes :
- **Primary** : Orange (#ff8d2e)
- **Secondary** : Bleu (#2a9cc8)
- **Success** : Vert (#7dbf85)
- **Danger** : Rouge (#e13a3a)
- **Warning** : Jaune (#f59700)
- **Info** : Bleu clair (#4bafd5)

## Migration des Composants

### Boutons

#### Avant (Bootstrap)
```tsx
<button className="btn btn-primary">Primary</button>
<button className="btn btn-outline-primary">Outline</button>
<button className="btn btn-sm">Small</button>
<button className="btn btn-lg">Large</button>
<button className="btn btn-primary" disabled>Disabled</button>
```

#### Après (ButtonV4)
```tsx
<ButtonV4 variant="filled" color="primary">Primary</ButtonV4>
<ButtonV4 variant="outline" color="primary">Outline</ButtonV4>
<ButtonV4 size="sm">Small</ButtonV4>
<ButtonV4 size="lg">Large</ButtonV4>
<ButtonV4 disabled>Disabled</ButtonV4>
```

### Mapping des Classes Bootstrap vers ButtonV4

| Bootstrap | ButtonV4 |
|-----------|----------|
| `btn btn-primary` | `<ButtonV4 variant="filled" color="primary">` |
| `btn btn-secondary` | `<ButtonV4 variant="filled" color="secondary">` |
| `btn btn-success` | `<ButtonV4 variant="filled" color="success">` |
| `btn btn-danger` | `<ButtonV4 variant="filled" color="danger">` |
| `btn btn-warning` | `<ButtonV4 variant="filled" color="warning">` |
| `btn btn-info` | `<ButtonV4 variant="filled" color="info">` |
| `btn btn-outline-primary` | `<ButtonV4 variant="outline" color="primary">` |
| `btn btn-outline-secondary` | `<ButtonV4 variant="outline" color="secondary">` |
| `btn btn-sm` | `<ButtonV4 size="sm">` |
| `btn btn-lg` | `<ButtonV4 size="lg">` |
| `btn btn-block` | `<ButtonV4 fullWidth>` |

## Stratégie de Migration

### Phase 1 : Nouveaux Composants
- Utilisez ButtonV4 pour tous les nouveaux composants
- Gardez les composants Bootstrap existants

### Phase 2 : Migration Progressive
- Remplacez les boutons Bootstrap par ButtonV4 un par un
- Testez chaque remplacement

### Phase 3 : Nettoyage
- Supprimez les imports Bootstrap inutilisés
- Optimisez le bundle

## Exemples Pratiques

### Formulaire avec Boutons

#### Avant
```tsx
<form>
  <div className="mb-3">
    <label className="form-label">Nom</label>
    <input type="text" className="form-control" />
  </div>
  <div className="d-flex gap-2">
    <button type="submit" className="btn btn-primary">Enregistrer</button>
    <button type="button" className="btn btn-outline-secondary">Annuler</button>
  </div>
</form>
```

#### Après
```tsx
<form>
  <div style={{ marginBottom: '16px' }}>
    <label>Nom</label>
    <input type="text" />
  </div>
  <div style={{ display: 'flex', gap: '8px' }}>
    <ButtonV4 type="submit" variant="filled" color="primary">
      Enregistrer
    </ButtonV4>
    <ButtonV4 type="button" variant="outline" color="secondary">
      Annuler
    </ButtonV4>
  </div>
</form>
```

### Navigation avec Boutons

#### Avant
```tsx
<nav className="navbar">
  <div className="navbar-nav">
    <button className="btn btn-link">Accueil</button>
    <button className="btn btn-link">Profil</button>
    <button className="btn btn-outline-primary">Se connecter</button>
  </div>
</nav>
```

#### Après
```tsx
<nav>
  <div style={{ display: 'flex', gap: '16px' }}>
    <ButtonV4 variant="subtle">Accueil</ButtonV4>
    <ButtonV4 variant="subtle">Profil</ButtonV4>
    <ButtonV4 variant="outline" color="primary">Se connecter</ButtonV4>
  </div>
</nav>
```

## Avantages de la Migration

### 1. Performance
- Rendu optimisé avec React
- Moins de CSS à charger
- Tree-shaking automatique

### 2. Accessibilité
- Support natif des attributs ARIA
- Navigation au clavier
- Contraste automatique

### 3. Développement
- IntelliSense complet
- Types TypeScript
- Props cohérentes

### 4. Maintenance
- API unifiée
- Moins de CSS personnalisé
- Tests plus faciles

## Bonnes Pratiques

### 1. Migration Progressive
```tsx
// ❌ Ne remplacez pas tout d'un coup
// ✅ Migrez composant par composant

// Étape 1 : Nouveau composant
<ButtonV4 variant="filled" color="primary">Nouveau</ButtonV4>

// Étape 2 : Remplacement progressif
// <button className="btn btn-primary">Ancien</button>
<ButtonV4 variant="filled" color="primary">Migré</ButtonV4>
```

### 2. Tests
```tsx
// Testez chaque migration
it('should render ButtonV4 correctly', () => {
  render(
    <MantineProvider>
      <ButtonV4 variant="filled" color="primary">Test</ButtonV4>
    </MantineProvider>
  );
  
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

### 3. Documentation
- Documentez les changements
- Formez l'équipe
- Créez des exemples

## Dépannage

### Problèmes Courants

#### 1. Styles manquants
```tsx
// ❌ Oublier le MantineProvider
<ButtonV4>Test</ButtonV4>

// ✅ Toujours inclure le provider
<MantineProvider>
  <ButtonV4>Test</ButtonV4>
</MantineProvider>
```

#### 2. Props incorrectes
```tsx
// ❌ Utiliser les props Bootstrap
<ButtonV4 className="btn btn-primary">Test</ButtonV4>

// ✅ Utiliser les props Mantine
<ButtonV4 variant="filled" color="primary">Test</ButtonV4>
```

#### 3. Conflits de styles
```tsx
// ❌ Mélanger Bootstrap et Mantine
<button className="btn btn-primary">
  <ButtonV4>Test</ButtonV4>
</button>

// ✅ Utiliser un seul système
<ButtonV4 variant="filled" color="primary">Test</ButtonV4>
```

## Ressources

- [Documentation Mantine](https://mantine.dev/)
- [Storybook ButtonV4](./src/components/ButtonV4/ButtonV4.stories.tsx)
- [Exemples d'utilisation](./src/components/ButtonV4/ButtonV4.example.tsx)
- [Tests](./src/components/ButtonV4/ButtonV4.test.tsx)

## Support

Pour toute question ou problème :
1. Consultez la documentation Mantine
2. Vérifiez les exemples dans Storybook
3. Contactez l'équipe Edifice

---

**Note** : Cette migration est progressive et volontaire. Vous pouvez continuer à utiliser Bootstrap en parallèle pendant la transition.
