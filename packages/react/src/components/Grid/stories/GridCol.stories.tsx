import { Meta, StoryObj } from '@storybook/react';
import { Grid } from '../Grid';

const meta: Meta<typeof Grid.Col> = {
  title: 'Layout/Grid/Column',
  component: Grid.Col,
};

export default meta;
type Story = StoryObj<typeof Grid.Col>;

export const Base: Story = {
  render: (args) => {
    return (
      <Grid>
        <Grid.Col
          sm="1"
          style={{
            backgroundColor: '#ebebeb',
            padding: '.8rem',
            minHeight: '10rem',
          }}
        >
          1
        </Grid.Col>
        <Grid.Col
          sm="1"
          style={{
            backgroundColor: '#ebebeb',
            padding: '.8rem',
            minHeight: '10rem',
          }}
        >
          1
        </Grid.Col>
        <Grid.Col
          sm="1"
          style={{
            backgroundColor: '#ebebeb',
            padding: '.8rem',
            minHeight: '10rem',
          }}
        >
          1
        </Grid.Col>
        <Grid.Col
          sm="1"
          style={{
            backgroundColor: '#ebebeb',
            padding: '.8rem',
            minHeight: '10rem',
          }}
        >
          1
        </Grid.Col>
        <Grid.Col
          sm="1"
          style={{
            backgroundColor: '#ebebeb',
            padding: '.8rem',
            minHeight: '10rem',
          }}
        >
          1
        </Grid.Col>
        <Grid.Col
          sm="1"
          style={{
            backgroundColor: '#ebebeb',
            padding: '.8rem',
            minHeight: '10rem',
          }}
        >
          1
        </Grid.Col>
        <Grid.Col
          sm="1"
          style={{
            backgroundColor: '#ebebeb',
            padding: '.8rem',
            minHeight: '10rem',
          }}
        >
          1
        </Grid.Col>
        <Grid.Col
          sm="1"
          style={{
            backgroundColor: '#ebebeb',
            padding: '.8rem',
            minHeight: '10rem',
          }}
        >
          1
        </Grid.Col>
        <Grid.Col
          sm="1"
          style={{
            backgroundColor: '#ebebeb',
            padding: '.8rem',
            minHeight: '10rem',
          }}
        >
          1
        </Grid.Col>
        <Grid.Col
          sm="1"
          style={{
            backgroundColor: '#ebebeb',
            padding: '.8rem',
            minHeight: '10rem',
          }}
        >
          1
        </Grid.Col>
        <Grid.Col
          sm="1"
          style={{
            backgroundColor: '#ebebeb',
            padding: '.8rem',
            minHeight: '10rem',
          }}
        >
          1
        </Grid.Col>
        <Grid.Col
          sm="1"
          style={{
            backgroundColor: '#ebebeb',
            padding: '.8rem',
            minHeight: '10rem',
          }}
        >
          1
        </Grid.Col>
      </Grid>
    );
  },
};

export const Responsive: Story = {
  render: (args) => {
    return (
      <Grid>
        <Grid.Col
          sm="4"
          style={{ backgroundColor: '#ebebeb', padding: '.8rem' }}
        >
          <p>Size of 4 columns for each breakpoint (small, medium, large)</p>
        </Grid.Col>
        <Grid.Col
          sm="4"
          md="6"
          lg="8"
          style={{ backgroundColor: '#ebebeb', padding: '.8rem' }}
        >
          <p>Size of 4 columns on Mobile, 6 on Tablet, 8 on Desktop</p>
        </Grid.Col>
      </Grid>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          'We can reassign the size of a column with `sm`, `md`, `lg` props.',
      },
    },
  },
};
