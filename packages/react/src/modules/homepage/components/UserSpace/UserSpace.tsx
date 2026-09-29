import { UserProfile } from '@edifice.io/client';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, ButtonBeta, Flex, IconButton } from '../../../..';
import { IconAddWidget, IconClass } from '../../../icons/components';
import { HomeCard } from '../HomeCard';
import { useProfileLinks } from './hooks/useProfileLinks';

export type UserSpaceProps = {
  name: string;
  avatar: string;
  profile: UserProfile[number];
  children?: ReactNode;
  /** Renders a trigger button in the top-right corner when provided. */
  onCustomizeWidgetsClick?: () => void;
};

export default function UserSpace({
  name,
  avatar,
  profile,
  children,
  onCustomizeWidgetsClick,
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
      <Flex className={'user-space'} direction="row" justify="between" gap="8">
        <Flex direction="row" gap="8">
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
        {onCustomizeWidgetsClick && (
          <IconButton
            className={'user-space--customize-widgets'}
            icon={<IconAddWidget />}
            variant="ghost"
            color="tertiary"
            aria-label={t(
              'homepage.userSpace.customizeWidgets',
              'Personnaliser mes widgets',
            )}
            onClick={onCustomizeWidgetsClick}
          />
        )}
      </Flex>
      {children && <HomeCard.Content>{children}</HomeCard.Content>}
    </HomeCard>
  );
}

UserSpace.displayName = 'UserSpace';
