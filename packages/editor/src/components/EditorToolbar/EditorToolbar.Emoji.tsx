import { RefAttributes } from 'react';

import { Smiley } from '@edifice.io/icons';
import {
  Dropdown,
  IconButton,
  IconButtonProps,
  Tooltip,
} from '@edifice.io/react';
import EmojiPicker, { Categories } from 'emoji-picker-react';
import { useTranslation } from 'react-i18next';

import { useEditorContext } from '../../hooks/useEditorContext';

interface Props {
  /**
   * Props for the trigger
   */
  triggerProps: JSX.IntrinsicAttributes &
    Omit<IconButtonProps, 'ref'> &
    RefAttributes<HTMLButtonElement>;
  /**
   * Tracks refs on ColorPickers.
   */
  itemRefs: any;
}

export const EditorToolbarEmoji = ({ triggerProps, itemRefs }: Props) => {
  const { t } = useTranslation();
  const { editor } = useEditorContext();

  return (
    <>
      <Tooltip message={t('tiptap.toolbar.emojisPicker')} placement="top">
        <IconButton
          {...triggerProps}
          type="button"
          variant="ghost"
          color="tertiary"
          icon={<Smiley />}
          aria-label={t('tiptap.toolbar.emojisPicker')}
        />
      </Tooltip>
      <Dropdown.Menu>
        <div ref={(el) => (itemRefs.current['emoji-picker'] = el)}>
          <EmojiPicker
            height={400}
            width={316}
            onEmojiClick={(emoji) =>
              editor?.commands.insertContentAt(
                editor.view.state.selection,
                emoji.emoji,
              )
            }
            previewConfig={{ showPreview: false }}
            searchDisabled={true}
            categories={[
              {
                category: Categories.SUGGESTED,
                name: `${t('tiptap.toolbar.emojis.recentlyUsed')}`,
              },
              {
                category: Categories.SMILEYS_PEOPLE,
                name: `${t('tiptap.toolbar.emojis.people')}`,
              },
              {
                category: Categories.ANIMALS_NATURE,
                name: `${t('tiptap.toolbar.emojis.animalsNature')}`,
              },
              {
                category: Categories.FOOD_DRINK,
                name: `${t('tiptap.toolbar.emojis.foodDrink')}`,
              },
              {
                category: Categories.TRAVEL_PLACES,
                name: `${t('tiptap.toolbar.emojis.travelPlaces')}`,
              },
              {
                category: Categories.ACTIVITIES,
                name: `${t('tiptap.toolbar.emojis.activities')}`,
              },
              {
                category: Categories.OBJECTS,
                name: `${t('tiptap.toolbar.emojis.objects')}`,
              },
              {
                category: Categories.SYMBOLS,
                name: `${t('tiptap.toolbar.emojis.symbols')}`,
              },
              {
                category: Categories.FLAGS,
                name: `${t('tiptap.toolbar.emojis.flags')}`,
              },
            ]}
          />
        </div>
      </Dropdown.Menu>
    </>
  );
};
