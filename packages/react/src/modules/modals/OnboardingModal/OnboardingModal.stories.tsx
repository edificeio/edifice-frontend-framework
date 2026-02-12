import illuSearch from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-search.svg';
import illuTrash from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-trash.svg';

import {
  ONBOARDING_MODAL_CUSTOM_PREFERENCE_IDENTIFIER,
  ONBOARDING_MODAL_PREFERENCE_IDENTIFIER,
} from '@edifice.io/config/src/msw/mocks/userbook';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../../../components/Button';
import { useDate } from '../../../hooks';
import OnboardingModal, { DisplayRuleCheckResult } from './OnboardingModal';

const meta: Meta<typeof OnboardingModal> = {
  title: 'Modules/Modals/OnboardingModal',
  component: OnboardingModal,
  decorators: [(Story) => <div style={{ height: '35em' }}>{Story()}</div>],
  argTypes: {
    'id': {
      description: 'Unique identifier for the modal',
      control: 'text',
    },
    'items': {
      description: 'List of items to display in the carousel',
      control: 'object',
    },
    'items[].src': {
      description: 'Image path for each slide',
      control: 'text',
    },
    'items[].alt': {
      description: 'Alternative text for the image',
      control: 'text',
    },
    'items[].text': {
      description: 'Descriptive text under the image',
      control: 'text',
    },
    'modalOptions': {
      description: 'Modal configuration options',
      control: 'object',
    },
    'modalOptions.title': {
      description: 'Modal title',
      control: 'text',
    },
    'modalOptions.prevText': {
      description: 'Previous button text',
      control: 'text',
    },
    'modalOptions.nextText': {
      description: 'Next button text',
      control: 'text',
    },
    'modalOptions.closeText': {
      description: 'Close button text',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: ONBOARDING_MODAL_PREFERENCE_IDENTIFIER,
    items: [
      {
        src: illuTrash,
        alt: 'Onboarding Illustration 1',
        text: 'Aliquam eu velit massa. Pellentesque finibus semper nisl sed eleifend. Maecenas maximus cursus ipsum. Curabitur a pretium ex. Cras aliquet malesuada nisi eget consequat. In vitae ligula urna. Nunc gravida lectus diam, vel congue velit pretium vel.',
      },
      {
        title: 'Second onboarding title',
        src: illuSearch,
        alt: 'Onboarding Illustration 2',
        text: 'Vestibulum bibendum orci magna, et pellentesque lectus feugiat vitae. Phasellus accumsan sagittis quam, eget pharetra velit condimentum sed.',
      },
    ],
    modalOptions: {
      prevText: 'Previous',
      nextText: 'Next',
      closeText: 'Close',
    },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    function handleOpenModal() {
      setIsOpen(true);
    }

    return (
      <>
        <div id="portal" />
        <Button
          type="button"
          variant="filled"
          color="primary"
          onClick={handleOpenModal}
        >
          Open onboarding
        </Button>
        {isOpen && <OnboardingModal {...args} />}
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Onboarding modal with step navigation',
      },
    },
  },
};

type OnboardingModalCustomState = { type: 'Date'; value: string };

export const CustomDisplayRule: Story = {
  args: {
    id: ONBOARDING_MODAL_CUSTOM_PREFERENCE_IDENTIFIER,
    items: [
      {
        title: 'Custom display rule',
        src: illuTrash,
        alt: 'Onboarding Illustration',
        text: 'Aliquam eu velit massa. Pellentesque finibus semper nisl sed eleifend. Maecenas maximus cursus ipsum. Curabitur a pretium ex. Cras aliquet malesuada nisi eget consequat. In vitae ligula urna. Nunc gravida lectus diam, vel congue velit pretium vel.',
      },
      {
        title: 'Second onboarding title',
        src: illuSearch,
        alt: 'Onboarding Illustration 2',
        text: 'Vestibulum bibendum orci magna, et pellentesque lectus feugiat vitae. Phasellus accumsan sagittis quam, eget pharetra velit condimentum sed.',
      },
    ],
    modalOptions: {
      prevText: 'Previous',
      nextText: 'Next',
      closeText: 'Close',
    },
  },
  render: (args) => {
    const { fromNow } = useDate();
    const [isOpen, setIsOpen] = useState(false);

    function handleOpenModal() {
      setIsOpen(true);
    }

    function onDisplayRuleCheck(
      previousState?: OnboardingModalCustomState,
    ): DisplayRuleCheckResult<OnboardingModalCustomState> {
      const nowUTC = new Date();

      const lastDisplayDate = previousState
        ? new Date(previousState.value)
        : nowUTC;

      alert(
        `From previous state ${JSON.stringify(lastDisplayDate)},\nshould onboarding be shown ?\nIt is ${fromNow(lastDisplayDate)}, so display it !`,
      );

      return {
        display: lastDisplayDate.getTime() < nowUTC.getTime(),
        nextState: {
          type: 'Date',
          value: nowUTC.toISOString(),
        },
      };
    }

    return (
      <>
        <div id="portal" />
        <Button
          type="button"
          variant="filled"
          color="primary"
          onClick={handleOpenModal}
        >
          Open onboarding
        </Button>
        {isOpen && (
          <OnboardingModal {...args} onDisplayRuleCheck={onDisplayRuleCheck} />
        )}
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Onboarding modal with custom display rule',
      },
    },
  },
};
