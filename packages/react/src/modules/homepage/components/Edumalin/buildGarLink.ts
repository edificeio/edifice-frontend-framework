import { School } from '@edifice.io/client';

const EDUMALIN_GAR_URL =
  'https://idp-auth.gar.education.fr/domaineGar?idENT=ID_ENT&idEtab=ID_ETAB&idRessource=ark:/19496/UVdpWxn8N78r24';

const EDUMALIN_PUBLIC_URL = 'https://edumalin.fr/';

/**
 * Édumalin is reached through the GAR, which logs the user in when given the
 * school UAI and the GAR code taken from its exports, both base64-encoded.
 * Without a school, the user lands on the public website instead.
 */
export function buildGarLink(school?: School): string {
  if (!school) return EDUMALIN_PUBLIC_URL;

  const schoolExports = school.exports ?? [];
  const garExport = schoolExports.find((entry) => entry.startsWith('GAR-'));
  const garCode = garExport
    ? garExport.replace('GAR-', '')
    : (schoolExports[0] ?? '');

  return EDUMALIN_GAR_URL.replace('ID_ETAB', btoa(school.UAI ?? '')).replace(
    'ID_ENT',
    btoa(garCode),
  );
}
