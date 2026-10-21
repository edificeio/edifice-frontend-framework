import { useState } from 'react';

import { useRssContainer } from './hooks/useRssContainer';
import { Rss } from './Rss';
import { RssFeedForm } from './RssFeedForm';
import { RssFeedsModal } from './RssFeedsModal';
import { RssFeed, RssFeedPayload } from './types';

type View =
  | { name: 'closed' }
  | { name: 'manage' }
  | { name: 'add' }
  | { name: 'edit'; index: number; feed: RssFeed };

export function RssContainer() {
  const [view, setView] = useState<View>({ name: 'closed' });
  const {
    feeds,
    isLoading,
    canAddFeed,
    selectedIndex,
    selectFeed,
    articles,
    articlesStatus,
    addFeed,
    updateFeed,
    deleteFeed,
    isSaving,
  } = useRssContainer();

  const closeAll = () => setView({ name: 'closed' });
  const backToManage = () => setView({ name: 'manage' });

  // On failure the form stays open so the user doesn't lose their input.
  const handleSubmit = (payload: RssFeedPayload) => {
    if (view.name === 'edit') {
      updateFeed(view.index, payload, backToManage);
    } else {
      addFeed(payload, backToManage);
    }
  };

  return (
    <>
      <Rss
        feeds={feeds}
        isLoading={isLoading}
        selectedIndex={selectedIndex}
        onSelectFeed={selectFeed}
        articles={articles}
        articlesStatus={articlesStatus}
        onEditClick={() => setView({ name: 'manage' })}
      />

      <RssFeedsModal
        isOpen={view.name === 'manage'}
        feeds={feeds}
        canAddFeed={canAddFeed}
        onClose={closeAll}
        onAddClick={() => setView({ name: 'add' })}
        onEditFeed={(index) =>
          setView({ name: 'edit', index, feed: feeds[index] })
        }
        onDeleteFeed={deleteFeed}
      />

      {(view.name === 'add' || view.name === 'edit') && (
        <RssFeedForm
          mode={view.name}
          feed={view.name === 'edit' ? view.feed : undefined}
          isSubmitting={isSaving}
          onCancel={backToManage}
          onClose={closeAll}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
