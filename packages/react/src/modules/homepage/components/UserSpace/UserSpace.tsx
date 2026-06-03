import { UserProfile } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import { Avatar, Flex } from '../../../..';

export type UserSpaceProps = {
  name: string;
  avatar: string;
  profile: UserProfile[number];
};

export default function UserSpace({ name, avatar, profile }: UserSpaceProps) {
  const { t } = useTranslation();

  return (
    <Flex className={'user-space'} direction="row" gap="8">
      <Avatar
        className={'user-space--avatar'}
        size={'auto'}
        alt={name}
        src={avatar}
        variant="circle"
      />
      <Flex direction="column">
        <div data-testid="user-space-name" className={'user-space--name'}>
          {name}
        </div>
        <div data-testid="user-space-profile" className={'user-space--profile'}>
          {t(profile)}
        </div>
      </Flex>
    </Flex>
  );
}

UserSpace.displayName = 'UserSpace';
