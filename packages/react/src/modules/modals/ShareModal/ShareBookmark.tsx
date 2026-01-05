import { Ref, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Button, FormControl } from '../../../components';
import { IconSave } from '../../icons/components';
import { BookmarkProps } from './hooks/useShareBookmark';

export const ShareBookmark = ({
  bookmark,
  refBookmark,
  onBookmarkChange,
  onSave,
}: {
  bookmark: BookmarkProps;
  refBookmark: Ref<HTMLInputElement>;
  onBookmarkChange: () => void;
  onSave: () => Promise<void>;
}) => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = async () => {
    setIsSaving(true);
    await onSave();
    setIsSaving(false);
  };

  return (
    <div className="mt-16">
      <FormControl
        id="bookmarkName"
        className="d-flex flex-wrap align-items-center gap-16"
      >
        <div className="flex-fill">
          <FormControl.Input
            data-testid="share-bookmark-name-input"
            key={bookmark.id}
            ref={refBookmark}
            onChange={onBookmarkChange}
            placeholder={t('explorer.modal.share.sharebookmark.placeholder')}
            size="sm"
            type="text"
          />
        </div>
        <Button
          data-testid="share-bookmark-save-button"
          type="button"
          color="primary"
          variant="ghost"
          disabled={bookmark.name.length === 0 || isSaving}
          leftIcon={<IconSave />}
          onClick={handleSaveClick}
          className="text-nowrap"
          isLoading={isSaving}
        >
          {t('explorer.modal.share.sharebookmark.save')}
        </Button>
      </FormControl>
    </div>
  );
};
