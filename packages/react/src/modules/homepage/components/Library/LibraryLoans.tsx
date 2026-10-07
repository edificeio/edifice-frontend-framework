import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useDate } from '../../../../hooks';
import { IconLibrary } from '../../../icons/components';
import { LibraryLoan } from './models';

export interface LibraryLoansProps {
  /** Books currently borrowed by the user. */
  loans: LibraryLoan[];
}

/**
 * "Mes prêts" section of the library widget: the books borrowed by the user
 * with their return due date. Overdue loans are highlighted.
 */
const LibraryLoans = ({ loans }: LibraryLoansProps) => {
  const { t } = useTranslation();
  const { formatDate } = useDate();

  if (loans.length === 0) return null;

  const now = Date.now();

  return (
    <section className="library-loans">
      <h4 className="library-loans-title">
        {t('homepage.library.loans.title', 'Mes prêts')}
      </h4>
      <ul className="library-loans-list">
        {loans.map((loan) => {
          const isOverdue = new Date(loan.dueDate).getTime() < now;

          return (
            <li key={loan.id} className="library-loan">
              {loan.cover ? (
                <img
                  src={loan.cover}
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                  className="library-loan-cover"
                />
              ) : (
                <div
                  className="library-loan-cover library-loan-cover--placeholder"
                  aria-hidden="true"
                >
                  <IconLibrary width={20} height={20} />
                </div>
              )}
              <div className="library-loan-infos">
                <span className="library-loan-title">{loan.title}</span>
                <span
                  className={clsx('library-loan-due', {
                    'library-loan-due--overdue': isOverdue,
                  })}
                >
                  {t('homepage.library.loans.due-date', {
                    defaultValue: 'À rendre avant le [[date]]',
                    date: formatDate(loan.dueDate, 'DD/MM'),
                  })}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

LibraryLoans.displayName = 'LibraryLoans';

export default LibraryLoans;
