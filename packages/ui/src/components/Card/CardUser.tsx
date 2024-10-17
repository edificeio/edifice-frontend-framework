import { OneProfile } from '@edifice.io/icons/nav';

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
    <OneProfile />
  );
};

CardUser.displayName = 'Card.User';

export default CardUser;
