import { useTranslation } from 'react-i18next';

import { TextSkeleton } from '../../../../components';
import HomeCard from '../HomeCard/HomeCard';
import { useLibrary } from './hooks/useLibrary';
import { Library } from './Library';

export interface LibraryContainerProps {
  /**
   * URL of the RSS feed listing the current books selection.
   * i.e. "/mediacentre/library/selection/rss"
   */
  rssFeedUrl: string;
  /**
   * URL of the endpoint returning the books borrowed by the user.
   * i.e. "/mediacentre/library/loans"
   */
  loansUrl: string;
  /** Handle a click on the "See more" button. When omitted, the button is hidden. */
  onSeeMoreClick?: () => void;
}

/**
 * Fetches the library data (RSS selection + user loans) and renders the
 * Library widget. The widget is hidden when there is nothing to display.
 */
export function LibraryContainer({
  rssFeedUrl,
  loansUrl,
  onSeeMoreClick,
}: LibraryContainerProps) {
  const { t } = useTranslation();
  const { books, loans, isLoading } = useLibrary({ rssFeedUrl, loansUrl });

  if (isLoading) {
    return (
      <HomeCard variant="primary" className="library-card">
        <HomeCard.Header title={t('homepage.library.title', 'Bibliothèque')} />
        <HomeCard.Content className="library-card-content">
          <TextSkeleton size="lg" />
          <TextSkeleton size="lg" />
          <TextSkeleton size="lg" />
        </HomeCard.Content>
      </HomeCard>
    );
  }

  // Hide the widget when both sections are empty or failed to load
  if (books.length === 0 && loans.length === 0) {
    return null;
  }

  return (
    <Library books={books} loans={loans} onSeeMoreClick={onSeeMoreClick} />
  );
}

LibraryContainer.displayName = 'LibraryContainer';
