import { Meta, StoryObj } from '@storybook/react';

import { ReactionSummaryData, ReactionType } from '@edifice.io/client';
import { useState } from 'react';
import { ReactionChoice, ReactionChoiceProps } from '..';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ReactionChoice> = {
  title: 'Modules/Audience/Reactions choice',
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
  parameters: {
    docs: {
      description: {
        component:
          "ReactionChoice is a component that allows users to react to content with predefined reaction types. It displays available reactions and tracks the user's current reaction along with a summary of all reactions. The component supports customizable reaction types and provides feedback when reactions are changed.",
      },
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
