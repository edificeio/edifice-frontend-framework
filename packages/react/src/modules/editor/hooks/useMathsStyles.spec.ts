import { renderHook } from '~/setup';
import { useMathsStyles } from './useMathsStyles';

// Same hardcoded CDN URL as in the hook implementation.
const katexURL =
  'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css';

describe('useMathsStyles', () => {
  afterEach(() => {
    // Defensively clean up any <link> appended to document.head so this
    // test does not leak state into other spec files.
    document.head
      .querySelectorAll(`link[href="${katexURL}"]`)
      .forEach((link) => link.remove());
  });

  it('appends a katex stylesheet link when none exists yet', () => {
    expect(document.head.querySelector(`link[href="${katexURL}"]`)).toBeNull();

    renderHook(() => useMathsStyles());

    const link = document.head.querySelector(`link[href="${katexURL}"]`);
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute('rel', 'stylesheet');
    expect(link).toHaveAttribute('type', 'text/css');
  });

  it('does not append a duplicate link when one already exists', () => {
    const existingLink = document.createElement('link');
    existingLink.href = katexURL;
    existingLink.rel = 'stylesheet';
    existingLink.type = 'text/css';
    document.head.appendChild(existingLink);

    renderHook(() => useMathsStyles());

    expect(
      document.head.querySelectorAll(`link[href="${katexURL}"]`),
    ).toHaveLength(1);
  });
});
