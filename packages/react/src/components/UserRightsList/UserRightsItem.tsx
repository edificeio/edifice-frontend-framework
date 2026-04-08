/**
 * A single row in the rights list: avatar, name, one checkbox per right, remove button.
 * Used for the owner (read-only) and for each sharing (editable when not readOnly).
 */
import { useTranslation } from 'react-i18next';
import { useDirectory } from '../../hooks';
import { IconClose } from '../../modules/icons/components';
import { Avatar } from '../Avatar';
import { IconButton } from '../Button';
import { Checkbox } from '../Checkbox';
import { AvatarType } from '../../types';
import { ResourceRightName, ResourceRights, SharingItem } from './types/types';

interface UserRightsItemProps {
  item: SharingItem;
  resourceRights: ResourceRights;
  isReadOnly: boolean;
  isDeletable?: boolean;
  rowClassName?: string;
  bookmarkName?: string;
  onChange?: (item: SharingItem, rightName: ResourceRightName) => void;
  onDeleteItem?: (item: SharingItem) => void;
}

const UserRightsItem = ({
  item,
  resourceRights,
  isReadOnly,
  isDeletable = true,
  rowClassName,
  bookmarkName,
  onChange,
  onDeleteItem,
}: UserRightsItemProps) => {
  const { getAvatarURL } = useDirectory();
  const { t } = useTranslation();

  const handleChange = (rightName: ResourceRightName) => {
    onChange?.(item, rightName);
  };

  const handleDeleteItem = () => {
    onDeleteItem?.(item);
  };

  return (
    <tr
      data-testid="user-rights-list-item-row"
      className={rowClassName}
      aria-label={
        bookmarkName ? `${item.displayName} - ${bookmarkName}` : undefined
      }
    >
      <td>
        <Avatar
          src={getAvatarURL(item.recipientId, item.recipientType as AvatarType)}
          size="xs"
          alt={item.displayName}
          variant="circle"
        />
      </td>
      <td>{item.displayName}</td>
      {Object.entries(resourceRights).map(([rightName, rightDef]) => (
        <td
          key={rightName}
          data-testid={`user-rights-list-item-${rightName}-checkbox`}
        >
          <Checkbox
            checked={
              rightDef.isReadOnlyCheckbox ?? item.permission.includes(rightName)
            }
            onChange={() => handleChange(rightName as ResourceRightName)}
            disabled={isReadOnly}
            aria-label={`${item.displayName} - ${rightName}`}
          />
        </td>
      ))}
      <td>
        {!isReadOnly && isDeletable && (
          <IconButton
            data-testid="user-rights-list-close-button"
            color="tertiary"
            onClick={() => handleDeleteItem()}
            icon={<IconClose />}
            title={`${t('close')} ${item.displayName}`}
            variant="ghost"
            type="button"
          />
        )}
      </td>
    </tr>
  );
};

export default UserRightsItem;
