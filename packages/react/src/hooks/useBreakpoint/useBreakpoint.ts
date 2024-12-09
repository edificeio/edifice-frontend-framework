import { useMediaQuery } from '@uidotdev/usehooks';

/**
 * Hook based on Bootstrap 5.x breakpoints
 * Respect mobile-first breakpoints
 * @returns $grid-breakpoints: (
  xs: 0,
  sm: 375px,
  md: 768px,
  lg: 1024px,
  xl: 1280px,
  xxl: 1400px,
) !default;
 */
export default function useBreakpoint() {
  return {
    xs: useMediaQuery('only screen and (min-width: 0)'),
    sm: useMediaQuery('only screen and (min-width: 375px)'),
    md: useMediaQuery('only screen and (min-width: 768px)'),
    lg: useMediaQuery('only screen and (min-width: 1024px)'),
    xl: useMediaQuery('only screen and (min-width: 1280px)'),
    xxl: useMediaQuery('only screen and (min-width: 1400px)'),
  };
}
