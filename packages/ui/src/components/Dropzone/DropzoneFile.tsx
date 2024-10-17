import { ReactNode } from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Plus } from '../../../../icons/dist';

import { useMediaLibraryContext } from '../../multimedia/MediaLibrary/MediaLibraryContext';
import Button from '../Button/Button';
import { useDropzoneContext } from './DropzoneContext';

const DropzoneFile = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { files, inputRef } = useDropzoneContext();

  const { multiple } = useMediaLibraryContext();

  const hasFiles = files && files.length > 0;

  const classes = clsx('drop-file-wrapper', {
    'd-block': hasFiles,
    'd-none': !hasFiles,
  });

  return (
    <div className={classes}>
      <div className="drop-file-content">
        <div className="add-button p-4">
          <Button
            variant="ghost"
            leftIcon={<Plus></Plus>}
            disabled={!multiple}
            onClick={() => inputRef?.current?.click()}
          >
            {t('dropzone.add.more')}
          </Button>
        </div>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
};

DropzoneFile.displayName = 'Dropzone.File';

export default DropzoneFile;
