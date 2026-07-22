import { UAParser } from 'ua-parser-js';

export default function useBrowserInfo(userAgent?: string) {
  const uaParser = new UAParser(userAgent);

  const os: UAParser.IOS = uaParser.getOS();
  const device: UAParser.IDevice = uaParser.getDevice();
  const browser: UAParser.IBrowser = uaParser.getBrowser();

  const deviceModel = device.model ?? '';
  const isIphone = deviceModel.includes('iPhone');
  const isIpod = deviceModel.includes('iPod');
  const isIpad = deviceModel.includes('iPad');

  return { os, device, browser, isIphone, isIpod, isIpad };
}
