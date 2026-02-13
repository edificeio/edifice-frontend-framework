import { StoryObj } from '@storybook/react';

import { IconDelete, IconDownload } from '../../modules/icons/components';
import { IconButton } from '../Button';
import { Grid } from '../Grid';
import Attachment from './Attachment';

const meta = {
  title: 'Components/Attachment',
  component: Attachment,
  args: {
    name: 'Lorem ipsum',
  },
  parameters: {
    docs: {
      description: {
        component:
          'Attachment is a component that displays a file attachment with its name and action buttons. It provides a consistent way to show attachments with options like download and delete functionality. The component supports customizable action buttons through the options prop.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Attachment>;

export const Base: Story = {
  render: (args) => {
    return (
      <Attachment
        name={args.name}
        options={
          <>
            <IconButton
              aria-label="Add User"
              color="tertiary"
              type="button"
              icon={<IconDownload />}
              variant="ghost"
            />
            <IconButton
              aria-label="Delete"
              color="danger"
              type="button"
              icon={<IconDelete />}
              variant="ghost"
            />
          </>
        }
      />
    );
  },
};

export const EditionMode: Story = {
  render: () => {
    return (
      <Attachment
        name="Attachment Name"
        options={
          <>
            <IconButton
              aria-label="Add User"
              color="tertiary"
              type="button"
              icon={<IconDownload />}
              variant="ghost"
            />
            <IconButton
              aria-label="Delete"
              color="danger"
              type="button"
              icon={<IconDelete />}
              variant="ghost"
            />
          </>
        }
      />
    );
  },
};

export const VisualisationMode: Story = {
  render: () => {
    return (
      <Attachment
        name="Attachment Name"
        options={
          <>
            <IconButton
              aria-label="Add User"
              color="tertiary"
              type="button"
              icon={<IconDownload />}
              variant="ghost"
            />
          </>
        }
      />
    );
  },
};

export const AttachmentTextTruncate: Story = {
  render: () => {
    return (
      <Grid>
        <Grid.Col sm="4">
          <Attachment
            name="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            options={
              <>
                <IconButton
                  aria-label="Add User"
                  color="tertiary"
                  type="button"
                  icon={<IconDownload />}
                  variant="ghost"
                />
                <IconButton
                  aria-label="Delete"
                  color="danger"
                  type="button"
                  icon={<IconDelete />}
                  variant="ghost"
                />
              </>
            }
          />
        </Grid.Col>
        <Grid.Col sm="4">
          <Attachment
            name="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            options={
              <>
                <IconButton
                  aria-label="Add User"
                  color="tertiary"
                  type="button"
                  icon={<IconDownload />}
                  variant="ghost"
                />
                <IconButton
                  aria-label="Delete"
                  color="danger"
                  type="button"
                  icon={<IconDelete />}
                  variant="ghost"
                />
              </>
            }
          />
        </Grid.Col>
      </Grid>
    );
  },
};

export const BlocAttachment: Story = {
  render: () => {
    return (
      <div
        style={{
          backgroundColor: '#F2F2F2',
          borderRadius: '8px',
          padding: '12px',
        }}
      >
        <p className="m-12">Pièce.s jointe.s</p>
        <Grid>
          <Grid.Col sm="4">
            <Attachment
              name="Attachment Name"
              options={
                <>
                  <IconButton
                    aria-label="Add User"
                    color="tertiary"
                    type="button"
                    icon={<IconDownload />}
                    variant="ghost"
                  />
                  <IconButton
                    aria-label="Delete"
                    color="danger"
                    type="button"
                    icon={<IconDelete />}
                    variant="ghost"
                  />
                </>
              }
            />
          </Grid.Col>
          <Grid.Col sm="4">
            <Attachment
              name="Attachment Name"
              options={
                <>
                  <IconButton
                    aria-label="Add User"
                    color="tertiary"
                    type="button"
                    icon={<IconDownload />}
                    variant="ghost"
                  />
                  <IconButton
                    aria-label="Delete"
                    color="danger"
                    type="button"
                    icon={<IconDelete />}
                    variant="ghost"
                  />
                </>
              }
            />
          </Grid.Col>
          <Grid.Col sm="4">
            <Attachment
              name="Attachment Name"
              options={
                <>
                  <IconButton
                    aria-label="Add User"
                    color="tertiary"
                    type="button"
                    icon={<IconDownload />}
                    variant="ghost"
                  />
                  <IconButton
                    aria-label="Delete"
                    color="danger"
                    type="button"
                    icon={<IconDelete />}
                    variant="ghost"
                  />
                </>
              }
            />
          </Grid.Col>
          <Grid.Col sm="4">
            <Attachment
              name="Attachment Name"
              options={
                <>
                  <IconButton
                    aria-label="Add User"
                    color="tertiary"
                    type="button"
                    icon={<IconDownload />}
                    variant="ghost"
                  />
                  <IconButton
                    aria-label="Delete"
                    color="danger"
                    type="button"
                    icon={<IconDelete />}
                    variant="ghost"
                  />
                </>
              }
            />
          </Grid.Col>
        </Grid>
      </div>
    );
  },
};
