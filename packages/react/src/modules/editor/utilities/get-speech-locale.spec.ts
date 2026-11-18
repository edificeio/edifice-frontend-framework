import { describe, expect, it } from 'vitest';

import { DEFAULT_SPEECH_LOCALE, getSpeechLocale } from './get-speech-locale';

describe('getSpeechLocale', () => {
  it.each([
    ['fr', 'fr-FR'],
    ['en', 'en-GB'],
    ['es', 'es-ES'],
    ['de', 'de-DE'],
    ['it', 'it-IT'],
    ['pt', 'pt-PT'],
  ])('maps the Edifice language "%s" to "%s"', (language, expected) => {
    expect(getSpeechLocale(language)).toBe(expected);
  });

  it('is case-insensitive', () => {
    expect(getSpeechLocale('EN')).toBe('en-GB');
  });

  it('keeps an explicit region and canonicalizes it', () => {
    expect(getSpeechLocale('pt-br')).toBe('pt-BR');
    expect(getSpeechLocale('en_US')).toBe('en-US');
  });

  it('resolves the likely region of a language outside the map', () => {
    expect(getSpeechLocale('nl')).toBe('nl-NL');
    expect(getSpeechLocale('ja')).toBe('ja-JP');
  });

  it('does not build a fake region by uppercasing the language', () => {
    // The former hack produced "uk-UK" (not a valid region for Ukrainian).
    expect(getSpeechLocale('uk')).toBe('uk-UA');
  });

  it.each([undefined, null, '', '   ', 'not a locale!'])(
    'falls back to the default locale for %j',
    (language) => {
      expect(getSpeechLocale(language)).toBe(DEFAULT_SPEECH_LOCALE);
    },
  );
});
