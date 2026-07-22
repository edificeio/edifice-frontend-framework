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

    switch (profile) {
      case 'Teacher': {
        let classesUrl = `${baseUrl}?filters=groups&structure=${structureId}`;
        user.classes.forEach((c) => (classesUrl += '&class=' + c));
        return [
          {
            text: t('homepage.userspace.teacher.link.classes'),
            url: classesUrl,
          },
        ];
      }
      case 'Student': {
        let url = `${baseUrl}?filters=groups&structure=${structureId}`;
        user.classes.forEach((c) => (url += '&class=' + c));
        return [
          {
            text: t('homepage.userspace.student.link.teachers'),
            url: `/userbook/annuaire#/search?filters=groups&profile=Teacher`,
          },
          {
            text: t('homepage.userspace.student.link.classes'),
            url,
          },
        ];
      }
      case 'Relative': {
        const children = user.children as Record<string, ChildInfo>;
        return Object.entries(children).map(([, child]) => ({
          text: t('homepage.userspace.relative.link.classes', {
            childName: `${child.firstName}`,
          }),
          url: `${baseUrl}?filters=groups&structure=${structureId}`, //TODO: Add child class ID "&class=classID" to the URL when the backend supports it
        }));
      }
      case 'Personnel': {
        return [
          {
            text: t('homepage.userspace.personnel.link.classesAndGroups'),
            url: `${baseUrl}?filters=groups&structure=${structureId}`,
          },
        ];
      }

      case 'Guest':
        return undefined;
    }
  }

  return;
}
