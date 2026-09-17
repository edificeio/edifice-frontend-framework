// mocks/handlers/zendeskGuide
import { http, HttpResponse } from 'msw';

/**
 * Minimal stand-in for the real Zendesk snippet.js: keeps stories fully
 * offline/deterministic (no live call to Zendesk's CDN) while still
 * emulating enough of `zE` (command queue + `webWidget:on` handlers) for
 * `useZendeskGuide`'s open/close wiring to be exercised for real.
 */
const fakeZendeskSnippet = `
(function () {
  var handlers = {};
  function zE(a, b, c) {
    if (typeof a === 'function') {
      a();
      return;
    }
    if (a === 'webWidget:on') {
      handlers[b] = c;
      return;
    }
    if (a === 'webWidget' && (b === 'open' || b === 'close')) {
      if (handlers[b]) handlers[b]();
    }
  }
  zE.setLocale = function () {};
  window.zE = zE;
})();
`;

export const handlers = [
  http.get('/zendeskGuide/config', () =>
    HttpResponse.json({
      key: 'storybook-demo-key',
      color: '#ffc400',
      module: {},
    }),
  ),
  http.get(
    'https://static.zdassets.com/ekr/snippet.js',
    () =>
      new HttpResponse(fakeZendeskSnippet, {
        headers: { 'Content-Type': 'application/javascript' },
      }),
  ),
];
