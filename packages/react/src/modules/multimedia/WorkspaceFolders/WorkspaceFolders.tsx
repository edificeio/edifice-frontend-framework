import { useWorkspaceFolders } from '../../../hooks';
import { SearchBar, Tree } from '../../../components';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useState } from 'react';

interface WorkspaceFoldersProps {
  /**
   * Function called when a folder is selected
   */
  onFolderSelected: (folderId: string) => void;
}

export default function WorkspaceFolders({
  onFolderSelected,
}: WorkspaceFoldersProps) {
  const { t } = useTranslation();
  const { folderTree, setSearchValue } = useWorkspaceFolders();
  const [shouldExpandAllNodes, setShouldExpandAllNodes] = useState(false);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchValue(searchValue);
    setShouldExpandAllNodes(searchValue !== '');
  };

  return (
    <div className="d-flex flex-column gap-12">
      <p>{t('attachments.add.to.folder.modal.description')}</p>
      <SearchBar
        onChange={handleSearch}
        isVariant={false}
        placeholder={t('search')}
        onClick={() => alert('ok')}
      />
      <div className="border border-gray-400 rounded">
        <div className="p-12">
          <Tree
            nodes={folderTree}
            onTreeItemClick={onFolderSelected}
            shouldExpandAllNodes={shouldExpandAllNodes}
          />
        </div>
      </div>
    </div>
  );
}
