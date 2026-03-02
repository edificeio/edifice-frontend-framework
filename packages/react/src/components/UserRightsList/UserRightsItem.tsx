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
import { ResourceRightName, ResourceRights, SharingItem } from './types/types';

interface UserRightsItemProps {
  item: SharingItem;
  resourceRights: ResourceRights;
  isReadOnly: boolean;
  onChange?: (item: SharingItem, rightName: ResourceRightName) => void;
  onDeleteItem?: (item: SharingItem) => void;
}

const UserRightsItem = ({
  item,
  resourceRights,
  isReadOnly,
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
    <tr key={item.recipientId} data-testid="user-rights-list-item-row">
      <td>
        <Avatar
          src={getAvatarURL(
            item.recipientId,
            item.recipientType === 'bookmark' ? 'group' : item.recipientType,
          )}
          size="xs"
          alt={item.displayName}
          variant="circle"
        />
      </td>
      <td>{item.displayName}</td>
      {Object.entries(resourceRights).map(([rightName]) => (
        <td
          key={rightName}
          data-testid={`user-rights-list-item-${rightName}-checkbox`}
        >
          <Checkbox
            checked={item.permission.includes(rightName)}
            onChange={() => handleChange(rightName as ResourceRightName)}
            disabled={isReadOnly}
          />
        </td>
      ))}
      <td>
        {!isReadOnly && (
          <IconButton
            data-testid="user-rights-list-close-button"
            color="tertiary"
            onClick={() => handleDeleteItem()}
            icon={<IconClose />}
            title={t('close')}
            variant="ghost"
            type="button"
          />
        )}
      </td>
    </tr>
  );
};

export default UserRightsItem;
