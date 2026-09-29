import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import {
  IconBookmark,
  IconCalendar,
  IconLink,
} from '../../../icons/components';
import {
  WidgetPersonalizationItem,
  WidgetsPersonalizationPanel,
} from './WidgetsPersonalizationPanel';

const SAMPLE_ITEMS: WidgetPersonalizationItem[] = [
  {
    id: 'communities',
    label: 'Communautés',
    icon: <IconBookmark />,
    checked: true,
    locked: true,
  },
  {
    id: 'carnet-de-bord',
    label: 'Carnet de bord',
    icon: <IconBookmark />,
    checked: true,
  },
  {
    id: 'agenda-widget',
    label: 'Agenda',
    icon: <IconCalendar />,
    checked: false,
  },
  {
    id: 'useful-links',
    label: 'Liens utiles',
    icon: <IconLink />,
    checked: true,
  },
];

const meta: Meta<typeof WidgetsPersonalizationPanel> = {
  title: 'Modules/Homepage/WidgetsPersonalizationPanel',
  component: WidgetsPersonalizationPanel,
  decorators: [
    (Story) => (
      <div style={{ width: 340, height: 600, boxShadow: '0 0 0 1px #eee' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Panneau de personnalisation des widgets de la page d'accueil : liste les widgets déployés pour l'utilisateur, avec un toggle par widget, et un cadenas à la place du toggle pour les widgets épinglés par l'admin (`locked`).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof WidgetsPersonalizationPanel>;

export const Default: Story = {
  render: () => {
    const [items, setItems] = useState(SAMPLE_ITEMS);
    return (
      <WidgetsPersonalizationPanel
        items={items}
        onToggle={(id) =>
          setItems((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, checked: !item.checked } : item,
            ),
          )
        }
        onClose={() => {}}
      />
    );
  },
};

export const Loading: Story = {
  args: {
    items: [],
    isLoading: true,
    onToggle: () => {},
    onClose: () => {},
  },
};

export const Empty: Story = {
  args: {
    items: [],
    isLoading: false,
    onToggle: () => {},
    onClose: () => {},
  },
};
