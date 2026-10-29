import { KeyboardEvent, Ref } from 'react';

import clsx from 'clsx';

import { Avatar } from '../../../../../components/Avatar';

export interface TabsKidsItemProps {
  /**
   * Item identifier
   */
  id: string;
  /**
   * Item label
   */
  label: string;
  /**
   * Optional avatar URL displayed before the label
   */
  avatar?: string;
}

interface TabsKidsItemInternalProps extends TabsKidsItemProps {
  isActive: boolean;
  /**
   * Display only the initial of the label when the tab is inactive
   */
  isCompact: boolean;
  /**
   * Hidden copy only used to measure the tab width: no id nor tab semantics
   */
  isMeasure?: boolean;
  onSelect?: (id: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
  buttonRef?: Ref<HTMLButtonElement>;
}

const TabsKidsItem = ({
  id,
  label,
  avatar,
  isActive,
  isCompact,
  isMeasure = false,
  onSelect,
  onKeyDown,
  buttonRef,
}: TabsKidsItemInternalProps) => {
  const isAbbreviated = isCompact && !isActive;
  const displayedLabel = isAbbreviated
    ? `${label.trim().charAt(0).toUpperCase()}.`
    : label;

  return (
    <button
      ref={buttonRef}
      type="button"
      role={isMeasure ? undefined : 'tab'}
      id={isMeasure ? undefined : `tabs-kids-${id}`}
      aria-selected={isMeasure ? undefined : isActive}
      aria-controls={
        isActive && !isMeasure ? `tabs-kids-panel-${id}` : undefined
      }
      tabIndex={isActive && !isMeasure ? 0 : -1}
      title={isMeasure ? undefined : label}
      aria-label={isAbbreviated && !isMeasure ? label : undefined}
      className={clsx('tabs-kids-item', {
        active: isActive,
        compact: isAbbreviated,
      })}
      onClick={() => onSelect?.(id)}
      onKeyDown={onKeyDown}
    >
      {avatar && (
        <span className="tabs-kids-item-avatar">
          <Avatar alt="" size="xs" variant="circle" src={avatar} />
        </span>
      )}
      <span className="tabs-kids-item-label">{displayedLabel}</span>
    </button>
  );
};

TabsKidsItem.displayName = 'TabsKids.Item';

export default TabsKidsItem;
