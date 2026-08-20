import { UserProfile } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import { useEdificeClient } from '../../../../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import { useChildren } from './useChildren';

type ProfileLink = {
  url: string;
  text: string;
};

/** Generates user's links to show in the UserSpace home component. */
export function useProfileLinks(
  profile: UserProfile[number],
): Array<ProfileLink> | undefined {
  const { user } = useEdificeClient();
  const { t } = useTranslation();

  const isRelative = profile === 'Relative';
  const { data: children } = useChildren(user?.userId, isRelative);

  const structureId = user?.structures?.[0];

  if (structureId && profile) {
    const baseUrl = '/userbook/annuaire#/search';

    const buildStructureGroupsUrl = () => {
      const params = new URLSearchParams({
        filters: 'groups',
        structure: structureId,
      });
      return `${baseUrl}?${params.toString()}`;
    };

    /**
     * @param parameters Mandatory query params
     * @param classIds Optional List of classes ID as query params
     * @returns Link to all those classes, in specified or all structures.
     */
    const buildClassesUrl = (
      parameters: {
        filters: 'groups' | 'users';
        structure?: string;
      },
      classIds: string[] = [],
    ) => {
      const params = new URLSearchParams(parameters);
      classIds.forEach((c) => params.append('class', String(c)));
      return `${baseUrl}?${params.toString()}`;
    };

    switch (profile) {
      case 'Teacher': {
        return [
          {
            text: t('homepage.userspace.teacher.link.classes'),
            url: buildClassesUrl(
              {
                filters: 'groups',
              } /* Do not explicitely add classes ids, because none <=> see all*/,
            ),
          },
        ];
      }
      case 'Student': {
        return [
          {
            text: t('homepage.userspace.student.link.teachers'),
            url: `/userbook/annuaire#/search?filters=groups&profile=Teacher`,
          },
          {
            text: t('homepage.userspace.student.link.classes'),
            url: buildClassesUrl(
              {
                filters: 'groups',
              } /* Do not explicitely add classes ids, because none <=> see all*/,
            ),
          },
        ];
      }
      case 'Relative': {
        if (!children?.length) return undefined;

        return children.map((child) => ({
          text: t('homepage.userspace.relative.link.classes', {
            childName: child.firstName,
          }),
          url: buildClassesUrl(
            { filters: 'groups', structure: structureId },
            child.classes?.map(({ id }) => id),
          ),
        }));
      }
      case 'Personnel': {
        return [
          {
            text: t('homepage.userspace.personnel.link.classesAndGroups'),
            url: buildStructureGroupsUrl(),
          },
        ];
      }

      case 'Guest':
        return undefined;
    }
  }

  return;
}
