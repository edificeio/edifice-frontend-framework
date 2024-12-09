import { useCallback, useEffect, useRef, useState } from 'react';
import { TabsItemProps } from '../components/TabsItem';

interface UseTabsProps {
  defaultId?: string;
  items: TabsItemProps[];
  onChange?: (tab: TabsItemProps) => void;
}

export const useTabs = ({ defaultId, items, onChange }: UseTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultId || '');
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const setSelectedTab = useCallback((id: string) => {
    setActiveTab(id);
  }, []);

  useEffect(() => {
    const currentItem = items.find((item) => item.id === activeTab);
    currentItem && onChange?.(currentItem);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]); // only updating the activeTab value should trigger this effect.

  useEffect(() => {
    function setTabPosition() {
      /**
       * If the active element is not an input, then focus on the current tab.
       * The focus on input element with a reponse device will cause the keyboard to be displayed and trigger the resize event.
       * Which will cause the tab to be focused again and the keyboard to be closed. #WB-2841
       */
      if (document?.activeElement?.tagName !== 'INPUT') {
        const currentTabIndex = items.findIndex(
          (item) => item.id === activeTab,
        );
        if (currentTabIndex === -1 && defaultId) {
          setActiveTab(defaultId);
        }
        const currentTabRef = tabsRef.current[currentTabIndex];
        if (currentTabRef) {
          currentTabRef.focus();
          setTabUnderlineLeft(currentTabRef?.offsetLeft ?? 0);
          setTabUnderlineWidth(currentTabRef?.clientWidth ?? 0);
        }
      }
    }

    setTabPosition();
    window.addEventListener('resize', setTabPosition);

    return () => window.removeEventListener('resize', setTabPosition);
  }, [activeTab, items, defaultId]);

  const moveFocusToPreviousTab = useCallback(
    (activeTab: string) => {
      const index = items.findIndex((item) => item.id === activeTab);

      if (activeTab === items[0]?.id) {
        setActiveTab(items[items.length - 1]?.id);
      } else {
        setActiveTab(items[index - 1]?.id);
      }
    },
    [items],
  );

  const moveFocusToNextTab = useCallback(
    (activeTab: string | number) => {
      const index = items.findIndex((item) => item.id === activeTab);

      if (activeTab === items[items.length - 1]?.id) {
        setActiveTab(items[0]?.id);
      } else {
        setActiveTab(items[index + 1]?.id);
      }
    },
    [items],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      switch (event.code) {
        case 'ArrowLeft':
          moveFocusToPreviousTab(activeTab);
          break;

        case 'ArrowRight':
          moveFocusToNextTab(activeTab);
          break;

        case 'Home':
          setActiveTab(items[0]?.id);
          break;

        case 'End':
          setActiveTab(items[items.length - 1]?.id);
          break;

        default:
          break;
      }
    },
    [activeTab, items, moveFocusToNextTab, moveFocusToPreviousTab],
  );

  return {
    activeTab,
    setSelectedTab,
    tabsRef,
    tabUnderlineLeft,
    tabUnderlineWidth,
    onKeyDown,
  };
};
