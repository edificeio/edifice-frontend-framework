import type { Meta, StoryObj } from '@storybook/react-vite';
import { HelpZoneContainer } from './HelpZoneContainer';

const meta: Meta<typeof HelpZoneContainer> = {
  title: 'Modules/Homepage/HelpZoneContainer',
  component: HelpZoneContainer,
  decorators: [(Story) => <div style={{ minHeight: '50px' }}>{Story()}</div>],
  // `#zendeskGuide/config` + the fake snippet are mocked globally
  // (`apps/docs/.storybook/preview.tsx`, `help: zendeskGuideHandlers`);
  parameters: {
    docs: {
      description: {
        component:
          'Container réel, branché sur `useZendeskGuide` (config + script mockés via MSW). Cliquer sur le bouton bascule `isOpen` pour de vrai — utile pour valider le câblage `isReady`/`isOpen`/`open`/`close` avant la passe visuelle.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HelpZoneContainer>;

export const Default: Story = {};
