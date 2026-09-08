import { Meta, StoryObj } from '@storybook/react-vite';

import EdificeAssistanceButton from './EdificeAssistanceButton';

const meta: Meta<typeof EdificeAssistanceButton> = {
  title: 'Components/EdificeAssistanceButton',
  component: EdificeAssistanceButton,
  args: {
    collapsed: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Floating launcher for the Zendesk assistance widget. Displays the full "Edifice" wordmark by default, and collapses to a compact mark (`collapsed`) once the page has scrolled past the top.',
      },
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: 96 }}>
      <EdificeAssistanceButton
        {...args}
        style={{ position: 'absolute', right: 0, bottom: 0 }}
      />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof EdificeAssistanceButton>;

export const Expanded: Story = {
  args: {
    collapsed: false,
  },
};

export const Collapsed: Story = {
  args: {
    collapsed: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'State shown once the user has scrolled: the "Edifice" wordmark shrinks to its icon mark, the "?" help icon stays visible.',
      },
    },
  },
};
