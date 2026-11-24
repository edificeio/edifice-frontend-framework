import { useState } from 'react';
import { useUser } from '../../../../hooks';
import Stop3018 from './Stop3018';
import { Stop3018Modal } from './Stop3018Modal';
import { Stop3018Audience, Stop3018Link } from './types';
import { openStop3018Link } from './utils';

const AUDIENCE_BY_PROFILE: Record<string, Stop3018Audience> = {
  Student: 'student',
  Relative: 'relative',
};

export function Stop3018Container() {
  const { userDescription } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only students and relatives are concerned by the 3018 card.
  const profile = userDescription?.profiles?.[0];
  const audience = profile ? AUDIENCE_BY_PROFILE[profile] : undefined;

  if (!audience) return null;

  const openLink = (link: Stop3018Link) => openStop3018Link(audience, link);

  return (
    <>
      <Stop3018
        audience={audience}
        onLearnMoreClick={() => setIsModalOpen(true)}
        onLinkClick={openLink}
      />
      <Stop3018Modal
        isOpen={isModalOpen}
        audience={audience}
        onClose={() => setIsModalOpen(false)}
        onLinkClick={openLink}
      />
    </>
  );
}

Stop3018Container.displayName = 'Stop3018Container';
