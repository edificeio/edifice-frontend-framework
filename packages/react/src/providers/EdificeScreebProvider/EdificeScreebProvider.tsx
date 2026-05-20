import { type ReactNode, useEffect } from 'react';

import { HooksInit } from '@screeb/sdk-browser';
import { ScreebProvider, useScreeb as useScreebSDK } from '@screeb/sdk-react';

import { logger } from '@edifice.io/utilities';
import { usePublicConf } from '../../hooks/usePublicConf';
import { useEdificeClient } from '../EdificeClientProvider/EdificeClientProvider.hook';

type ScreebPublicConf = {
  'screeb-app-id'?: string;
  'screeb-allowed-profiles'?: string[];
};

export type EdificeScreebProviderProps = {
  children: ReactNode;
  onSurveyDisplayAllowed?: HooksInit['onSurveyDisplayAllowed'];
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

const ScreebInitializer = ({
  appId,
  onSurveyDisplayAllowed,
}: {
  appId: string;
  onSurveyDisplayAllowed?: HooksInit['onSurveyDisplayAllowed'];
}) => {
  const { user } = useEdificeClient();
  const { init, identityReset } = useScreebSDK();

  useEffect(() => {
    if (!user) return;

    const hooks: HooksInit | undefined = onSurveyDisplayAllowed
      ? { version: '1.0.0', onSurveyDisplayAllowed }
      : undefined;

    hashUserId(user.userId)
      .then((hashedId) => init(appId, hashedId, { profile: user.type }, hooks))
      .catch((error) => {
        logger.error('Failed to initialize Screeb:', error);
      });
  }, [user, appId, init, onSurveyDisplayAllowed]);

  useEffect(() => {
    return () => {
      identityReset();
    };
  }, [identityReset]);

  return null;
};

export const EdificeScreebProvider = ({
  children,
  onSurveyDisplayAllowed,
}: EdificeScreebProviderProps) => {
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
      <ScreebInitializer
        appId={appId}
        onSurveyDisplayAllowed={onSurveyDisplayAllowed}
      />
      {children}
    </ScreebProvider>
  );
};
