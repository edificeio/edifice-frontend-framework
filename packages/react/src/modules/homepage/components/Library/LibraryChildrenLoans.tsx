import { useTranslation } from 'react-i18next';

import { IconLibrary } from '../../../icons/components';
import { LibraryChildLoans } from './models';

export interface LibraryChildrenLoansProps {
  /** Number of books borrowed by each child of the user. */
  childrenLoans: LibraryChildLoans[];
}

/**
 * "Prêts de mes enfants" section of the library widget, displayed to a
 * relative: the number of books borrowed by each child, never the books
 * themselves. Children who borrowed no book are not listed.
 */
const LibraryChildrenLoans = ({ childrenLoans }: LibraryChildrenLoansProps) => {
  const { t } = useTranslation();

  const borrowers = childrenLoans.filter((child) => child.loansCount > 0);
  if (borrowers.length === 0) return null;

  return (
    <section className="library-loans">
      <h4 className="library-loans-title">
        {t('homepage.library.children.title')}
      </h4>
      <ul className="library-loans-list">
        {borrowers.map((child) => (
          <li key={child.id} className="library-loan">
            <div
              className="library-loan-cover library-loan-cover--placeholder"
              aria-hidden="true"
            >
              <IconLibrary width={20} height={20} />
            </div>
            <div className="library-loan-infos">
              <span className="library-loan-title">{child.firstName}</span>
              <span className="library-loan-count">
                {child.loansCount > 1
                  ? t('homepage.library.children.loans', {
                      number: child.loansCount,
                    })
                  : t('homepage.library.children.loan', {
                      number: child.loansCount,
                    })}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

LibraryChildrenLoans.displayName = 'LibraryChildrenLoans';

export default LibraryChildrenLoans;
