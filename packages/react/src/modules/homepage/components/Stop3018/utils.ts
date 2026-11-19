import { Stop3018Audience, Stop3018Link } from './types';

const E_ENFANCE_ADDRESS = 'https://e-enfance.org';

/** Store page of the 3018 app (App Store or Google Play), as in the QR code. */
export const APP_3018_URL = 'https://onelink.to/55nrsk';

const HARASSMENT_LINK = `${E_ENFANCE_ADDRESS}/informer/harcelement-scolaire/`;

/** Resources of the e-Enfance association, per audience. */
export const STOP_3018_LINKS: Record<
  Stop3018Audience,
  Partial<Record<Stop3018Link, string>>
> = {
  student: {
    harassment: HARASSMENT_LINK,
    faq: `${E_ENFANCE_ADDRESS}/f-a-q-conseils-pour-les-jeunes/`,
    quiz: `${E_ENFANCE_ADDRESS}/harcelometre/`,
  },
  relative: {
    harassment: HARASSMENT_LINK,
    faq: `${E_ENFANCE_ADDRESS}/f-a-q-conseils-pour-les-parents/`,
  },
};

/** Opens an e-Enfance resource of the given audience in a new tab. */
export function openStop3018Link(
  audience: Stop3018Audience,
  link: Stop3018Link,
) {
  const url = STOP_3018_LINKS[audience][link];
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
}
