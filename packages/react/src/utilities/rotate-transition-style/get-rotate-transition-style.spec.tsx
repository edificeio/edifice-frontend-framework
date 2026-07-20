import { getRotateTransitionStyle } from './get-rotate-transition-style';

describe('getRotateTransitionStyle', () => {
  it('returns 0deg rotation when closed with default options', () => {
    const style = getRotateTransitionStyle(false);
    expect(style.rotate).toBe('0deg');
  });

  it('returns the default -180deg rotation when open', () => {
    const style = getRotateTransitionStyle(true);
    expect(style.rotate).toBe('-180deg');
  });

  it('uses the default 0.2s transition duration', () => {
    const style = getRotateTransitionStyle(false);
    expect(style.transition).toBe('rotate 0.2s ease-out');
  });

  it('applies a custom degrees value when open', () => {
    const style = getRotateTransitionStyle(true, { degrees: 90 });
    expect(style.rotate).toBe('90deg');
  });

  it('applies a custom degrees value when closed (always 0deg)', () => {
    const style = getRotateTransitionStyle(false, { degrees: 90 });
    expect(style.rotate).toBe('0deg');
  });

  it('applies a custom duration to the transition', () => {
    const style = getRotateTransitionStyle(false, { duration: 0.5 });
    expect(style.transition).toBe('rotate 0.5s ease-out');
  });

  it('applies both custom degrees and custom duration', () => {
    const style = getRotateTransitionStyle(true, {
      degrees: 45,
      duration: 0.3,
    });
    expect(style.rotate).toBe('45deg');
    expect(style.transition).toBe('rotate 0.3s ease-out');
  });

  it('works with negative custom degrees', () => {
    const style = getRotateTransitionStyle(true, { degrees: -90 });
    expect(style.rotate).toBe('-90deg');
  });

  it('works with zero degrees', () => {
    const style = getRotateTransitionStyle(true, { degrees: 0 });
    expect(style.rotate).toBe('0deg');
  });
});
