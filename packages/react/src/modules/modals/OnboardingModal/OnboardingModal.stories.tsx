import illuSearch from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-search.svg';
import illuTrash from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-trash.svg';

import {
  ONBOARDING_MODAL_CUSTOM_PREFERENCE_IDENTIFIER,
  ONBOARDING_MODAL_PREFERENCE_IDENTIFIER,
} from '@edifice.io/config/src/msw/mocks/userbook';
import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { Button } from '../../../components/Button';
import { useDate } from '../../../hooks';
import OnboardingModal, {
  DisplayRuleCheckResult,
  OnboardingModalRef,
} from './OnboardingModal';

const meta: Meta<typeof OnboardingModal> = {
  title: 'Modules/Modals/OnboardingModal',
  component: OnboardingModal,
  decorators: [
    (Story) => (
      <div style={{ height: '35em' }}>
        <div id="portal" />
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Onboarding modal with carousel navigation to guide users through features or updates. Supports custom display rules to control when the modal should be shown.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
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
    const onboardingModalRef = useRef<OnboardingModalRef>(null);

    function handleOpenModal() {
      onboardingModalRef.current?.setIsOpen(true);
    }

    return (
      <>
        <Button
          type="button"
          variant="filled"
          color="primary"
          onClick={handleOpenModal}
        >
          Open onboarding
        </Button>
        <OnboardingModal ref={onboardingModalRef} {...args} />
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic onboarding modal with carousel navigation. Users can navigate through multiple screens using Previous/Next buttons.',
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
        text: '',
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
    const onboardingModalRef = useRef<OnboardingModalRef>(null);
    const [displayRule, setDisplayRule] = useState(
      '...Please wait while checking display rule...',
    );

    function handleOpenModal() {
      onboardingModalRef.current?.setIsOpen(true);
    }

    function onDisplayRuleCheck(
      previousState?: OnboardingModalCustomState,
    ): DisplayRuleCheckResult<OnboardingModalCustomState> {
      const nowUTC = new Date();

      const lastDisplayDate = previousState
        ? new Date(previousState.value)
        : nowUTC;

      setDisplayRule(
        `D'après l'état précédent (${JSON.stringify(lastDisplayDate)}),\nfaut-il afficher la modale d'onboarding ?\nC'est ${fromNow(lastDisplayDate)}, donc affichons-la !`,
      );

      return {
        display: lastDisplayDate.getTime() < nowUTC.getTime(),
        nextState: {
          type: 'Date',
          value: nowUTC.toISOString(),
        },
      };
    }

    // Some feedback for the story reader.
    args.items[0].text = displayRule;

    return (
      <>
        <Button
          type="button"
          variant="filled"
          color="primary"
          onClick={handleOpenModal}
        >
          Open onboarding but check custom display rule
        </Button>
        <OnboardingModal
          ref={onboardingModalRef}
          {...args}
          onDisplayRuleCheck={onDisplayRuleCheck}
        />
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Onboarding modal with a custom display rule. The `onDisplayRuleCheck` callback allows you to control when the modal should be displayed based on custom logic and previous state.',
      },
    },
  },
};
