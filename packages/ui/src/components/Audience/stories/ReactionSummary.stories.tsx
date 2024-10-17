import { Meta, StoryObj } from '@storybook/react';

import ReactionSummary, { ReactionSummaryProps } from '../ReactionSummary';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ReactionSummary> = {
  title: 'Components/Audience/Reactions summary',
  component: ReactionSummary,
  args: {
    summary: {
      reactionTypes: ['REACTION_2', 'REACTION_4'],
      userReaction: undefined,
      totalReactionsCounter: 3,
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof ReactionSummary>;

export const Base: Story = {
  render: ({ summary }: ReactionSummaryProps) => {
    const handleClick = () => {
      alert('Show details, please');
    };

    return <ReactionSummary summary={summary} onClick={handleClick} />;
  },
};
