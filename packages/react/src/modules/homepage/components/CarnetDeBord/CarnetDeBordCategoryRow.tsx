import clsx from 'clsx';
import { CATEGORY_CONFIG } from './categoryConfig';
import { ContentTitle } from './types';

export interface CarnetDeBordCategoryIconProps {
  category: ContentTitle;
}

export function CarnetDeBordCategoryIcon({
  category,
}: CarnetDeBordCategoryIconProps) {
  const { color, icon } = CATEGORY_CONFIG[category];
  return (
    <span
      className={clsx('carnet-de-bord__icon', `carnet-de-bord__icon--${color}`)}
      aria-hidden="true"
    >
      {icon}
    </span>
  );
}

export interface CarnetDeBordCategoryRowProps {
  category: ContentTitle;
  label: string;
  /** Compact summary of the category, or its empty message. */
  subtext: string;
  /** The subtext is the empty message (displayed in italic). */
  isSubtextEmpty: boolean;
  /** No entry to open: the row is inert. */
  isDisabled: boolean;
  onClick: () => void;
}

export function CarnetDeBordCategoryRow({
  category,
  label,
  subtext,
  isSubtextEmpty,
  isDisabled,
  onClick,
}: CarnetDeBordCategoryRowProps) {
  const content = (
    <>
      <CarnetDeBordCategoryIcon category={category} />
      <span className="carnet-de-bord__entry-text">
        <span className="carnet-de-bord__entry-label">{label}</span>
        <span
          className={clsx('carnet-de-bord__entry-subtext', {
            'carnet-de-bord__entry-subtext--empty': isSubtextEmpty,
          })}
        >
          {subtext}
        </span>
      </span>
    </>
  );

  if (isDisabled) {
    return <div className="carnet-de-bord__entry">{content}</div>;
  }

  return (
    <button
      type="button"
      className="carnet-de-bord__entry carnet-de-bord__entry--clickable"
      onClick={onClick}
      data-testid={`carnet-de-bord-button-${category}`}
    >
      {content}
    </button>
  );
}
