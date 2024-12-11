import { useEffect, useState } from 'react';

import { IResource, odeServices } from '@edifice.io/client';

const useResource = (application: string, id: string) => {
  const [resource, setResource] = useState<IResource>(null!);

  useEffect(() => {
    if (id === '') {
      console.warn('resourceId must be an assetId and not an empty string');
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
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return resource;
};

export default useResource;
