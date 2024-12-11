import { Meta, StoryObj } from '@storybook/react';

import useToggle from '../../hooks/useToggle/useToggle';
import { Button } from '../Button';
import Modal from './Modal';
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';
import ModalSubtitle from './ModalSubtitle';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  decorators: [(Story) => <div style={{ height: '25em' }}>{Story()}</div>],
  args: {
    id: 'modal',
    viewport: false,
    scrollable: false,
    size: 'md',
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Modal component for displaying content in an overlay dialog. Supports different sizes, scrollable content, and viewport mode. Includes header, subtitle, body, and footer sections with customizable content and close functionality.',
      },
    },
  },
  subcomponents: {
    ModalHeader,
    ModalSubtitle,
    ModalBody,
    ModalFooter,
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: Story = {
  render: (args) => {
    const [isOpen, toggle] = useToggle(false);

    function handleOpenModal() {
      toggle(true);
    }

    function handleCloseModal() {
      toggle(false);
    }

    return (
      <>
        <Button
          type="button"
          variant="filled"
          color="primary"
          onClick={handleOpenModal}
        >
          Open Modal
        </Button>
        {isOpen && (
          <Modal
            {...args}
            isOpen={isOpen}
            onModalClose={handleCloseModal}
            focusId="validateButtonId"
          >
            <Modal.Header onModalClose={handleCloseModal}>
              Modal Header
            </Modal.Header>
            <Modal.Subtitle>Subtitle or description</Modal.Subtitle>
            <Modal.Body>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                rutrum nunc et mollis varius. Donec quis imperdiet libero. Sed
                eleifend euismod ipsum, et elementum enim ultricies sed. Nunc
                convallis tempus viverra. Mauris faucibus dolor felis, ac
                consectetur purus aliquet id. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Aliquam
                imperdiet neque non neque bibendum, nec gravida sem lobortis.
                Cras mattis congue arcu, dictum dictum velit fermentum eget.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                color="tertiary"
                variant="ghost"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                id="validateButtonId"
                type="button"
                color="primary"
                variant="filled"
                onClick={handleCloseModal}
              >
                Validate
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  },
};

export const Scrollable: Story = {
  render: (args) => {
    const [isOpen, toggle] = useToggle(false);

    function handleOpenModal() {
      toggle(true);
    }

    function handleCloseModal() {
      toggle(false);
    }

    return (
      <>
        <Button
          type="button"
          variant="filled"
          color="primary"
          onClick={handleOpenModal}
        >
          Open Modal
        </Button>
        {isOpen && (
          <Modal
            {...args}
            isOpen={isOpen}
            onModalClose={handleCloseModal}
            focusId="validateButtonId"
          >
            <Modal.Header onModalClose={handleCloseModal}>
              Modal Header
            </Modal.Header>
            <Modal.Subtitle>Subtitle or description</Modal.Subtitle>
            <Modal.Body>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                rutrum nunc et mollis varius. Donec quis imperdiet libero. Sed
                eleifend euismod ipsum, et elementum enim ultricies sed. Nunc
                convallis tempus viverra. Mauris faucibus dolor felis, ac
                consectetur purus aliquet id. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Aliquam
                imperdiet neque non neque bibendum, nec gravida sem lobortis.
                Cras mattis congue arcu, dictum dictum velit fermentum eget.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                rutrum nunc et mollis varius. Donec quis imperdiet libero. Sed
                eleifend euismod ipsum, et elementum enim ultricies sed. Nunc
                convallis tempus viverra. Mauris faucibus dolor felis, ac
                consectetur purus aliquet id. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Aliquam
                imperdiet neque non neque bibendum, nec gravida sem lobortis.
                Cras mattis congue arcu, dictum dictum velit fermentum eget.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                rutrum nunc et mollis varius. Donec quis imperdiet libero. Sed
                eleifend euismod ipsum, et elementum enim ultricies sed. Nunc
                convallis tempus viverra. Mauris faucibus dolor felis, ac
                consectetur purus aliquet id. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Aliquam
                imperdiet neque non neque bibendum, nec gravida sem lobortis.
                Cras mattis congue arcu, dictum dictum velit fermentum eget.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                rutrum nunc et mollis varius. Donec quis imperdiet libero. Sed
                eleifend euismod ipsum, et elementum enim ultricies sed. Nunc
                convallis tempus viverra. Mauris faucibus dolor felis, ac
                consectetur purus aliquet id. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Aliquam
                imperdiet neque non neque bibendum, nec gravida sem lobortis.
                Cras mattis congue arcu, dictum dictum velit fermentum eget.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                rutrum nunc et mollis varius. Donec quis imperdiet libero. Sed
                eleifend euismod ipsum, et elementum enim ultricies sed. Nunc
                convallis tempus viverra. Mauris faucibus dolor felis, ac
                consectetur purus aliquet id. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Aliquam
                imperdiet neque non neque bibendum, nec gravida sem lobortis.
                Cras mattis congue arcu, dictum dictum velit fermentum eget.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                rutrum nunc et mollis varius. Donec quis imperdiet libero. Sed
                eleifend euismod ipsum, et elementum enim ultricies sed. Nunc
                convallis tempus viverra. Mauris faucibus dolor felis, ac
                consectetur purus aliquet id. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Aliquam
                imperdiet neque non neque bibendum, nec gravida sem lobortis.
                Cras mattis congue arcu, dictum dictum velit fermentum eget.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                rutrum nunc et mollis varius. Donec quis imperdiet libero. Sed
                eleifend euismod ipsum, et elementum enim ultricies sed. Nunc
                convallis tempus viverra. Mauris faucibus dolor felis, ac
                consectetur purus aliquet id. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Aliquam
                imperdiet neque non neque bibendum, nec gravida sem lobortis.
                Cras mattis congue arcu, dictum dictum velit fermentum eget.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                rutrum nunc et mollis varius. Donec quis imperdiet libero. Sed
                eleifend euismod ipsum, et elementum enim ultricies sed. Nunc
                convallis tempus viverra. Mauris faucibus dolor felis, ac
                consectetur purus aliquet id. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Aliquam
                imperdiet neque non neque bibendum, nec gravida sem lobortis.
                Cras mattis congue arcu, dictum dictum velit fermentum eget.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                rutrum nunc et mollis varius. Donec quis imperdiet libero. Sed
                eleifend euismod ipsum, et elementum enim ultricies sed. Nunc
                convallis tempus viverra. Mauris faucibus dolor felis, ac
                consectetur purus aliquet id. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Aliquam
                imperdiet neque non neque bibendum, nec gravida sem lobortis.
                Cras mattis congue arcu, dictum dictum velit fermentum eget.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                rutrum nunc et mollis varius. Donec quis imperdiet libero. Sed
                eleifend euismod ipsum, et elementum enim ultricies sed. Nunc
                convallis tempus viverra. Mauris faucibus dolor felis, ac
                consectetur purus aliquet id. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Aliquam
                imperdiet neque non neque bibendum, nec gravida sem lobortis.
                Cras mattis congue arcu, dictum dictum velit fermentum eget.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                color="tertiary"
                variant="ghost"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                id="validateButtonId"
                type="button"
                color="primary"
                variant="filled"
                onClick={handleCloseModal}
              >
                Validate
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  },
  args: {
    id: 'primaryModal',
    size: 'lg',
    scrollable: true,
  },
};

export const FullHeight: Story = {
  render: (args) => {
    const [isOpen, toggle] = useToggle(false);

    function handleOpenModal() {
      toggle(true);
    }

    function handleCloseModal() {
      toggle(false);
    }

    return (
      <>
        <Button
          type="button"
          variant="filled"
          color="primary"
          onClick={handleOpenModal}
        >
          Open Modal
        </Button>
        {isOpen && (
          <Modal
            {...args}
            isOpen={isOpen}
            onModalClose={handleCloseModal}
            focusId="validateButtonId"
            viewport
          >
            <Modal.Header onModalClose={handleCloseModal}>
              Modal Header
            </Modal.Header>
            <Modal.Subtitle>Subtitle or description</Modal.Subtitle>
            <Modal.Body>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                rutrum nunc et mollis varius. Donec quis imperdiet libero. Sed
                eleifend euismod ipsum, et elementum enim ultricies sed. Nunc
                convallis tempus viverra. Mauris faucibus dolor felis, ac
                consectetur purus aliquet id. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Aliquam
                imperdiet neque non neque bibendum, nec gravida sem lobortis.
                Cras mattis congue arcu, dictum dictum velit fermentum eget.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                color="tertiary"
                variant="ghost"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                id="validateButtonId"
                type="button"
                color="primary"
                variant="filled"
                onClick={handleCloseModal}
              >
                Validate
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  },
  args: {
    id: 'primaryModal',
    size: 'lg',
    scrollable: true,
  },
};
