import { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from '../Grid';

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  parameters: {
    docs: {
      description: {
        component:
          'The `Grid` component is the responsive layout container of the design system. It defines a grid of **12 columns on desktop, 8 on tablet and 4 on mobile**, and expects `Grid.Col` children to place content in it. It only carries the grid itself — column spans are declared per breakpoint on each `Grid.Col`. See the `Column` page for the sizing props.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const Base: Story = {
  render: () => {
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
  render: () => {
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
