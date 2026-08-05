import { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from '../Grid';

const meta: Meta<typeof Grid.Col> = {
  title: 'Layout/Grid/Column',
  component: Grid.Col,
  parameters: {
    docs: {
      description: {
        component:
          'The `Grid.Col` component declares a cell inside a `Grid`. Its span is set per breakpoint: `sm` (mobile, required) and the optional `md` (tablet), `lg` (small desktop) and `xl` (large desktop) — each value being a number of columns within the 4/8/12 track counts of the grid. When a breakpoint is omitted, the column keeps the span of the smaller one. It is polymorphic through the `as` prop, so a column can be rendered as a `section`, an `article` or any other element instead of a `div` when the semantics call for it.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Grid.Col>;

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
