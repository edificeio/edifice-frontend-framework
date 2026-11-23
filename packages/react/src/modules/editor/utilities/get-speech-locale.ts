/** Locale used when the user's language cannot be resolved. */
export const DEFAULT_SPEECH_LOCALE = 'fr-FR';

/**
 * Preferred regional variant for the languages supported by Edifice.
 * Overrides the CLDR "likely subtags" when they don't match our audience
 * (e.g. CLDR resolves `en` to `en-US` and `pt` to `pt-BR`).
 */
const PREFERRED_LOCALES: Record<string, string> = {
  fr: 'fr-FR',
  en: 'en-GB',
  es: 'es-ES',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-PT',
};

/**
 * Resolve a BCP-47 locale (language + region, e.g. `fr-FR`) suitable for the
 * Web Speech API (speech synthesis and recognition) from a user language.
 *
 * - A tag that already has a region is kept, only canonicalized (`pt_br` -> `pt-BR`).
 * - A bare language uses Edifice's preferred variant, or the CLDR likely region.
 * - Anything else falls back to {@link DEFAULT_SPEECH_LOCALE}.
 */
export const getSpeechLocale = (language?: string | null): string => {
  const tag = language?.trim().replace(/_/g, '-');
  if (!tag) return DEFAULT_SPEECH_LOCALE;

  try {
    const locale = new Intl.Locale(tag);
    if (locale.region) return `${locale.language}-${locale.region}`;

    const preferred = PREFERRED_LOCALES[locale.language];
    if (preferred) return preferred;

    const { region } = locale.maximize();
    return region ? `${locale.language}-${region}` : DEFAULT_SPEECH_LOCALE;
  } catch {
    // Invalid language tag.
    return DEFAULT_SPEECH_LOCALE;
  }
};
