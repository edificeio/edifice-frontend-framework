import { act } from 'react';
import { render, screen } from '~/setup';
import { Masonry } from './Masonry';

const GAP = 16;
const heights: Record<string, number> = { a: 100, b: 40, c: 60 };
let resizeCallbacks: Array<() => void> = [];

beforeEach(() => {
  resizeCallbacks = [];
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(cb: () => void) {
        resizeCallbacks.push(cb);
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({
    columnGap: `${GAP}px`,
  } as CSSStyleDeclaration);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: HTMLElement) {
      const id = this.textContent ?? '';
      return { height: heights[id] ?? 0 } as DOMRect;
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const items = ['a', 'b', 'c'].map((id) => <div key={id}>{id}</div>);
const itemEl = (index: number) => screen.getByTestId(`masonry-item-${index}`);

describe('Masonry', () => {
  it('lays the items out in two equal columns by default', () => {
    render(<Masonry data-testid="grid">{items}</Masonry>);

    const grid = screen.getByTestId('grid');
    expect(grid.style.display).toBe('grid');
    expect(grid.style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
    expect(grid).toHaveClass('masonry', 'column-gap-16');
  });

  it('supports any number of columns', () => {
    render(
      <Masonry columns={3} gap="8" data-testid="grid">
        {items}
      </Masonry>,
    );

    const grid = screen.getByTestId('grid');
    expect(grid.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
    expect(grid).toHaveClass('column-gap-8');
  });

  it('falls back to a single column for an invalid column count', () => {
    render(
      <Masonry columns={0} data-testid="grid">
        {items}
      </Masonry>,
    );

    expect(screen.getByTestId('grid').style.gridTemplateColumns).toBe(
      'repeat(1, minmax(0, 1fr))',
    );
  });

  it('keeps the items in the DOM in the order they were given', () => {
    render(<Masonry>{items}</Masonry>);

    expect([0, 1, 2].map((i) => itemEl(i).textContent)).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('makes each item span its height plus the gap', () => {
    render(<Masonry>{items}</Masonry>);

    expect(itemEl(0).style.gridRowEnd).toBe(`span ${100 + GAP}`);
    expect(itemEl(1).style.gridRowEnd).toBe(`span ${40 + GAP}`);
    expect(itemEl(2).style.gridRowEnd).toBe(`span ${60 + GAP}`);
  });

  it('updates the span of an item that grows after mount', () => {
    render(<Masonry>{items}</Masonry>);

    heights.b = 300;
    act(() => resizeCallbacks.forEach((cb) => cb()));

    expect(itemEl(1).style.gridRowEnd).toBe(`span ${300 + GAP}`);
    expect([0, 1, 2].map((i) => itemEl(i).textContent)).toEqual([
      'a',
      'b',
      'c',
    ]);
    heights.b = 40;
  });

  it('lets an item span several columns', () => {
    render(
      <Masonry>
        <Masonry.Item span={2}>
          <div>a</div>
        </Masonry.Item>
        <div>b</div>
      </Masonry>,
    );

    expect(itemEl(0).style.gridColumn).toBe('span 2');
    expect(itemEl(1).style.gridColumn).toBe('span 1');
    expect(itemEl(0).textContent).toBe('a');
  });

  it('caps the span of an item to the number of columns', () => {
    render(
      <Masonry columns={1}>
        <Masonry.Item span={3}>
          <div>a</div>
        </Masonry.Item>
      </Masonry>,
    );

    expect(itemEl(0).style.gridColumn).toBe('span 1');
  });

  it('renders without crashing when ResizeObserver is unavailable', () => {
    vi.stubGlobal('ResizeObserver', undefined);

    render(<Masonry>{items}</Masonry>);

    expect(itemEl(0)).toBeInTheDocument();
  });

  it('renders no item when there is no child', () => {
    render(<Masonry data-testid="grid">{null}</Masonry>);

    expect(screen.getByTestId('grid').children).toHaveLength(0);
  });

  it('appends the custom classes and forwards the remaining props', () => {
    render(
      <Masonry className="my-masonry" data-testid="the-masonry">
        {items}
      </Masonry>,
    );

    expect(screen.getByTestId('the-masonry')).toHaveClass(
      'masonry',
      'my-masonry',
    );
  });

  it('is exposed under a readable display name', () => {
    expect(Masonry.displayName).toBe('Masonry');
    expect(Masonry.Item.displayName).toBe('Masonry.Item');
  });
});
