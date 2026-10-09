import { useTranslation } from 'react-i18next';

import { IconExternalLink } from '../../../icons/components';
import HomeCard from '../HomeCard/HomeCard';
import LibraryChildrenLoans from './LibraryChildrenLoans';
import LibraryLoans from './LibraryLoans';
import LibrarySelection from './LibrarySelection';
import { LibraryBook, LibraryChildLoans, LibraryLoan } from './models';

export interface LibraryProps {
  /** Books currently borrowed by the user, displayed in the "Mes prêts" section. */
  loans: LibraryLoan[];
  /** Number of books borrowed by each child of a relative, displayed in the "Prêts de mes enfants" section. */
  childrenLoans?: LibraryChildLoans[];
  /** Books selection coming from the library RSS feed, displayed in the carousel. */
  books: LibraryBook[];
  /** Handle a click on the "See more" button. When omitted, the button is hidden. */
  onSeeMoreClick?: () => void;
}

/**
 * Library widget of the homepage.
 *
 * Displays the user's current loans, or the number of books borrowed by each
 * child for a relative, and the books selection provided by the library RSS
 * feed. Each section is hidden when it has no content.
 */
export function Library({
  loans,
  childrenLoans = [],
  books,
  onSeeMoreClick,
}: LibraryProps) {
  const { t } = useTranslation();

  return (
    <HomeCard variant="primary" className="library-card">
      <HomeCard.Header
        title={t('homepage.library.title')}
        actionLabel={t('homepage.library.see.more')}
        onActionClick={onSeeMoreClick}
        actionRightIcon={<IconExternalLink />}
      />
      <HomeCard.Content className="library-card-content">
        <LibraryLoans loans={loans} />
        <LibraryChildrenLoans childrenLoans={childrenLoans} />
        <LibrarySelection books={books} />
      </HomeCard.Content>
    </HomeCard>
  );
}

Library.displayName = 'Library';
