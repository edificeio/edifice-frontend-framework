import { School } from '@edifice.io/client';
import { buildGarLink } from './utils';

const school = {
  id: 'school-1',
  name: 'MY DEV SCHOOL',
  UAI: '1111888G',
  exports: ['GAR-P0'],
  classes: [],
} as School;

describe('buildGarLink', () => {
  it('builds the GAR link from the school UAI and GAR code, base64-encoded', () => {
    expect(buildGarLink(school)).toBe(
      `https://idp-auth.gar.education.fr/domaineGar?idENT=${btoa('P0')}&idEtab=${btoa('1111888G')}&idRessource=ark:/19496/UVdpWxn8N78r24`,
    );
  });

  it('falls back to the first export when none starts with GAR-', () => {
    expect(buildGarLink({ ...school, exports: ['OTHER-X'] })).toContain(
      `idENT=${btoa('OTHER-X')}&`,
    );
  });

  it('links to the public Édumalin website when no school is selected', () => {
    expect(buildGarLink(undefined)).toBe('https://edumalin.fr/');
  });
});
