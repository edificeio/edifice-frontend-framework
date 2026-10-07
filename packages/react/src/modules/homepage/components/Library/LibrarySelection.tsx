import { useCallback, useEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Flex, IconButton } from '../../../../components';
import { IconRafterLeft, IconRafterRight } from '../../../icons/components';
import LibraryBookCard from './LibraryBookCard';
import { LibraryBook } from './models';

export interface LibrarySelectionProps {
  /** Books of the current selection. */
  books: LibraryBook[];
}

/**
 * "Sélection du moment" section of the library widget: a horizontal carousel
 * of books, paged with previous/next buttons.
 */
const LibrarySelection = ({ books }: LibrarySelectionProps) => {
  const { t } = useTranslation();
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    // 1px tolerance to absorb sub-pixel rounding of scroll positions
    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth - 1;
    setCanScrollPrev(scroller.scrollLeft > 0);
    setCanScrollNext(scroller.scrollLeft < maxScrollLeft);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [books, updateScrollState]);

  const handleScrollBy = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    scroller?.scrollBy({
      left: direction * scroller.clientWidth,
      behavior: 'smooth',
    });
  };

  if (books.length === 0) return null;

  return (
    <section className="library-selection">
      <Flex
        align="center"
        justify="between"
        gap="8"
        className="library-selection-header"
      >
        <h4 className="library-selection-title">
          {t('homepage.library.selection.title', 'Sélection du moment')}
        </h4>
        <Flex align="center" gap="4">
          <IconButton
            aria-label={t('homepage.library.selection.previous', 'Précédent')}
            color="tertiary"
            variant="ghost"
            icon={<IconRafterLeft />}
            disabled={!canScrollPrev}
            onClick={() => handleScrollBy(-1)}
          />
          <IconButton
            aria-label={t('homepage.library.selection.next', 'Suivant')}
            color="tertiary"
            variant="ghost"
            icon={<IconRafterRight />}
            disabled={!canScrollNext}
            onClick={() => handleScrollBy(1)}
          />
        </Flex>
      </Flex>

      <ul
        ref={scrollerRef}
        className="library-selection-scroller"
        onScroll={updateScrollState}
      >
        {books.map((book) => (
          <li key={book.id} className="library-selection-item">
            <LibraryBookCard book={book} />
          </li>
        ))}
      </ul>
    </section>
  );
};

LibrarySelection.displayName = 'LibrarySelection';

export default LibrarySelection;
