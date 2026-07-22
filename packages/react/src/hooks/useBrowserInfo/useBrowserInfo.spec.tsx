import useBrowserInfo from './useBrowserInfo';

describe('useBrowserInfo', () => {
  it('detects an iPhone user agent', () => {
    const userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

    const { os, device, browser, isIphone, isIpod, isIpad } =
      useBrowserInfo(userAgent);

    expect(os.name).toBe('iOS');
    expect(device.model).toContain('iPhone');
    expect(browser.name).toBeTruthy();
    expect(isIphone).toBe(true);
    expect(isIpod).toBe(false);
    expect(isIpad).toBe(false);
  });

  it('detects an iPad user agent', () => {
    const userAgent =
      'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

    const { device, isIphone, isIpod, isIpad } = useBrowserInfo(userAgent);

    expect(device.model).toContain('iPad');
    expect(isIphone).toBe(false);
    expect(isIpod).toBe(false);
    expect(isIpad).toBe(true);
  });

  it('detects an iPod user agent', () => {
    const userAgent =
      'Mozilla/5.0 (iPod touch; CPU iPhone OS 12_5_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1';

    const { device, isIphone, isIpod, isIpad } = useBrowserInfo(userAgent);

    expect(device.model).toContain('iPod');
    expect(isIphone).toBe(false);
    expect(isIpod).toBe(true);
    expect(isIpad).toBe(false);
  });

  it('returns all iOS flags as false for a desktop browser user agent', () => {
    const userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';

    const { os, device, browser, isIphone, isIpod, isIpad } =
      useBrowserInfo(userAgent);

    expect(os.name).toBe('Windows');
    expect(device.model).toBeUndefined();
    expect(browser.name).toBe('Chrome');
    expect(isIphone).toBe(false);
    expect(isIpod).toBe(false);
    expect(isIpad).toBe(false);
  });

  it('returns parsed structures when no userAgent is provided', () => {
    const { os, device, browser } = useBrowserInfo();

    expect(os).toBeDefined();
    expect(device).toBeDefined();
    expect(browser).toBeDefined();
  });
});
