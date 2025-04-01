import { useWorkspaceFolders } from '../../../../hooks/useWorkspaceFolders';

import { Tree } from '../../../../components/Tree';
import { useTranslation } from 'react-i18next';

type Props = {
  onFolderSelected: (folderId: string) => void;
};

export default function WorkspaceFoldersTree({ onFolderSelected }: Props) {
  const { t } = useTranslation('common');
  const { folderTree } = useWorkspaceFolders();

  const handleFolderClick = (folderId: string) => {
    onFolderSelected(folderId);
  };

  return (
    <div className="d-flex flex-column gap-12">
      <p>{t('attachments.add.to.folder.description')}</p>

      <div className="border border-gray-400 rounded">
        <div className="p-12">
          <Tree
            nodes={folderTree}
            onTreeItemClick={handleFolderClick}
            shouldExpandAllNodes={true} // => TODO fonctionne pas ?
          />
        </div>
      </div>
    </div>
  );
}
