import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Loading, SearchBar, Tree } from '../../../components';
import { useWorkspaceFolders } from '../../../hooks';
import {
  WORKSPACE_OWNER_FOLDER_ID,
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
  const { folderTree, setSearchQuery, isLoading } = useWorkspaceFolders();
  const [shouldExpandAllNodes, setShouldExpandAllNodes] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(
    undefined,
  );
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchValue);
    setShouldExpandAllNodes(searchValue !== '');
  };

  const handleFolderSelected = (folderId: string) => {
    const selectedFolderId =
      folderId === WORKSPACE_OWNER_FOLDER_ID ? '' : folderId;
    const canCopyFileInto = folderId != WORKSPACE_SHARED_FOLDER_ID;
    onFolderSelected(selectedFolderId, canCopyFileInto);
    setSelectedFolderId(selectedFolderId);
  };

  const handleNewFolderClick = () => {
    console.log('New folder clicked', selectedFolderId);
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
                nodes={folderTree}
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
                disabled={[WORKSPACE_SHARED_FOLDER_ID, undefined].includes(
                  selectedFolderId,
                )}
              >
                {t('workspace.folder.create')}
              </Button>
            )}

            {selectedFolderId != undefined && showNewFolderForm && (
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
