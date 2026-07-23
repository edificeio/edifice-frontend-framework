import { UserProfile } from '@edifice.io/client';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, ButtonBeta, Flex } from '../../../..';
import { IconClass } from '../../../icons/components';
import { HomeCard } from '../HomeCard';
import { useProfileLinks } from './hooks/useProfileLinks';

export type UserSpaceProps = {
  name: string;
  avatar: string;
  profile: UserProfile[number];
  children?: ReactNode;
};

export default function UserSpace({
  name,
  avatar,
  profile,
  children,
}: UserSpaceProps) {
  const { t } = useTranslation();
  const links = useProfileLinks(profile);

  return (
    <HomeCard
      variant="user"
      footer={
        !!links && (
          <Flex>
            {links.map((link, index) => (
              <ButtonBeta
                key={`${link.url}-${index}`}
                size="sm"
                variant="ghost"
                leftIcon={<IconClass />}
                onClick={() => (window.location.href = link.url)}
              >
                {link.text}
              </ButtonBeta>
            ))}
          </Flex>
        )
      }
    >
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
          <div
            data-testid="user-space-profile"
            className={'user-space--profile'}
          >
            {t(profile)}
          </div>
        </Flex>
      </Flex>
      {children && <HomeCard.Content>{children}</HomeCard.Content>}
    </HomeCard>
  );
}

UserSpace.displayName = 'UserSpace';
