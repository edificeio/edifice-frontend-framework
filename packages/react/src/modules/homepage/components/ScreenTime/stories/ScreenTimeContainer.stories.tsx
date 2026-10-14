import { Meta, StoryObj } from '@storybook/react-vite';

import { ScreenTimeContainer } from '../ScreenTimeContainer';

const meta: Meta<typeof ScreenTimeContainer> = {
  title: 'Modules/Homepage/ScreenTime/Container',
  component: ScreenTimeContainer,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 397 }}>
        <div id="portal" />
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "ScreenTimeContainer connecte le widget « Temps d'écran » à l'API appregistry (mockée ici via MSW). Ouvrez le plein écran pour naviguer entre les semaines et les jours.",
      },
    },
    // Interaction demo: the Widget/Modal stories already cover the visual
    // states.
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof ScreenTimeContainer>;

export const Default: Story = {};
