// jsdom's CSS engine has a severe performance bug resolving the `:modal`,
// `:fullscreen` and `:popover-open` pseudo-classes: floating-ui's
// `isTopLayer()` check (used by the `flip`/`size` middleware behind
// `Dropdown`, `Combobox`, `Select`, `Toolbar`, etc. to support the native
// Popover API) calls `element.matches(':modal')`/`':popover-open'`, which
// under jsdom 25 recurses into itself hundreds of thousands to hundreds of
// millions of times for a single call — turning an instant check into a
// multi-second (sometimes 20s+) stall that blows past vitest's default test
// timeout. None of our components rely on native <dialog>/Popover semantics
// in tests, so short-circuit these selectors to `false` instead of letting
// jsdom resolve them.
const JSDOM_BROKEN_PSEUDO_CLASSES = new Set([
  ':modal',
  ':fullscreen',
  ':popover-open',
]);

const originalMatches = Element.prototype.matches;
Element.prototype.matches = function (selector: string) {
  if (JSDOM_BROKEN_PSEUDO_CLASSES.has(selector)) {
    return false;
  }
  return originalMatches.call(this, selector);
};
