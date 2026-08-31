import { Meta, StoryObj } from '@storybook/react-vite';

import { ButtonBeta } from '../../../../../components';
import useToggle from '../../../../../hooks/useToggle/useToggle';
import { LinkForm } from '../LinkForm';

const meta: Meta<typeof LinkForm> = {
  title: 'Modules/Homepage/UsefulLinks/Form',
  component: LinkForm,
  args: {
    isSubmitting: false,
    onCancel: () => alert('Annuler'),
    onClose: () => alert('Fermer'),
    onSubmit: (payload) => alert(`Enregistrer ${JSON.stringify(payload)}`),
  },
};

export default meta;
type Story = StoryObj<typeof LinkForm>;

// Closed by default (LinkForm itself always renders its ModalBeta open —
// it's meant to be mounted/unmounted by its parent — so "closed" here means
// not mounted): safe to embed in the auto-generated Docs page. The mounted
// stories below aren't (see their own comment).
export const Interactive: Story = {
  args: {
    mode: 'add',
  },
  render: (args) => {
    const [isOpen, toggle] = useToggle(false);

    return (
      <>
        <ButtonBeta type="button" onClick={() => toggle(true)}>
          Ouvrir le formulaire
        </ButtonBeta>
        {isOpen && (
          <LinkForm
            {...args}
            onCancel={() => toggle(false)}
            onClose={() => toggle(false)}
          />
        )}
      </>
    );
  },
};

// The stories below mount LinkForm directly, which always renders its
// ModalBeta open. They are excluded from the Docs page (`docs.disable`):
// several always-open ModalBeta instances embedded together would make that
// page itself unscrollable (ModalBeta locks page scroll while open). Visit
// them individually via the sidebar.

export const Add: Story = {
  args: {
    mode: 'add',
  },
  parameters: {
    docs: { disable: true },
  },
};

export const Edit: Story = {
  args: {
    mode: 'edit',
    link: { id: '1', name: 'Lumni', url: 'https://www.lumni.fr' },
  },
  parameters: {
    docs: { disable: true },
  },
};

export const Submitting: Story = {
  args: {
    mode: 'add',
    isSubmitting: true,
  },
  parameters: {
    docs: { disable: true },
  },
};
