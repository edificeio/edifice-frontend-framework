import { computePosition, Placement, Platform } from '@floating-ui/react';

import { shiftIntoView } from './useDropdown';

type Rect = { x: number; y: number; width: number; height: number };

/**
 * Minimal floating-ui platform: fixed rects for the trigger, the menu and the
 * clipping area, so the middleware can be tested without a real layout.
 */
const createPlatform = (
  reference: Rect,
  floating: Rect,
  clipping: Rect,
): Platform => ({
  getElementRects: () => ({ reference, floating }),
  getClippingRect: () => clipping,
  getDimensions: () => ({ width: floating.width, height: floating.height }),
});

const position = (
  placement: Placement,
  reference: Rect,
  floatingWidth: number,
  clipping: Rect,
) =>
  computePosition(
    document.createElement('button'),
    document.createElement('div'),
    {
      placement,
      platform: createPlatform(
        reference,
        { x: 0, y: 0, width: floatingWidth, height: 100 },
        clipping,
      ),
      middleware: [shiftIntoView(8)],
    },
  );

const viewport = { x: 0, y: 0, width: 375, height: 800 };

describe('shiftIntoView', () => {
  it('does not move a menu that already fits', async () => {
    const { x } = await position(
      'bottom-start',
      { x: 100, y: 10, width: 50, height: 30 },
      150,
      viewport,
    );

    expect(x).toBe(100);
  });

  it('brings back a bottom-end menu cut on the left, with the gutter', async () => {
    // Right edge of the menu aligned on the trigger at x=200 → starts at -100.
    const { x } = await position(
      'bottom-end',
      { x: 150, y: 10, width: 50, height: 30 },
      300,
      viewport,
    );

    expect(x).toBe(8);
  });

  it('brings back a bottom-start menu cut on the right, with the gutter', async () => {
    const { x } = await position(
      'bottom-start',
      { x: 300, y: 10, width: 50, height: 30 },
      200,
      viewport,
    );

    expect(x).toBe(375 - 8 - 200);
  });

  it('keeps a block menu as wide as a padding-less clipping area aligned', async () => {
    // e.g. a full-width Select in a scrollable modal body without padding.
    const modalBody = { x: 40, y: 0, width: 300, height: 600 };
    const { x } = await position(
      'bottom-start',
      { x: 40, y: 10, width: 300, height: 30 },
      300,
      modalBody,
    );

    expect(x).toBe(40);
  });

  it('shrinks the gutter to the free space left by a wide menu', async () => {
    // 10px of free space: 5px on each side instead of 8px.
    const { x } = await position(
      'bottom-end',
      { x: 300, y: 10, width: 50, height: 30 },
      365,
      viewport,
    );

    expect(x).toBe(5);
  });
});
