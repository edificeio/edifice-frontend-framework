import { useState } from 'react';
import Edumalin from './Edumalin';
import EdumalinModal from './EdumalinModal';
import { EdumalinItem } from './types';
import { useEdumalin } from './useEdumalin';

const openInNewTab = (url: string) =>
  window.open(url, '_blank', 'noopener,noreferrer');

export function EdumalinContainer() {
  const { status, items, error, edumalinUrl } = useEdumalin();
  const [selectedItem, setSelectedItem] = useState<EdumalinItem>();

  return (
    <>
      <Edumalin
        status={status}
        items={items}
        error={error}
        onItemClick={setSelectedItem}
        onEdumalinClick={() => openInNewTab(edumalinUrl)}
      />
      {selectedItem && (
        <EdumalinModal
          item={selectedItem}
          onClose={() => setSelectedItem(undefined)}
          onEdumalinClick={() => openInNewTab(edumalinUrl)}
          onActionClick={openInNewTab}
        />
      )}
    </>
  );
}

EdumalinContainer.displayName = 'EdumalinContainer';
