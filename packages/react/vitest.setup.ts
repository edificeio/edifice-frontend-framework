/**
 * DO NOT MODIFY
 */
import { handlers } from '@edifice.io/config';
import '@testing-library/jest-dom/vitest';
import { RenderOptions, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { ReactElement } from 'react';
import { MockedProvider } from './src/providers';

import { afterAll, afterEach, beforeAll } from 'vitest';
import '../../apps/docs/i18n';

const server = setupServer(...handlers);

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'bypass',
  }),
);
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
export { customRender as render };
