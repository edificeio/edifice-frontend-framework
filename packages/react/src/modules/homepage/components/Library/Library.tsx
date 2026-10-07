import { useTranslation } from 'react-i18next';

import { IconExternalLink } from '../../../icons/components';
import HomeCard from '../HomeCard/HomeCard';
import LibraryLoans from './LibraryLoans';
import LibrarySelection from './LibrarySelection';
import { LibraryBook, LibraryLoan } from './models';

export interface LibraryProps {
  /** Books currently borrowed by the user, displayed in the "Mes prêts" section. */
  loans: LibraryLoan[];
  /** Books selection coming from the library RSS feed, displayed in the carousel. */
  books: LibraryBook[];
  /** Handle a click on the "See more" button. When omitted, the button is hidden. */
  onSeeMoreClick?: () => void;
}

/**
 * Library widget of the homepage.
 *
 * Displays the user's current loans and the books selection provided by the
 * library RSS feed. Each section is hidden when it has no content.
 */
export function Library({ loans, books, onSeeMoreClick }: LibraryProps) {
  const { t } = useTranslation();

  return (
    <HomeCard variant="primary" className="library-card">
      <HomeCard.Header
        title={t('homepage.library.title', 'Bibliothèque')}
        actionLabel={t('homepage.library.see.more', 'Voir plus')}
        onActionClick={onSeeMoreClick}
        actionRightIcon={<IconExternalLink />}
      />
      <HomeCard.Content className="library-card-content">
        <LibraryLoans loans={loans} />
        <LibrarySelection books={books} />
      </HomeCard.Content>
    </HomeCard>
  );
}

Library.displayName = 'Library';
