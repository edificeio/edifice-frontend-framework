/**
 * Bookmark header row in the rights list.
 * Displays a collapsible row with batch-edit checkboxes that affect all users in the bookmark.
 */
import { useTranslation } from 'react-i18next';
import {
  IconBookmark,
  IconClose,
  IconRafterDown,
} from '../../modules/icons/components';
import { Button, IconButton } from '../Button';
import { Checkbox } from '../Checkbox';
import {
  BookmarkState,
  ResourceRightName,
  ResourceRights,
} from './types/types';

interface UserRightsBookmarkRowProps {
  bookmark: BookmarkState;
  resourceRights: ResourceRights;
  isReadOnly: boolean;
  onToggleRight: (bookmarkId: string, rightName: ResourceRightName) => void;
  onDelete: (bookmarkId: string) => void;
  onToggleExpand: (bookmarkId: string) => void;
}

const UserRightsBookmarkRow = ({
  bookmark,
  resourceRights,
  isReadOnly,
  onToggleRight,
  onDelete,
  onToggleExpand,
}: UserRightsBookmarkRowProps) => {
  const { t } = useTranslation();

  return (
    <tr data-testid="user-rights-list-bookmark-row">
      <td>
        <IconBookmark />
      </td>
      <td>
        <Button
          color="tertiary"
          variant="ghost"
          className="fw-normal ps-0"
          aria-expanded={bookmark.isExpanded}
          rightIcon={
            <IconRafterDown
              title={bookmark.isExpanded ? t('hide') : t('show')}
              className="w-16 min-w-0"
              style={{
                transition: 'rotate 0.2s ease-out',
                rotate: bookmark.isExpanded ? '-180deg' : '0deg',
              }}
            />
          }
          onClick={() => onToggleExpand(bookmark.id)}
        >
          {bookmark.name}
        </Button>
      </td>
      {Object.entries(resourceRights).map(([rightName]) => (
        <td key={rightName}>
          <Checkbox
            checked={bookmark.permission.includes(rightName)}
            onChange={() =>
              onToggleRight(bookmark.id, rightName as ResourceRightName)
            }
            disabled={isReadOnly}
            aria-label={`${bookmark.name} - ${rightName}`}
            data-testid={`user-rights-list-bookmark-${rightName}-checkbox`}
          />
        </td>
      ))}
      <td>
        {!isReadOnly && (
          <IconButton
            data-testid="user-rights-list-bookmark-close-button"
            color="tertiary"
            onClick={() => onDelete(bookmark.id)}
            icon={<IconClose />}
            title={`${t('close')} ${bookmark.name}`}
            variant="ghost"
          />
        )}
      </td>
    </tr>
  );
};

export default UserRightsBookmarkRow;
