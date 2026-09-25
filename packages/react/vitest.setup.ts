import { handlers } from '@edifice.io/config';
import '@testing-library/jest-dom/vitest';
import { RenderOptions, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { ReactElement } from 'react';
// This file lives outside `src/`, the only directory `tsconfig.lib.json`
// includes - it only joins the TS program transitively (other specs import
// it through the `~/setup` path alias). Editors resolving it directly can
// miss that and lose the ambient `vitest/globals` types, so import the
// vitest lifecycle hooks explicitly instead of relying on globals here.
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import '../../apps/docs/i18n';
import { MockedProvider } from './src/providers/MockedProvider/MockedProvider';

vi.mock('react-pdf', () => ({
  Document: () => null,
  Page: () => null,
}));

// jsdom doesn't implement window.matchMedia — needed by useBreakpoint
// (@uidotdev/usehooks' useMediaQuery), itself used by Toolbar, List,
// BetaSwitch, MessageFlash, UsefulLinksModal and their consumers. Global so
// any test exercising one of them works without repeating this stub itself
// (as ~12 spec files already did, individually, before this).
vi.stubGlobal('matchMedia', (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const user = userEvent.setup();

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return {
    user,
    ...render(ui, { wrapper: MockedProvider, ...options }),
  };
};

export const wrapper = MockedProvider;
export * from '@testing-library/react';
// Named export below intentionally shadows the star-reexported `render`
// above: an explicit named export always wins over a same-named re-export.
export { customRender as render };
