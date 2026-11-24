import { UserProfile } from '@edifice.io/client';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  ButtonBeta,
  Flex,
  IconButton,
  Skeleton,
  VisuallyHidden,
} from '../../../..';
import { IconAddWidget, IconClass } from '../../../icons/components';
import { HomeCard } from '../HomeCard';
import { useProfileLinks } from './hooks/useProfileLinks';

const SKELETON_LINK_COUNT = 2;

export type UserSpaceProps = {
  name: string;
  avatar: string;
  profile: UserProfile[number];
  children?: ReactNode;
  /** Renders a trigger button in the top-right corner when provided. */
  onCustomizeWidgetsClick?: () => void;
  isLoading?: boolean;
};

export default function UserSpace({
  name,
  avatar,
  profile,
  children,
  onCustomizeWidgetsClick,
  isLoading = false,
}: UserSpaceProps) {
  const { t } = useTranslation();
  const links = useProfileLinks(profile);

  if (isLoading) {
    return (
      <HomeCard
        variant="user"
        footer={
          <div className="user-space__links-skeleton">
            {Array.from({ length: SKELETON_LINK_COUNT }, (_, index) => (
              <Skeleton
                key={index}
                variant="pill"
                tone="strong"
                className="user-space__link-skeleton"
              />
            ))}
          </div>
        }
      >
        <div
          className="user-space user-space__header-skeleton"
          role="status"
          aria-busy="true"
        >
          <VisuallyHidden>{t('homepage.widget.loading')}</VisuallyHidden>
          <div className="user-space__identity-skeleton">
            <Skeleton
              variant="circle"
              tone="strong"
              className="user-space--avatar user-space__avatar-skeleton"
            />
            <div className="user-space__infos-skeleton">
              <div className="user-space--name">
                <Skeleton className="user-space__name-skeleton" />
              </div>
              <div className="user-space--profile">
                <Skeleton className="user-space__profile-skeleton" />
              </div>
            </div>
          </div>
          <div className="user-space__settings-skeleton">
            <Skeleton className="user-space__setting-skeleton" />
            {onCustomizeWidgetsClick && (
              <Skeleton
                variant="circle"
                tone="strong"
                className="user-space__button-skeleton"
              />
            )}
          </div>
        </div>
        {children && <HomeCard.Content>{children}</HomeCard.Content>}
      </HomeCard>
    );
  }

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
        <Flex className={'user-space--identity'} direction="row" gap="8">
          <Avatar
            className={'user-space--avatar'}
            size={'auto'}
            alt={name}
            src={avatar}
            variant="circle"
          />
          <Flex className={'user-space--infos'} direction="column">
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
            aria-label={t('homepage.userSpace.customizeWidgets')}
            onClick={onCustomizeWidgetsClick}
          />
        )}
      </Flex>
      {children && <HomeCard.Content>{children}</HomeCard.Content>}
    </HomeCard>
  );
}

UserSpace.displayName = 'UserSpace';
