import { Meta, StoryObj } from '@storybook/react-vite';

import hillsBackground from '@edifice.io/bootstrap/dist/images/backgrounds/hills.svg';
import { Library, LibraryProps } from './Library';

const meta: Meta<typeof Library> = {
  title: 'Modules/Homepage/Library',
  component: Library,
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '100vh',
          padding: '4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${hillsBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div style={{ maxWidth: 400, width: '100%' }}>
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Widget Bibliothèque — affiche les prêts en cours de l'utilisateur (« Mes prêts ») et une sélection de livres issue d'un flux RSS (« Sélection du moment », carrousel avec couverture, titre et auteur). Chaque section est masquée si elle est vide. Utiliser `LibraryContainer` pour récupérer les données depuis le backend (`rssFeedUrl` + `loansUrl`).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Library>;

// Deterministic inline SVG book cover, safe for Chromatic snapshots
const svgCover = (background: string, label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="100%" height="100%" fill="${background}"/><text x="50%" y="50%" font-family="sans-serif" font-size="40" fill="#fff" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`,
  )}`;

const mockBooks: LibraryProps['books'] = [
  {
    id: 'book-1',
    title: 'Le meilleurs des mondes',
    author: 'Aldous Huxley',
    cover: svgCover('#38618c', 'des mondes'),
    link: 'https://example.com/books/le-meilleur-des-mondes',
  },
  {
    id: 'book-2',
    title: '1984',
    author: 'George Orwell',
    cover: svgCover('#a82400', '1984'),
    link: 'https://example.com/books/1984',
  },
  {
    id: 'book-3',
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    cover: svgCover('#9e7400', 'F 451'),
    link: 'https://example.com/books/fahrenheit-451',
  },
  {
    id: 'book-4',
    title: 'La Ferme des animaux',
    author: 'George Orwell',
    cover: svgCover('#238050', 'La Ferme'),
    link: 'https://example.com/books/la-ferme-des-animaux',
  },
];

const mockLoans: LibraryProps['loans'] = [
  {
    id: 'loan-1',
    title: "Journal d'un dégonflé - Tome 3",
    cover: svgCover('#2caa69', 'JD3'),
    // Far in the future so the loan is never displayed as overdue
    dueDate: '2099-04-30',
  },
];

export const Default: Story = {
  args: {
    loans: mockLoans,
    books: mockBooks,
    onSeeMoreClick: () => alert('Ouvrir la bibliothèque'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Affichage complet : un prêt en cours et une sélection de 4 livres.',
      },
    },
  },
};

export const WithoutLoans: Story = {
  args: {
    loans: [],
    books: mockBooks,
    onSeeMoreClick: () => alert('Ouvrir la bibliothèque'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Aucun prêt en cours — la section « Mes prêts » est masquée, seule la sélection est affichée.',
      },
    },
  },
};

export const WithoutSelection: Story = {
  args: {
    loans: mockLoans,
    books: [],
    onSeeMoreClick: () => alert('Ouvrir la bibliothèque'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Flux RSS vide — la section « Sélection du moment » est masquée, seuls les prêts sont affichés.',
      },
    },
  },
};

export const OverdueLoan: Story = {
  args: {
    loans: [
      {
        id: 'loan-overdue',
        title: "Journal d'un dégonflé - Tome 3",
        cover: svgCover('#2caa69', 'JD3'),
        // In the past so the loan is always displayed as overdue
        dueDate: '2020-01-15',
      },
    ],
    books: mockBooks,
    onSeeMoreClick: () => alert('Ouvrir la bibliothèque'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Prêt en retard — la date de retour est mise en évidence.',
      },
    },
  },
};

export const ChildrenLoans: Story = {
  args: {
    loans: [],
    childrenLoans: [
      { id: 'child-1', firstName: 'Emma', loansCount: 2 },
      { id: 'child-2', firstName: 'Louis', loansCount: 1 },
    ],
    books: mockBooks,
    onSeeMoreClick: () => alert('Ouvrir la bibliothèque'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Vue parent — seul le nombre de livres empruntés par chaque enfant est affiché, jamais les titres.',
      },
    },
  },
};

export const WithoutCovers: Story = {
  args: {
    loans: [
      {
        id: 'loan-no-cover',
        title: "Journal d'un dégonflé - Tome 3",
        dueDate: '2099-04-30',
      },
    ],
    books: mockBooks.map(({ cover: _cover, ...book }) => book),
    onSeeMoreClick: () => alert('Ouvrir la bibliothèque'),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Couvertures indisponibles — un pictogramme de remplacement est affiché à la place de l'image.",
      },
    },
  },
};
