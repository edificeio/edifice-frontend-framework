import { type ReactNode, useEffect } from 'react';

import { ScreebProvider, useScreeb as useScreebSDK } from '@screeb/sdk-react';

import { useEdificeClient } from '../EdificeClientProvider/EdificeClientProvider.hook';
import { usePublicConf } from '../../hooks/usePublicConf';

type ScreebPublicConf = {
  'screeb-app-id'?: string;
  'screeb-allowed-profiles'?: string[];
};

async function hashUserId(userId: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(userId),
  );
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}

const ScreebInitializer = ({ appId }: { appId: string }) => {
  const { user } = useEdificeClient();
  const { init } = useScreebSDK();

  useEffect(() => {
    if (!user) return;

    hashUserId(user.userId)
      .then((hashedId) =>
        init(appId, hashedId, { profile: user.type }),
      )
      .catch((error) => {
        console.error('Failed to initialize Screeb:', error);
      });
  }, [user, appId, init]);

  return null;
};

export const EdificeScreebProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { appCode, user, userProfile } = useEdificeClient();
  const { data: publicConf } = usePublicConf<ScreebPublicConf>(appCode);

  const appId = publicConf?.['screeb-app-id'];
  const allowedProfiles = publicConf?.['screeb-allowed-profiles'];
  const profileAllowed =
    !allowedProfiles?.length ||
    allowedProfiles.includes(userProfile?.[0] ?? '');

  if (!appId || !user || !profileAllowed) {
    return <>{children}</>;
  }

  return (
    <ScreebProvider>
      <ScreebInitializer appId={appId} />
      {children}
    </ScreebProvider>
  );
};
