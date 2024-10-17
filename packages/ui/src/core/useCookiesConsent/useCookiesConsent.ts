import { useEffect, useState } from 'react';

import { usePreferences } from '../usePreferences';

export default function useCookiesConsent() {
  const [showCookiesConsent, setShowCookiesConsent] = useState<boolean>(false);
  const { getPreference, savePreference } = usePreferences('rgpdCookies');

  useEffect(() => {
    (async () => {
      const res: { showInfoTip: boolean } = await getPreference();
      if (res === null) {
        setShowCookiesConsent(true);
      } else {
        setShowCookiesConsent(res.showInfoTip);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConsultCookies = () => {
    document.location.href = '/userbook/mon-compte';
    savePreference({ showInfoTip: false });
    setShowCookiesConsent(false);
  };

  const handleCloseCookiesConsent = () => {
    savePreference({ showInfoTip: false });
    setShowCookiesConsent(false);
  };

  return {
    showCookiesConsent,
    handleConsultCookies,
    handleCloseCookiesConsent,
  };
}
