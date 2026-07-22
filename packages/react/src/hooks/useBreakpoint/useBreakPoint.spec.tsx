import { useMediaQuery } from '@uidotdev/usehooks';
import { render, screen } from '~/setup';
import useBreakpoint from './useBreakpoint';

vi.mock('@uidotdev/usehooks', () => ({
  useMediaQuery: vi.fn(),
}));

function HookHost() {
  const breakpoint = useBreakpoint();

  return (
    <>
      <span data-testid="xs">{String(breakpoint.xs)}</span>
      <span data-testid="sm">{String(breakpoint.sm)}</span>
      <span data-testid="md">{String(breakpoint.md)}</span>
      <span data-testid="lg">{String(breakpoint.lg)}</span>
      <span data-testid="xl">{String(breakpoint.xl)}</span>
      <span data-testid="xxl">{String(breakpoint.xxl)}</span>
    </>
  );
}

describe('useBreakpoint', () => {
  const mockedUseMediaQuery = vi.mocked(useMediaQuery);

  afterEach(() => {
    mockedUseMediaQuery.mockReset();
  });

  it('detects responsive breakpoints from media query matches', () => {
    mockedUseMediaQuery.mockImplementation(
      (query) =>
        query === 'only screen and (min-width: 0)' ||
        query === 'only screen and (min-width: 375px)' ||
        query === 'only screen and (min-width: 768px)',
    );

    render(<HookHost />);

    expect(screen.getByTestId('xs')).toHaveTextContent('true');
    expect(screen.getByTestId('sm')).toHaveTextContent('true');
    expect(screen.getByTestId('md')).toHaveTextContent('true');
    expect(screen.getByTestId('lg')).toHaveTextContent('false');
    expect(screen.getByTestId('xl')).toHaveTextContent('false');
    expect(screen.getByTestId('xxl')).toHaveTextContent('false');
  });

  it('uses browser media queries for all bootstrap breakpoints', () => {
    mockedUseMediaQuery.mockReturnValue(false);

    render(<HookHost />);

    expect(mockedUseMediaQuery).toHaveBeenCalledTimes(6);
    expect(mockedUseMediaQuery).toHaveBeenNthCalledWith(
      1,
      'only screen and (min-width: 0)',
    );
    expect(mockedUseMediaQuery).toHaveBeenNthCalledWith(
      2,
      'only screen and (min-width: 375px)',
    );
    expect(mockedUseMediaQuery).toHaveBeenNthCalledWith(
      3,
      'only screen and (min-width: 768px)',
    );
    expect(mockedUseMediaQuery).toHaveBeenNthCalledWith(
      4,
      'only screen and (min-width: 1024px)',
    );
    expect(mockedUseMediaQuery).toHaveBeenNthCalledWith(
      5,
      'only screen and (min-width: 1280px)',
    );
    expect(mockedUseMediaQuery).toHaveBeenNthCalledWith(
      6,
      'only screen and (min-width: 1400px)',
    );
  });
});
