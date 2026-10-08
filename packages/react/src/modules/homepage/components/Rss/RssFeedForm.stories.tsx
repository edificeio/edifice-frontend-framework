import { Meta, StoryObj } from '@storybook/react-vite';

import { ButtonBeta } from '../../../../components';
import useToggle from '../../../../hooks/useToggle/useToggle';
import { RssFeedForm } from './RssFeedForm';

const meta: Meta<typeof RssFeedForm> = {
  title: 'Modules/Homepage/Rss/Form',
  component: RssFeedForm,
  args: {
    isSubmitting: false,
    onCancel: () => {},
    onClose: () => {},
    onSubmit: (payload) => alert(JSON.stringify(payload)),
  },
  parameters: {
    docs: {
      description: {
        component:
          "Ajout ou modification d'un flux RSS : nom (80 caractères max) et URL du flux, tous deux obligatoires.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RssFeedForm>;

const editedFeed = {
  title: 'Le Monde',
  link: 'https://www.lemonde.fr/rss/une.xml',
};

// Closed by default: safe to embed in the auto-generated Docs page.
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
          <RssFeedForm
            {...args}
            onCancel={() => toggle(false)}
            onClose={() => toggle(false)}
          />
        )}
      </>
    );
  },
};

// Always-open stories, excluded from the Docs page (see RssFeedsModal).

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
    feed: editedFeed,
  },
  parameters: {
    docs: { disable: true },
  },
};

export const Submitting: Story = {
  args: {
    mode: 'edit',
    feed: editedFeed,
    isSubmitting: true,
  },
  parameters: {
    docs: { disable: true },
  },
};
