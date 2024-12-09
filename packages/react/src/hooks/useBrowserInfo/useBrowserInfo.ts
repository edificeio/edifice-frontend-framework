import UAParser from 'ua-parser-js';

export default function useBrowserInfo(userAgent?: string) {
  const uaParser = new UAParser(userAgent);

  const os: UAParser.IOS = uaParser.getOS();
  const device: UAParser.IDevice = uaParser.getDevice();
  const browser: UAParser.IBrowser = uaParser.getBrowser();

  const isIphone = device.model?.indexOf('iPhone') != -1;
  const isIpod = device.model?.indexOf('iPod') != -1;
  const isIpad = device.model?.indexOf('iPad') != -1;

  return { os, device, browser, isIphone, isIpod, isIpad };
}
