import { render, screen } from '~/setup';

import { ExternalLinker, IExternalLink } from './ExternalLinker';

const setup = (props: Partial<Parameters<typeof ExternalLinker>[0]> = {}) => {
  const onChange = vi.fn<(link?: IExternalLink) => void>();
  const view = render(<ExternalLinker onChange={onChange} {...props} />);
  return { ...view, onChange };
};

const textInput = () => screen.getByLabelText(/Link text/);
const urlInput = () => screen.getByLabelText(/External link URL/);
const newTabCheckbox = () =>
  screen.getByRole('checkbox', { name: 'Open link in a new tab' });

/** The last link reported to the parent, or undefined if it was cleared. */
const lastLink = (onChange: ReturnType<typeof vi.fn>) =>
  onChange.mock.calls.at(-1)?.[0];

describe('ExternalLinker', () => {
  describe('initial state', () => {
    it('starts empty and reports no link', () => {
      const { onChange } = setup();

      expect(textInput()).toHaveValue('');
      expect(urlInput()).toHaveValue('');
      expect(onChange).toHaveBeenCalledWith();
    });

    it('opens in a new tab by default when creating a link', () => {
      setup();

      expect(newTabCheckbox()).toBeChecked();
    });

    it('prefills both fields from the link being edited', () => {
      setup({ link: { url: 'https://edifice.io', text: 'Edifice' } });

      expect(textInput()).toHaveValue('Edifice');
      expect(urlInput()).toHaveValue('https://edifice.io');
    });

    it('reads the target of the link being edited', () => {
      setup({ link: { url: 'https://edifice.io', target: '_blank' } });

      expect(newTabCheckbox()).toBeChecked();
    });

    it('leaves the box unchecked on a link that opens in place', () => {
      setup({ link: { url: 'https://edifice.io' } });

      expect(newTabCheckbox()).not.toBeChecked();
    });
  });

  describe('reporting the link', () => {
    it('clears the link as long as no URL is typed', async () => {
      const { onChange, user } = setup();

      await user.type(textInput(), 'Edifice');

      expect(lastLink(onChange)).toBeUndefined();
    });

    it('reports the URL as soon as it is typed', async () => {
      const { onChange, user } = setup();

      await user.type(urlInput(), 'https://edifice.io');

      expect(lastLink(onChange)).toEqual({
        url: 'https://edifice.io',
        text: 'https://edifice.io',
        target: '_blank',
      });
    });

    it('falls back on the URL as link text', async () => {
      const { onChange, user } = setup();

      await user.type(urlInput(), 'https://edifice.io');

      expect(lastLink(onChange).text).toBe('https://edifice.io');
    });

    it('prefers the typed text over the URL', async () => {
      const { onChange, user } = setup();

      await user.type(urlInput(), 'https://edifice.io');
      await user.type(textInput(), 'Edifice');

      expect(lastLink(onChange).text).toBe('Edifice');
    });

    it('drops the target when the link opens in place', async () => {
      const { onChange, user } = setup();

      await user.type(urlInput(), 'https://edifice.io');
      await user.click(newTabCheckbox());

      expect(lastLink(onChange).target).toBeUndefined();
    });

    it('clears the link again when the URL is emptied', async () => {
      const { onChange, user } = setup();

      await user.type(urlInput(), 'https://edifice.io');
      await user.clear(urlInput());

      expect(lastLink(onChange)).toBeUndefined();
    });
  });

  describe('URL normalisation', () => {
    it('prepends http:// to a bare domain', async () => {
      const { onChange, user } = setup();

      await user.type(urlInput(), 'edifice.io');

      expect(lastLink(onChange).url).toBe('http://edifice.io');
    });

    it('leaves an absolute http URL alone', async () => {
      const { onChange, user } = setup();

      await user.type(urlInput(), 'http://edifice.io');

      expect(lastLink(onChange).url).toBe('http://edifice.io');
    });

    it('leaves an absolute https URL alone', async () => {
      const { onChange, user } = setup();

      await user.type(urlInput(), 'https://edifice.io');

      expect(lastLink(onChange).url).toBe('https://edifice.io');
    });

    it('leaves a local URL alone', async () => {
      const { onChange, user } = setup();

      await user.type(urlInput(), '/blog/id');

      expect(lastLink(onChange).url).toBe('/blog/id');
    });

    it('keeps the raw input in the field, normalising only what is reported', async () => {
      const { onChange, user } = setup();

      await user.type(urlInput(), 'edifice.io');

      expect(urlInput()).toHaveValue('edifice.io');
      expect(lastLink(onChange).url).toBe('http://edifice.io');
    });
  });

  describe('multiple nodes selected', () => {
    it('locks the text field, which no longer applies to a single node', () => {
      setup({ multiNodeSelected: true });

      expect(textInput()).toBeDisabled();
    });

    it('truncates the shown text to twenty characters', () => {
      setup({
        multiNodeSelected: true,
        link: { text: 'A very long selection spanning several nodes' },
      });

      expect(textInput()).toHaveValue('A very long selectio...');
    });

    it('reports the original text, not the truncated one', async () => {
      const { onChange, user } = setup({
        multiNodeSelected: true,
        link: { text: 'A very long selection spanning several nodes' },
      });

      await user.type(urlInput(), 'https://edifice.io');

      expect(lastLink(onChange).text).toBe(
        'A very long selection spanning several nodes',
      );
    });

    it('leaves the text untouched when the selection carries none', () => {
      setup({ multiNodeSelected: true, link: { url: 'https://edifice.io' } });

      expect(textInput()).toHaveValue('');
    });
  });

  it('survives without an onChange callback', async () => {
    const { user } = render(<ExternalLinker />);

    await user.type(urlInput(), 'https://edifice.io');

    expect(urlInput()).toHaveValue('https://edifice.io');
  });
});
