import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Icon } from '..';
import Button from '../Button/Button';
import { useDropzoneContext } from './DropzoneContext';

const DropzoneImport = () => {
  const { t } = useTranslation();
  const { files, inputRef } = useDropzoneContext();

  const hasFiles = files && files.length > 0;

  const classes = clsx('import-wrapper', {
    'd-flex': !hasFiles,
    'd-none': hasFiles,
  });

  return (
    <div className={classes}>
      <Icon name="download" size="48" />
      <p className="my-16">{t('dropzone.text')}</p>
      <Button onClick={() => inputRef?.current?.click()}>
        {t('dropzone.import')}
      </Button>
    </div>
  );
};

DropzoneImport.displayName = 'Dropzone.Import';

export default DropzoneImport;