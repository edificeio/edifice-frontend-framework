import { IconOneProfile } from '../../modules/icons/components/nav';
import { Avatar } from '../Avatar';

const CardUser = ({
  userSrc,
  creatorName,
}: {
  userSrc: string;
  creatorName: string;
}) => {
  return userSrc ? (
    <Avatar
      alt={creatorName || ''}
      size="xs"
      src={userSrc}
      variant="circle"
      width="24"
      height="24"
    />
  ) : (
    <IconOneProfile />
  );
};

CardUser.displayName = 'Card.User';

export default CardUser;
