import {
  RefAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Editor, findParentNodeClosestToPos } from '@tiptap/react';
import { FloatingMenu } from '@tiptap/react/menus';
import { useTranslation } from 'react-i18next';

import { IconButtonProps, Toolbar } from '../../../../components';
import { IconMergeCells, IconSplitCells } from '../../../icons/components';
import { useEditorState } from '../../hooks/useEditorState';
import {
  FLOATING_MENU_Z_INDEX,
  getFloatingMenuOptions,
} from './FloatingMenuOptions';
import { TableToolbarAddMenu } from './TableToolbar.AddMenu';
import { TableToolbarCellColor } from './TableToolbar.CellColor';
import { TableToolbarDelMenu } from './TableToolbar.DelMenu';

interface TableToolbarProps {
  /**
   * editor instance
   */
  editor: Editor | null;
}

const TableToolbar = ({ editor }: TableToolbarProps) => {
  const { t } = useTranslation();

  // Display the Split action when truthy, and Merge action when falsy.
  const [isSpan, setSpan] = useState<boolean | undefined>(undefined);
  // isSpan depends on the selected cell's attrs, which can change on a pure
  // selection move (no content edit, e.g. clicking into a different cell) -
  // `editor?.state` alone doesn't trigger a re-render for that.
  const editorState = useEditorState(editor);

  // Options need some computing
  const floatingOptions = useMemo(() => {
    // Adjust a DOMRect to make it visible at a correct place.
    function adjustRect(rect: DOMRect) {
      let yOffset = 0;
      if (window.visualViewport) {
        const bottomScreen =
          window.innerHeight || document.documentElement.clientHeight;
        if (rect.bottom >= bottomScreen) {
          yOffset += rect.bottom - bottomScreen - rect.height;
        }
      }
      return new DOMRect(rect.x, rect.y - yOffset, rect.width, rect.height);
    }

    return {
      ...getFloatingMenuOptions({
        placement: 'bottom',
        offset: { mainAxis: 0, crossAxis: 0 },
      }),
      // Dead in v3: FloatingMenu has no reference-rect override (unlike
      // BubbleMenu's getReferencedVirtualElement), so this never runs.
      getReferenceClientRect: () => {
        const parentDiv = editor?.isActive('table')
          ? findParentNodeClosestToPos(
              editor.state.selection.$anchor,
              (node) => node.type.name === 'table',
            )
          : null;

        // Try to retrieve the <div class="tableWrapper"> that wraps the <table>
        if (parentDiv) {
          const parentDomNode = editor?.view.nodeDOM(parentDiv.pos) as
            | HTMLElement
            | undefined;

          const tableDomNode =
            parentDomNode?.querySelector('table') || parentDomNode;
          if (tableDomNode) {
            return adjustRect(tableDomNode.getBoundingClientRect());
          }
        }

        // This should never happen... but it keeps the transpiler happy.
        return new DOMRect(0, 0, 100, 100);
      },
    };
  }, [editor]);

  useEffect(() => {
    const cellAttr = editor?.getAttributes('tableCell');
    const headAttr = editor?.getAttributes('tableHeader');
    if (typeof cellAttr !== 'undefined' || typeof headAttr !== 'undefined') {
      const newSpan =
        cellAttr?.['colspan'] > 1 ||
        cellAttr?.['rowspan'] > 1 ||
        headAttr?.['colspan'] > 1 ||
        headAttr?.['rowspan'] > 1;
      newSpan !== isSpan && setSpan(newSpan);
    } else {
      isSpan && setSpan(undefined);
    }
  }, [editor, editorState, isSpan]);

  // Memoized: an identity change here makes v3's FloatingMenu re-run a
  // `dispatch` effect, which combined with `useEditorState` above (re-renders
  // on every transaction) caused an infinite render loop.
  const handleShouldShow = useCallback(
    () => (editor?.isEditable && editor.isActive('table')) || false,
    [editor],
  );

  return (
    <>
      {editor && (
        <FloatingMenu
          editor={editor}
          options={floatingOptions}
          shouldShow={handleShouldShow}
          // v3's `options` has no `zIndex` field - set via style instead.
          style={{ zIndex: FLOATING_MENU_Z_INDEX }}
        >
          <Toolbar
            className="p-4"
            items={[
              {
                type: 'dropdown',
                name: 'bkg-col',
                // isEnable:
                //   typeof editor?.getAttributes("tableCell") !== "undefined",
                props: {
                  children: (
                    _triggerProps: JSX.IntrinsicAttributes &
                      Omit<IconButtonProps, 'ref'> &
                      RefAttributes<HTMLButtonElement>,
                    itemRefs,
                  ) => (
                    <TableToolbarCellColor
                      editor={editor}
                      itemRefs={itemRefs}
                    />
                  ),
                },
              },
              {
                type: 'icon',
                name: 'mergeorsplit',
                // isEnable: typeof isSpan !== "undefined",
                props: {
                  'icon': isSpan ? <IconSplitCells /> : <IconMergeCells />,
                  'aria-label': isSpan
                    ? t('tiptap.table.toolbar.split')
                    : t('tiptap.table.toolbar.merge'),
                  'onClick': () => editor?.chain().focus().mergeOrSplit().run(),
                },
                tooltip: isSpan
                  ? t('tiptap.table.toolbar.split')
                  : t('tiptap.table.toolbar.merge'),
              },
              {
                type: 'divider',
                name: 'add-d0',
              },
              {
                type: 'dropdown',
                name: 'add',
                props: {
                  children: () => <TableToolbarAddMenu editor={editor} />,
                },
              },
              {
                type: 'divider',
                name: 'add-d1',
              },
              {
                type: 'dropdown',
                name: 'del',
                props: {
                  children: () => <TableToolbarDelMenu editor={editor} />,
                },
              },
            ]}
          />
        </FloatingMenu>
      )}
    </>
  );
};

export default TableToolbar;
