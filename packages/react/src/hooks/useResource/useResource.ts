import { useEffect, useState } from 'react';

import { IResource, odeServices } from '@edifice.io/client';
import { logger } from '@edifice.io/utilities';

const useResource = (application: string, id: string) => {
  const [resource, setResource] = useState<IResource>(null!);

  useEffect(() => {
    if (id === '') {
      logger.warn('resourceId must be an assetId and not an empty string');
      return;
    }

    (async () => {
      try {
        const response = await odeServices
          .resource(application)
          .searchResource({
            application,
            id,
          });

        setResource(response);
      } catch (error) {
        logger.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return resource;
};

export default useResource;
