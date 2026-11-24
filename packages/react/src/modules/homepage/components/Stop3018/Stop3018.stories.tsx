import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import Stop3018, { Stop3018Props } from './Stop3018';
import { Stop3018Modal } from './Stop3018Modal';
import { Stop3018Link } from './types';
import { openStop3018Link } from './utils';

const meta: Meta<typeof Stop3018> = {
  title: 'Modules/Homepage/Stop3018',
  component: Stop3018,
  decorators: [
    (Story) => <div style={{ maxWidth: 400, width: '100%' }}>{Story()}</div>,
  ],
  args: {
    audience: 'student',
  },
  argTypes: {
    audience: {
      options: ['student', 'relative'],
      control: { type: 'radio' },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Homepage card of the 3018, the national helpline against harassment and online violence run by the e-Enfance association. ' +
          '"En savoir plus" opens a modal with advice and links to the e-Enfance resources. ' +
          '`Stop3018Container` shows it to students and relatives only, with messages of their own; students also get the "Suis-je harcelé ?" quiz.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stop3018>;

// Opens the real e-Enfance resources, as `Stop3018Container` does.
const WithModal = ({ audience }: Pick<Stop3018Props, 'audience'>) => {
  const [isOpen, setIsOpen] = useState(false);
  const openLink = (link: Stop3018Link) => openStop3018Link(audience, link);

  return (
    <>
      <Stop3018
        audience={audience}
        onLearnMoreClick={() => setIsOpen(true)}
        onLinkClick={openLink}
      />
      <Stop3018Modal
        isOpen={isOpen}
        audience={audience}
        onClose={() => setIsOpen(false)}
        onLinkClick={openLink}
      />
    </>
  );
};

export const Student: Story = {
  args: { audience: 'student' },
  render: (args) => <WithModal {...args} />,
};

export const Relative: Story = {
  args: { audience: 'relative' },
  render: (args) => <WithModal {...args} />,
};
