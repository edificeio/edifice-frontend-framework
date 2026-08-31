import { Meta, StoryObj } from '@storybook/react-vite';

import useToggle from '../../../hooks/useToggle/useToggle';
import ButtonBeta from '../../ButtonBeta/ButtonBeta';
import ModalBeta from '../ModalBeta';
import ModalBetaBody from '../ModalBetaBody';
import ModalBetaFooter from '../ModalBetaFooter';
import ModalBetaHeader from '../ModalBetaHeader';

const meta: Meta<typeof ModalBeta> = {
  title: 'Components/ModalBeta',
  component: ModalBeta,
  decorators: [(Story) => <div style={{ height: '30em' }}>{Story()}</div>],
  args: {
    id: 'modal-beta',
    size: 'm',
  },
  argTypes: {
    size: {
      options: ['s', 'm', 'l', 'xl'],
      control: { type: 'select' },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'ModalBeta is the next-generation modal following the new Figma design system, the same way ButtonBeta follows the new button design system. It will eventually replace Modal entirely.\n\nModalBeta locks page scroll while open (like Modal). The size stories below are open by default for full Chromatic coverage, but excluded from this Docs page (`docs.disable`) so browsing it stays scrollable — visit them individually via the sidebar, or use the Interactive story below.',
      },
    },
  },
  subcomponents: {
    ModalBetaHeader,
    ModalBetaBody,
    ModalBetaFooter,
  },
};

export default meta;

type Story = StoryObj<typeof ModalBeta>;

export const Interactive: Story = {
  render: (args) => {
    const [isOpen, toggle] = useToggle(false);

    return (
      <>
        <ButtonBeta type="button" onClick={() => toggle(true)}>
          Open modal
        </ButtonBeta>
        {isOpen && (
          <ModalBeta
            {...args}
            isOpen={isOpen}
            onModalClose={() => toggle(false)}
          >
            <ModalBeta.Header onModalClose={() => toggle(false)}>
              Modal title
            </ModalBeta.Header>
            <ModalBeta.Body>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </ModalBeta.Body>
            <ModalBeta.Footer>
              <ButtonBeta
                type="button"
                variant="ghost"
                color="tertiary"
                onClick={() => toggle(false)}
              >
                Cancel
              </ButtonBeta>
              <ButtonBeta type="button" onClick={() => toggle(false)}>
                Validate
              </ButtonBeta>
            </ModalBeta.Footer>
          </ModalBeta>
        )}
      </>
    );
  },
  parameters: {
    // Closed by default: no visual regression value of its own (the size
    // stories below already snapshot the open state).
    chromatic: { disableSnapshot: true },
  },
};

// The stories below render the modal open by default, for full Chromatic
// coverage of each size. They are excluded from the Docs page: an always-open
// ModalBeta locks page scroll, and several of them embedded together in the
// same Docs page would make that page itself unscrollable.

export const SizeS: Story = {
  args: {
    id: 'modal-beta-s',
    size: 's',
    isOpen: true,
  },
  render: (args) => (
    <ModalBeta {...args} onModalClose={() => {}}>
      <ModalBeta.Header onModalClose={() => {}}>Title modal S</ModalBeta.Header>
      <ModalBeta.Body>
        <p>Content</p>
      </ModalBeta.Body>
      <ModalBeta.Footer>
        <ButtonBeta type="button" variant="ghost" color="tertiary">
          Cancel
        </ButtonBeta>
        <ButtonBeta type="button">Validate</ButtonBeta>
      </ModalBeta.Footer>
    </ModalBeta>
  ),
  parameters: {
    docs: { disable: true },
  },
};

export const SizeM: Story = {
  args: {
    id: 'modal-beta-m',
    size: 'm',
    isOpen: true,
  },
  render: (args) => (
    <ModalBeta {...args} onModalClose={() => {}}>
      <ModalBeta.Header onModalClose={() => {}} subtitle="Subtext">
        Title modal M
      </ModalBeta.Header>
      <ModalBeta.Body>
        <p>Content</p>
      </ModalBeta.Body>
      <ModalBeta.Footer>
        <ButtonBeta type="button" variant="ghost" color="tertiary">
          Cancel
        </ButtonBeta>
        <ButtonBeta type="button">Validate</ButtonBeta>
      </ModalBeta.Footer>
    </ModalBeta>
  ),
  parameters: {
    docs: { disable: true },
  },
};

export const SizeL: Story = {
  args: {
    id: 'modal-beta-l',
    size: 'l',
    isOpen: true,
  },
  render: (args) => (
    <ModalBeta {...args} onModalClose={() => {}}>
      <ModalBeta.Header onModalClose={() => {}}>Title modal L</ModalBeta.Header>
      <ModalBeta.Body>
        <p>Content</p>
      </ModalBeta.Body>
      <ModalBeta.Footer>
        <ButtonBeta type="button" variant="ghost" color="tertiary">
          Cancel
        </ButtonBeta>
        <ButtonBeta type="button">Validate</ButtonBeta>
      </ModalBeta.Footer>
    </ModalBeta>
  ),
  parameters: {
    docs: { disable: true },
  },
};

export const SizeXL: Story = {
  args: {
    id: 'modal-beta-xl',
    size: 'xl',
    isOpen: true,
  },
  render: (args) => (
    <ModalBeta {...args} onModalClose={() => {}}>
      <ModalBeta.Header onModalClose={() => {}}>
        Title modal XL
      </ModalBeta.Header>
      <ModalBeta.Body>
        <p>Content</p>
      </ModalBeta.Body>
      <ModalBeta.Footer>
        <ButtonBeta type="button" variant="ghost" color="tertiary">
          Cancel
        </ButtonBeta>
        <ButtonBeta type="button">Validate</ButtonBeta>
      </ModalBeta.Footer>
    </ModalBeta>
  ),
  parameters: {
    docs: { disable: true },
  },
};
