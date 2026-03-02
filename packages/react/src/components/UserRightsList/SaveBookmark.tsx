/**
 * Form to save the current sharing configuration as a bookmark.
 * Input for the bookmark name and a save button that calls onSave.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconSave } from '../../modules/icons/components';
import { Button } from '../Button';
import { FormControl } from '../Form';

interface SaveBookmarkProps {
  onSave: (bookmarkName: string) => Promise<void>;
}

export const SaveBookmark = ({ onSave }: SaveBookmarkProps) => {
  const [bookmarkName, setBookmarkName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation();

  const handleBookmarkNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookmarkName(e.target.value);
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    await onSave(bookmarkName);
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
            data-testid="common-save-bookmark-name-input"
            value={bookmarkName}
            onChange={handleBookmarkNameChange}
            placeholder={t('explorer.modal.share.sharebookmark.placeholder')}
            size="sm"
            type="text"
          />
        </div>
        <Button
          data-testid="common-save-bookmark-save-button"
          type="button"
          color="primary"
          variant="ghost"
          disabled={bookmarkName.length === 0 || isSaving}
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
