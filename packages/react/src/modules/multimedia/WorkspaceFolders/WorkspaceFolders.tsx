import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Loading, SearchBar, Tree } from '../../../components';
import { useWorkspaceFolders, useWorkspaceFoldersTree } from '../../../hooks';
import {
  WORKSPACE_SHARED_FOLDER_ID,
  WORKSPACE_USER_FOLDER_ID,
} from '../../../hooks/useWorkspaceFolders';
import { IconFolderAdd } from '../../icons/components';
import NewFolderForm from './components/NewFolderForm';

interface WorkspaceFoldersProps {
  /**
   * Function called when a folder is selected
   */
  onFolderSelected: (folderId: string, canCopyFileInto: boolean) => void;
}

export default function WorkspaceFolders({
  onFolderSelected,
}: WorkspaceFoldersProps) {
  const { t } = useTranslation();
  const { folders, isLoading, canCopyFileIntoFolder } = useWorkspaceFolders();
  const { foldersTree, filterTree } = useWorkspaceFoldersTree(folders);
  const [searchValue, setSearchValue] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(
    undefined,
  );
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);
  const [
    canCreateFolderIntoSelectedFolder,
    setCanCreateFolderIntoSelectedFolder,
  ] = useState(false);

  // the default user folder Id have to be an empty string to match with the API (parentId property)
  const selectedFolderIdForAPI =
    selectedFolderId === WORKSPACE_USER_FOLDER_ID || !selectedFolderId
      ? ''
      : selectedFolderId;

  useEffect(() => {
    if (selectedFolderId) {
      const canCopyFileInto =
        selectedFolderId === WORKSPACE_USER_FOLDER_ID ||
        (canCopyFileIntoFolder(selectedFolderId) &&
          selectedFolderId !== WORKSPACE_SHARED_FOLDER_ID);
      setCanCreateFolderIntoSelectedFolder(canCopyFileInto);

      onFolderSelected(selectedFolderIdForAPI, canCopyFileInto);
    }
  }, [selectedFolderId]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = () => {
    filterTree(searchValue);
  };

  const handleFolderSelected = (folderId: string) => {
    setShowNewFolderForm(false);

    setSelectedFolderId(folderId);
  };

  const handleNewFolderClick = () => {
    setShowNewFolderForm(true);
  };

  const handleNewFolderCreated = (folderId: string) => {
    handleFolderSelected(folderId);
  };

  return (
    <>
      <div className="d-flex flex-column gap-12">
        <SearchBar
          onChange={handleSearchChange}
          isVariant={false}
          placeholder={t('search')}
          onClick={handleSearchSubmit}
        />
        <div className="border border-gray-400 rounded">
          <div className="p-12">
            {isLoading ? (
              <Loading isLoading className="justify-content-center" />
            ) : (
              <Tree
                nodes={foldersTree}
                onTreeItemClick={handleFolderSelected}
                selectedNodeId={selectedFolderId}
              />
            )}
          </div>

          <div className="d-flex justify-content-end border-top border-gray-400 px-8 py-4 ">
            {!showNewFolderForm && (
              <Button
                color="primary"
                variant="ghost"
                leftIcon={<IconFolderAdd />}
                onClick={handleNewFolderClick}
                disabled={!canCreateFolderIntoSelectedFolder}
              >
                {t('workspace.folder.create')}
              </Button>
            )}

            {showNewFolderForm && selectedFolderId !== undefined && (
              <NewFolderForm
                onClose={() => setShowNewFolderForm(false)}
                folderParentId={selectedFolderIdForAPI}
                onFolderCreated={handleNewFolderCreated}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
