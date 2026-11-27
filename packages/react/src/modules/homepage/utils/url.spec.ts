import { isValidHttpUrl } from './url';

describe('isValidHttpUrl', () => {
  it.each([
    'https://lumni.fr',
    'http://lumni.fr',
    'HTTPS://lumni.fr',
    'https://www.lumni.fr/path?query=1#hash',
    'https://sub.domain.example.com:8080/path',
    '  https://lumni.fr  ',
    'https://mon-site.fr',
    'https://sous_domaine.lumni.fr',
    'https://éducation.fr',
    'http://1.1.1.1/page',
  ])('accepts %s', (url) => {
    expect(isValidHttpUrl(url)).toBe(true);
  });

  it.each([
    '',
    '   ',
    'lumni.fr',
    'www.lumni.fr',
    'https://',
    'https://lumni',
    'http://x',
    'https://lumni.',
    'https://.fr',
    'https://lum ni.fr',
    'https://fsd sdf asdf.fr',
    'https://lumni.fr/une page',
    'https://a%20b.fr',
    'https://a!b.fr',
    'https://a$b.fr',
    "https://a'b.fr",
    'https://a{b}.fr',
    'https://a=b.fr',
    'https://-lumni.fr',
    'https://lumni-.fr',
    'https:lumni.fr',
    'https:/lumni.fr',
    'https:\\\\lumni.fr',
    'ftp://lumni.fr',
    'javascript:alert(1)',
    'mailto:contact@lumni.fr',
  ])('rejects %s', (url) => {
    expect(isValidHttpUrl(url)).toBe(false);
  });
});

describe('isValidHttpUrl with allowIntranetHost', () => {
  const options = { allowIntranetHost: true };

  it.each([
    'https://lumni.fr',
    'http://intranet',
    'http://intranet/page?x=1',
    'http://localhost:8090/path',
    'http://[::1]/',
  ])('accepts %s', (url) => {
    expect(isValidHttpUrl(url, options)).toBe(true);
  });

  it.each([
    '',
    'intranet',
    'https://',
    'https:intranet',
    'https://intra net',
    'https://intra!net',
    'https://intranet.',
    'ftp://intranet',
  ])('rejects %s', (url) => {
    expect(isValidHttpUrl(url, options)).toBe(false);
  });
});

describe('isValidHttpUrl in a Chrome-like engine', () => {
  // Chrome's URL parser accepts "https://a b.fr" and exposes the host as
  // "a%20b.fr", where Node and jsdom throw. Mimic that hostname to check the
  // host itself is validated, whatever the engine.
  const NativeURL = URL;

  class ChromeLikeURL extends NativeURL {
    chromeHostname: string;

    constructor(input: string) {
      const encoded = input.replace(/ /g, '%20');
      super(encoded.replace(/%20/g, ''));
      this.chromeHostname = (
        /^https?:\/\/([^/?#]*)/i.exec(encoded)?.[1] ?? ''
      ).toLowerCase();
    }

    override get hostname() {
      return this.chromeHostname;
    }
  }

  beforeEach(() => {
    vi.stubGlobal('URL', ChromeLikeURL);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exposes the encoded host like Chrome does', () => {
    expect(new URL('https://fsd sdf asdf.fr').hostname).toBe(
      'fsd%20sdf%20asdf.fr',
    );
  });

  it.each([
    ['https://fsd%20sdf%20asdf.fr', {}],
    ['https://fsd%20sdf%20asdf.fr', { allowIntranetHost: true }],
    ['http://intra%20net', { allowIntranetHost: true }],
  ])('rejects %s (%o)', (url, options) => {
    expect(isValidHttpUrl(url, options)).toBe(false);
  });

  it('still accepts a valid URL', () => {
    expect(isValidHttpUrl('https://lumni.fr')).toBe(true);
  });
});
