import { KeyboardEvent, useRef } from 'react';

import { IconUsers } from '../../../../icons/components';
import {
  ButtonBeta,
  ButtonBetaProps,
} from '../../../../../components/ButtonBeta';
import { Dropdown } from '../../../../../components/Dropdown';
import { useTabsKidsOverflow } from '../hooks/useTabsKidsOverflow';
import TabsKidsItem, { TabsKidsItemProps } from './TabsKidsItem';
import { useTranslation } from 'react-i18next';

interface TabsKidsListProps {
  items: TabsKidsItemProps[];
  activeId: string;
  onSelect: (id: string) => void;
  isCompact: boolean;
  ariaLabel?: string;
  overflowLabel?: string;
}

const TabsKidsList = ({
  items,
  activeId,
  onSelect,
  isCompact,
  ariaLabel,
  overflowLabel,
}: TabsKidsListProps) => {
  const { t } = useTranslation();

  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const { tabBarRef, measureRef, visibleItems, overflowItems } =
    useTabsKidsOverflow({ items, activeId, isCompact });

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    order: number,
  ) => {
    const last = visibleItems.length - 1;
    let next: number | undefined;

    switch (event.key) {
      case 'ArrowRight':
        next = order === last ? 0 : order + 1;
        break;
      case 'ArrowLeft':
        next = order === 0 ? last : order - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
    }

    if (next === undefined) return;
    event.preventDefault();
    tabsRef.current[next]?.focus();
    onSelect(visibleItems[next].id);
  };

  return (
    <div className="tabs-kids-bar" ref={tabBarRef}>
      <div className="tabs-kids-list" role="tablist" aria-label={ariaLabel}>
        {visibleItems.map((item, order) => (
          <TabsKidsItem
            key={item.id}
            {...item}
            isActive={item.id === activeId}
            isCompact={isCompact}
            onSelect={onSelect}
            onKeyDown={(event) => handleKeyDown(event, order)}
            buttonRef={(el) => {
              tabsRef.current[order] = el;
            }}
          />
        ))}
      </div>
      {overflowItems.length > 0 && (
        <div className="tabs-kids-overflow">
          <Dropdown placement="bottom-end">
            {(triggerProps: ButtonBetaProps) => (
              <>
                <ButtonBeta
                  {...triggerProps}
                  type="button"
                  aria-label={
                    overflowLabel ?? t('tabsKids.see.more', 'Voir plus')
                  }
                  color="default"
                  variant="ghost"
                  leftIcon={<IconUsers />}
                />
                <Dropdown.Menu>
                  {overflowItems.map((item) => (
                    <Dropdown.RadioItem
                      key={item.id}
                      value={item.id}
                      model={activeId}
                      onChange={onSelect}
                    >
                      {item.label}
                    </Dropdown.RadioItem>
                  ))}
                </Dropdown.Menu>
              </>
            )}
          </Dropdown>
        </div>
      )}
      {/* Hidden copy of every tab at its natural width, used for measuring. */}
      <div className="tabs-kids-measure" aria-hidden="true">
        <div className="tabs-kids-measure-content" ref={measureRef}>
          {items.map((item) => (
            <TabsKidsItem
              key={item.id}
              {...item}
              isActive={item.id === activeId}
              isCompact={isCompact}
              isMeasure
            />
          ))}
          <div className="tabs-kids-overflow tabs-kids-measure-trigger">
            <ButtonBeta
              tabIndex={-1}
              aria-label=""
              color="default"
              variant="ghost"
              leftIcon={<IconUsers />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

TabsKidsList.displayName = 'TabsKids.List';

export default TabsKidsList;
