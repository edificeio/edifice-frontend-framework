import { Meta, StoryObj } from '@storybook/react';

import { ReactionSummaryData, ReactionType } from '@edifice.io/ts-client';
import { useState } from 'react';
import { ReactionChoice, ReactionChoiceProps } from '..';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ReactionChoice> = {
  title: 'Components/Audience/Reactions choice',
  component: ReactionChoice,
  decorators: [
    (Story) => (
      <div>
        <p style={{ height: '15em' }}>
          Here is a very informative and interesting paragraph.
        </p>
        {Story()}
      </div>
    ),
  ],
  args: {
    availableReactions: ['REACTION_2', 'REACTION_3', 'REACTION_4'],
    summary: {
      reactionTypes: ['REACTION_2', 'REACTION_4'],
      userReaction: undefined,
      totalReactionsCounter: 3,
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof ReactionChoice>;

export const Base: Story = {
  render: ({ summary, availableReactions }: ReactionChoiceProps) => {
    const [currentSummary, setCurrentSummary] =
      useState<ReactionSummaryData>(summary);

    const handleChange = (newReaction?: ReactionType | undefined) => {
      setCurrentSummary(({ userReaction, ...restSummary }) => {
        alert(`Reaction changed from ${userReaction} to ${newReaction}`);
        return { ...restSummary, userReaction: newReaction };
      });
    };

    return (
      <ReactionChoice
        summary={currentSummary}
        availableReactions={availableReactions}
        onChange={handleChange}
      />
    );
  },
};
