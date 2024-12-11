import { useEffect, useState } from 'react';

import { ILinkedResource } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';

import Checkbox from '../../../../components/Checkbox/Checkbox';
import useToggle from '../../../../hooks/useToggle/useToggle';
import { InternalLinker } from '../../Linker/InternalLinker/InternalLinker';
import { useMediaLibraryContext } from '../MediaLibraryContext';

export type InternalLinkTabProps = {
  target?: '_blank' | null;
  appPrefix?: string | null;
  resourceId?: string | null;
};

export type InternalLinkTabResult = {
  target?: '_blank';
  resources?: ILinkedResource[];
};

export const InternalLink = ({
  target,
  resourceId,
  appPrefix,
}: InternalLinkTabProps) => {
  const { t } = useTranslation();
  const { setResult, setResultCounter, appCode, multiple } =
    useMediaLibraryContext();

  const [isChecked, toggleChecked] = useToggle(target === '_blank');
  const [resources, setRessources] = useState<ILinkedResource[]>([]);

  const handleSelect = (resources: ILinkedResource[]) => {
    setRessources(resources);
  };

  useEffect(() => {
    setResult({
      target: isChecked ? '_blank' : undefined,
      resources,
    } as InternalLinkTabResult);
    if (resources && resources.length) {
      setResultCounter(resources.length);
    } else {
      setResultCounter(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecked, resources]);

  return (
    <div className="d-flex flex-column flex-fill gap-16 overflow-hidden">
      <InternalLinker
        appCode={appCode}
        defaultAppCode={appPrefix}
        defaultResourceId={resourceId}
        onSelect={handleSelect}
        multiple={multiple}
      />
      <Checkbox
        className="align-items-center"
        checked={isChecked}
        label={t('bbm.linker.open.tab')}
        onChange={toggleChecked}
      />
    </div>
  );
};
