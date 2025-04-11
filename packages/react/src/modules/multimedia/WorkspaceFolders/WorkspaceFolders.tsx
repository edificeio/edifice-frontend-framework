import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  WORKSPACE_OWNER_FOLDER_ID,
  WORKSPACE_SHARED_FOLDER_ID,
} from '../../../hooks/useWorkspaceFolders';
import { SearchBar, Tree } from '../../../components';
import { useWorkspaceFolders } from '../../../hooks';

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
  const { folderTree, setSearchQuery } = useWorkspaceFolders();
  const [shouldExpandAllNodes, setShouldExpandAllNodes] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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
  };

  return (
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
          <Tree
            nodes={folderTree}
            onTreeItemClick={handleFolderSelected}
            shouldExpandAllNodes={shouldExpandAllNodes}
          />
        </div>
      </div>
    </div>
  );
}
