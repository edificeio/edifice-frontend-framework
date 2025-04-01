import { useWorkspaceFolders } from '../../../../hooks';

import { Tree } from '../../../../components';
import { useTranslation } from 'react-i18next';

type Props = {
  onFolderSelected: (folderId: string) => void;
};

export default function WorkspaceFoldersTree({ onFolderSelected }: Props) {
  const { t } = useTranslation();
  const { folderTree } = useWorkspaceFolders();

  return (
    <div className="d-flex flex-column gap-12">
      <p>{t('attachments.add.to.folder.modal.description')}</p>

      <div className="border border-gray-400 rounded">
        <div className="p-12">
          <Tree
            nodes={folderTree}
            onTreeItemClick={onFolderSelected}
            shouldExpandAllNodes={true}
          />
        </div>
      </div>
    </div>
  );
}
