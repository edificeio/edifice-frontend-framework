import { useEffect, useState } from 'react';

import { odeServices } from '@edifice.io/client';

import { useEdificeClient } from '../../providers/EdificeClientProvider/EdificeClientProvider.hook';

/** Apply XiTi tracking (navigation). */
export default function useXitiTrackPageLoad() {
  const [xitiStatus, setXitiStatus] = useState<string>('pending');
  const { currentApp } = useEdificeClient();

  useEffect(() => {
    trackPageLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trackPageLoad = async () => {
    if (!currentApp) {
      setXitiStatus('[Xiti] Error, currentApp is not defined.');
      return;
    }
    try {
      await odeServices
        .analytics()
        .trackPageLoad(window.location.pathname, currentApp);
      console.info(`[Xiti] Success tracking page ${window.location.pathname}`);
      setXitiStatus(`[Xiti] Success tracking page ${window.location.pathname}`);
    } catch (e) {
      console.error('[Xiti] Error Tracking Page Load', e);
      setXitiStatus(`[Xiti] Error Tracking Page Load: ${e}`);
    }
  };

  return { xitiStatus };
}
