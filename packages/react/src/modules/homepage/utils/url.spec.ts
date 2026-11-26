import { isValidHttpUrl } from './url';

describe('isValidHttpUrl', () => {
  it.each([
    'https://lumni.fr',
    'http://lumni.fr',
    'HTTPS://lumni.fr',
    'https://www.lumni.fr/path?query=1#hash',
    'https://sub.domain.example.com:8080/path',
    '  https://lumni.fr  ',
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
