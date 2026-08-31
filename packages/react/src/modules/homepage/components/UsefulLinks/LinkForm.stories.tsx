import { Meta, StoryObj } from '@storybook/react-vite';

import { LinkForm } from './LinkForm';

const meta: Meta<typeof LinkForm> = {
  title: 'Modules/Homepage/LinkForm',
  component: LinkForm,
  args: {
    isSubmitting: false,
    onCancel: () => alert('Annuler'),
    onClose: () => alert('Fermer'),
    onSubmit: (payload) => alert(`Enregistrer ${JSON.stringify(payload)}`),
  },
  parameters: {
    // ModalBeta locks page scroll while open, and every story here renders
    // it open by default: see UsefulLinksModal.stories.tsx for why the
    // Docs page is disabled for this file.
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof LinkForm>;

export const Add: Story = {
  args: {
    mode: 'add',
  },
};

export const Edit: Story = {
  args: {
    mode: 'edit',
    link: { id: '1', name: 'Lumni', url: 'https://www.lumni.fr' },
  },
};

export const Submitting: Story = {
  args: {
    mode: 'add',
    isSubmitting: true,
  },
};
