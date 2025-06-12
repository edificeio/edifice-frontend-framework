import { handlers } from '@edifice.io/config';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'bypass',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
