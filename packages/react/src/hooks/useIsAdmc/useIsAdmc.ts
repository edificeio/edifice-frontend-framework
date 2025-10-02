import { useCallback, useEffect, useState } from 'react';

import { odeServices } from '@edifice.io/client';

export default function useIsAdmc() {
  const [isAdmc, setIsAdmc] = useState(false);

  useEffect(() => {
    initIsAdmc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initIsAdmc = useCallback(async () => {
    try {
      const user = await odeServices.session().getUser();
      const hasSuperAdmin = !!(user?.functions && user.functions.SUPER_ADMIN);

      setIsAdmc(Boolean(hasSuperAdmin));
    } catch {
      setIsAdmc(false);
    }
  }, []);

  return {
    isAdmc,
  };
}
