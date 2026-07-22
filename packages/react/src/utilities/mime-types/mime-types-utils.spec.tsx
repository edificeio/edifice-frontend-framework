import { HEIC_MIME_TYPES } from './mime-types-utils';

describe('HEIC_MIME_TYPES', () => {
  it('lists the HEIC and HEIF MIME types', () => {
    expect(HEIC_MIME_TYPES).toEqual(['image/heic', 'image/heif']);
  });

  it('matches HEIC and HEIF file types', () => {
    expect(HEIC_MIME_TYPES.includes('image/heic')).toBe(true);
    expect(HEIC_MIME_TYPES.includes('image/heif')).toBe(true);
  });

  it('does not match unrelated file types', () => {
    expect(HEIC_MIME_TYPES.includes('image/png')).toBe(false);
    expect(HEIC_MIME_TYPES.includes('image/jpeg')).toBe(false);
  });
});
