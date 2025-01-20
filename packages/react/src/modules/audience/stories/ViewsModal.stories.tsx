import { Meta, StoryObj } from '@storybook/react';

import { ViewsDetails } from '@edifice.io/client';
import { useToggle } from '../../../hooks';
import ViewsCounter from '../ViewsCounter';
import ViewsModal from '../ViewsModal';

const viewsDetailsMockedData: ViewsDetails = {
  viewsCounter: 20,
  uniqueViewsCounter: 5,
  uniqueViewsPerProfile: [
    {
      profile: 'Student',
      counter: 1,
    },
    {
      profile: 'Relative',
      counter: 1,
    },
    {
      profile: 'Teacher',
      counter: 1,
    },
    {
      profile: 'Personnel',
      counter: 1,
    },
    {
      profile: 'Guest',
      counter: 1,
    },
  ],
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ViewsModal> = {
  title: 'Modules/Audience/Views modal',
  component: ViewsModal,
  decorators: [(Story) => <div style={{ height: '50em' }}>{Story()}</div>],
  args: {
    viewsDetails: viewsDetailsMockedData,
  },
  parameters: {
    docs: {
      description: {
        component:
          'ViewsModal is a component that displays detailed view statistics for content. It shows the total views, unique views, and a breakdown of views by user profile. The modal provides comprehensive analytics about content engagement across different user types.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ViewsModal>;

export const Base: Story = {
  render: ({ viewsDetails }) => {
    const [isOpen, toggle] = useToggle(false);

    function handleOpenModal() {
      toggle(true);
    }

    function handleCloseModal() {
      toggle(false);
    }

    return (
      <>
        <ViewsCounter
          viewsCounter={viewsDetails.viewsCounter}
          onClick={handleOpenModal}
        />
        {isOpen && (
          <ViewsModal
            viewsDetails={viewsDetails}
            isOpen={isOpen}
            onModalClose={handleCloseModal}
          />
        )}
      </>
    );
  },
};
