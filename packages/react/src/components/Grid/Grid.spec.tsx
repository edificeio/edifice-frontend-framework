import { render, screen } from '~/setup';
import { Grid } from './Grid';

describe('Grid', () => {
  it('renders its children inside a grid container', () => {
    render(
      <Grid>
        <span>cell</span>
      </Grid>,
    );

    expect(screen.getByText('cell')).toBeInTheDocument();
    expect(document.querySelector('.grid')).toBeInTheDocument();
  });

  it('appends the custom classes to the grid class', () => {
    render(<Grid className="my-grid">content</Grid>);

    expect(document.querySelector('.grid')).toHaveClass('grid', 'my-grid');
  });

  it('forwards the remaining props to the container', () => {
    render(
      <Grid data-testid="the-grid" id="grid-1">
        content
      </Grid>,
    );

    expect(screen.getByTestId('the-grid')).toHaveAttribute('id', 'grid-1');
  });
});

describe('Grid.Col', () => {
  it('sets the mobile span', () => {
    render(<Grid.Col sm="4">cell</Grid.Col>);

    expect(screen.getByText('cell')).toHaveClass('g-col-4');
  });

  it('sets one span class per declared breakpoint', () => {
    render(
      <Grid.Col sm="4" md="6" lg="8" xl="10">
        cell
      </Grid.Col>,
    );

    expect(screen.getByText('cell')).toHaveClass(
      'g-col-4',
      'g-col-md-6',
      'g-col-lg-8',
      'g-col-xl-10',
    );
  });

  it('emits no class for the breakpoints left out', () => {
    render(<Grid.Col sm="4">cell</Grid.Col>);

    const cell = screen.getByText('cell');
    expect(cell.className).toBe('g-col-4');
  });

  it('appends the custom classes to the span ones', () => {
    render(
      <Grid.Col sm="4" className="p-16">
        cell
      </Grid.Col>,
    );

    expect(screen.getByText('cell')).toHaveClass('g-col-4', 'p-16');
  });

  it('renders a div by default', () => {
    render(<Grid.Col sm="4">cell</Grid.Col>);

    expect(screen.getByText('cell').tagName).toBe('DIV');
  });

  it('renders the requested element instead', () => {
    render(
      <Grid.Col sm="4" as="section">
        cell
      </Grid.Col>,
    );

    expect(screen.getByText('cell').tagName).toBe('SECTION');
  });

  it('forwards the remaining props to the column', () => {
    render(
      <Grid.Col sm="4" role="listitem" aria-label="first">
        cell
      </Grid.Col>,
    );

    expect(screen.getByRole('listitem', { name: 'first' })).toBeInTheDocument();
  });

  it('is exposed under a readable display name', () => {
    expect(Grid.displayName).toBe('Grid');
    expect(Grid.Col.displayName).toBe('Grid.Col');
  });
});
