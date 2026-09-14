import { UsefulLink, UsefulLinkPayload } from '@edifice.io/client';
import { useState } from 'react';

import { useUsefulLinksContainer } from './hooks/useUsefulLinksContainer';
import { LinkForm } from './LinkForm';
import { UsefulLinks } from './UsefulLinks';
import { UsefulLinksModal } from './UsefulLinksModal';

type View =
  | { name: 'closed' }
  | { name: 'manage' }
  | { name: 'add' }
  | { name: 'edit'; link: UsefulLink };

export function UsefulLinksContainer() {
  const [view, setView] = useState<View>({ name: 'closed' });
  const {
    links,
    canAddLink,
    createLink,
    isCreating,
    updateLink,
    isUpdating,
    deleteLink,
  } = useUsefulLinksContainer();

  const closeAll = () => setView({ name: 'closed' });
  const backToManage = () => setView({ name: 'manage' });

  const handleSubmit = async (payload: UsefulLinkPayload) => {
    if (view.name === 'edit') {
      await updateLink(view.link.id, payload);
    } else {
      await createLink(payload);
    }
    backToManage();
  };

  return (
    <>
      <UsefulLinks
        links={links}
        onEditClick={() => setView({ name: 'manage' })}
      />

      <UsefulLinksModal
        isOpen={view.name === 'manage'}
        links={links}
        canAddLink={canAddLink}
        onClose={closeAll}
        onAddClick={() => setView({ name: 'add' })}
        onEditLink={(link) => setView({ name: 'edit', link })}
        onDeleteLink={deleteLink}
      />

      {(view.name === 'add' || view.name === 'edit') && (
        <LinkForm
          mode={view.name}
          link={view.name === 'edit' ? view.link : undefined}
          isSubmitting={view.name === 'edit' ? isUpdating : isCreating}
          onCancel={backToManage}
          onClose={closeAll}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
