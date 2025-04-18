import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Loading, SearchBar, Tree } from '../../../components';
import { useWorkspaceFolders, useWorkspaceFoldersTree } from '../../../hooks';
import {
  WORKSPACE_USER_FOLDER_ID,
  WORKSPACE_SHARED_FOLDER_ID,
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
  const [shouldExpandAllNodes, setShouldExpandAllNodes] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(
    undefined,
  );
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);
  const [
    canCreateFolderIntoSelectedFolder,
    setCanCreateFolderIntoSelectedFolder,
  ] = useState(false);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = () => {
    filterTree(searchValue);
    setShouldExpandAllNodes(searchValue !== '');
  };

  const handleFolderSelected = (folderId: string) => {
    const newSelectedFolderId =
      folderId === WORKSPACE_USER_FOLDER_ID ? '' : folderId;

    const canCopyFileInto =
      folderId === WORKSPACE_USER_FOLDER_ID ||
      (canCopyFileIntoFolder(folderId) &&
        folderId !== WORKSPACE_SHARED_FOLDER_ID);

    setCanCreateFolderIntoSelectedFolder(canCopyFileInto);
    setSelectedFolderId(newSelectedFolderId);
    onFolderSelected(newSelectedFolderId, canCopyFileInto);
  };

  const handleNewFolderClick = () => {
    setShowNewFolderForm(true);
  };

  return (
    <>
      <div className="d-flex flex-column gap-12">
        <p>{t('attachments.add.to.folder.modal.description')}</p>
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
                shouldExpandAllNodes={shouldExpandAllNodes}
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

            {showNewFolderForm && selectedFolderId && (
              <NewFolderForm
                onClose={() => setShowNewFolderForm(false)}
                folderParentId={selectedFolderId}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
