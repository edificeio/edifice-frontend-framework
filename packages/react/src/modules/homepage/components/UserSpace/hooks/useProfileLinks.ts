import { UserProfile } from '@edifice.io/client';
import { useTranslation } from 'react-i18next';
import { useEdificeClient } from '../../../../../providers/EdificeClientProvider/EdificeClientProvider.hook';

type ProfileLink = {
  url: string;
  text: string;
};

type ChildInfo = {
  firstName: string;
};

/** Generates user's links to show in the UserSpace home component. */
export function useProfileLinks(
  profile: UserProfile[number],
): Array<ProfileLink> | undefined {
  const { user } = useEdificeClient();
  const { t } = useTranslation();

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

    const buildClassesUrl = (classIds: string[] = []) => {
      const params = new URLSearchParams({
        filters: 'groups',
        structure: structureId,
      });
      classIds.forEach((c) => params.append('class', String(c)));
      return `${baseUrl}?${params.toString()}`;
    };

    switch (profile) {
      case 'Teacher': {
        return [
          {
            text: t('homepage.userspace.teacher.link.classes'),
            url: buildClassesUrl(user.classes),
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
            url: buildClassesUrl(user.classes),
          },
        ];
      }
      case 'Relative': {
        const children = (user.children ?? {}) as Record<string, ChildInfo>;
        const childrenArray = Object.entries(children);
        if (!childrenArray.length) return undefined;

        const classIds: string[] = []; //TODO: Add child class ID "&class=classID" to the URL when the backend supports it
        return childrenArray.map(([, child]) => ({
          text: t('homepage.userspace.relative.link.classes', {
            childName: `${child.firstName}`,
          }),
          url: buildClassesUrl(classIds),
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
