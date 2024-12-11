import { Meta, StoryObj } from '@storybook/react';

import Heading from './Heading';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Heading> = {
  title: 'Components/Heading',
  component: Heading,
  parameters: {
    docs: {
      description: {
        component:
          'The `Heading` component provides consistent heading styles across the application. It allows you to specify both the semantic heading level (h1-h6) and visual style independently, enabling proper document structure while maintaining design flexibility. This component ensures consistent typography and maintains accessibility standards through proper heading hierarchy.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Heading1: Story = {
  args: {
    level: 'h1',
    headingStyle: 'h1',
    children: 'H1 title',
  },
};

export const Heading2: Story = {
  args: {
    level: 'h2',
    headingStyle: 'h2',
    children: 'H2 title',
  },
};

export const Heading3: Story = {
  args: {
    level: 'h3',
    headingStyle: 'h3',
    children: 'H3 Title',
  },
};

export const Heading4: Story = {
  args: {
    level: 'h4',
    headingStyle: 'h4',
    children: 'H4 Title',
  },
};

export const Heading5: Story = {
  args: {
    level: 'h5',
    headingStyle: 'h5',
    children: 'H5 Title',
  },
};

export const Heading6: Story = {
  args: {
    level: 'h6',
    headingStyle: 'h6',
    children: 'H6 Title',
  },
};

export const CustomHeading: Story = {
  args: {
    level: 'h1',
    headingStyle: 'h3',
    children: 'Lorem ipsum dolor sit amet',
  },

  parameters: {
    docs: {
      description: {
        story:
          "It's possible to match the style of an `Hn` element even if not possible to use its semantic HTML version.",
      },
    },
  },
};
