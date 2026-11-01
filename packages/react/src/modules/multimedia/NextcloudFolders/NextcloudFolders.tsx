import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Button, Flex, Loading, Tree } from '../../../components';
import { EmptyScreen } from '../../../components/EmptyScreen';
import { useNextcloudSearch, useUser } from '../../../hooks';
import { IconFolderAdd } from '../../icons/components';
import NextcloudLogin from '../Nextcloud/NextcloudLogin';
import NewFolderForm from './components/NewFolderForm';

import illuError from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-error.svg';

const ROOT_ID = 'root';
const ROOT_PATH = '/';

interface NextcloudFoldersProps {
  /**
   * Function called with the path of the selected folder, relative to the user's Nextcloud root
   */
  onFolderSelected: (path: string) => void;
  /**
   * Description of the login screen shown when the user is not connected to Nextcloud
   */
  loginDescription?: string;
}

export default function NextcloudFolders({
  onFolderSelected,
  loginDescription,
}: NextcloudFoldersProps) {
  const { t } = useTranslation();
  const { user } = useUser();
  const {
    root,
    needsAuth,
    isCheckingAuth,
    isAuthError,
    refetchAuthStatus,
    loadContent,
    loadError,
  } = useNextcloudSearch(ROOT_ID, t('nextcloud'), user?.userId);
  const [selectedFolderId, setSelectedFolderId] = useState<string>();
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);

  const selectedPath =
    selectedFolderId === ROOT_ID ? ROOT_PATH : selectedFolderId;

  useEffect(() => {
    if (!needsAuth) loadContent(ROOT_ID);
  }, [loadContent, needsAuth]);

  const handleFolderSelected = (folderId: string) => {
    setShowNewFolderForm(false);
    setSelectedFolderId(folderId);
    loadContent(folderId);
    onFolderSelected(folderId === ROOT_ID ? ROOT_PATH : folderId);
  };

  const handleFolderCreated = async (path: string) => {
    // The tree can only unfold down to the new folder once its parent lists it.
    await loadContent(selectedFolderId, true);
    setSelectedFolderId(path);
    onFolderSelected(path);
  };

  const handleRetry = () =>
    isAuthError
      ? refetchAuthStatus()
      : loadContent(selectedFolderId ?? ROOT_ID, true);

  if (isCheckingAuth) {
    return <Loading isLoading className="justify-content-center" />;
  }

  if (isAuthError || loadError) {
    return (
      <Flex direction="column" gap="12" align="center">
        <EmptyScreen
          imageSrc={illuError}
          title={t('nextcloud.error.title')}
          text={t('nextcloud.error.description')}
        />
        <Button onClick={handleRetry}>{t('retry')}</Button>
      </Flex>
    );
  }

  if (needsAuth) {
    return (
      <NextcloudLogin
        onConnected={refetchAuthStatus}
        description={loginDescription}
      />
    );
  }

  return (
    <div className="border border-gray-400 rounded">
      <div className="p-12">
        <Tree
          nodes={root}
          selectedNodeId={selectedFolderId}
          showIcon
          onTreeItemClick={handleFolderSelected}
          onTreeItemUnfold={(nodeId) => loadContent(nodeId)}
        />
      </div>

      <div className="d-flex justify-content-end border-top border-gray-400 px-8 py-4">
        {showNewFolderForm && selectedPath ? (
          <NewFolderForm
            parentPath={selectedPath}
            onClose={() => setShowNewFolderForm(false)}
            onFolderCreated={handleFolderCreated}
          />
        ) : (
          <Button
            color="primary"
            variant="ghost"
            leftIcon={<IconFolderAdd />}
            onClick={() => setShowNewFolderForm(true)}
            disabled={!selectedPath}
          >
            {t('workspace.folder.create')}
          </Button>
        )}
      </div>
    </div>
  );
}
