import { useEffect } from 'react';

import { odeServices } from '@edifice.io/client';

import { useHasWorkflow } from '../useHasWorkflow';

export default function useCantoo() {
  const hasWorkflow = useHasWorkflow(
    'org.entcore.portal.controllers.PortalController|optionalFeatureCantoo',
  );

  useEffect(() => {
    if (hasWorkflow && !document.getElementById('cantoo-edifice-script')) {
      (async () => {
        const cantooResponse = await odeServices
          .http()
          .get('/optionalFeature/cantoo');
        if (cantooResponse && cantooResponse.scriptPath) {
          const script = document.createElement('script');
          script.id = 'cantoo-edifice-script';
          script.src = cantooResponse.scriptPath;
          script.async = true;
          document.body.appendChild(script);
        }
      })();
    }
  }, [hasWorkflow]);

  return null;
}
