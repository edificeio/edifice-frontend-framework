import { handlers } from '@edifice.io/config';
import '@testing-library/jest-dom/vitest';
import { RenderOptions, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { ReactElement } from 'react';

import '../../apps/docs/i18n';
import { MockedProvider } from './src/providers/MockedProvider/MockedProvider';

vi.mock('react-pdf', () => ({
  Document: () => null,
  Page: () => null,
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
