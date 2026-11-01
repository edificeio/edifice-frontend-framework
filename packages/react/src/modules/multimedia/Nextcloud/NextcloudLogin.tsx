import { useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';

import { Button, Flex } from '../../../components';
import { EmptyScreen } from '../../../components/EmptyScreen';
import { useToast } from '../../../hooks';

import illuConnectionLost from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-connection-lost.svg';

export interface NextcloudLoginProps {
  /**
   * Called once the user is connected through the OAuth2 popup.
   */
  onConnected: () => void;
  /**
   * Replaces the default description, which is about inserting Nextcloud files.
   */
  description?: string;
}

const NextcloudLogin = ({ onConnected, description }: NextcloudLoginProps) => {
  const { t } = useTranslation();
  const toast = useToast();
  const popupRef = useRef<Window | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.data?.type !== 'nextcloud-connected'
      ) {
        return;
      }
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
      onConnected();
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConnected]);

  const openLoginPopup = () => {
    popupRef.current = window.open(
      `${window.location.origin}/nextcloud/user/oauth2/init`,
      '',
      'popup, height=600, width=400',
    );
    if (!popupRef.current) {
      toast.error(t('nextcloud.auth.popupBlocked'));
    }
  };

  return (
    <Flex
      direction="column"
      gap="12"
      className="h-full w-100"
      justify="center"
      align="center"
    >
      <EmptyScreen
        imageSrc={illuConnectionLost}
        title={t('nextcloud.auth.title')}
        text={description ?? t('nextcloud.auth.description')}
      />

      <Button onClick={openLoginPopup}>{t('nextcloud.auth.connect')}</Button>
    </Flex>
  );
};

export default NextcloudLogin;
