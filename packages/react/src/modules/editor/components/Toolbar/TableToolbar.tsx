import { RefAttributes, useEffect, useMemo, useState } from 'react';

import {
  Editor,
  findParentNodeClosestToPos,
  FloatingMenu,
  FloatingMenuProps,
} from '@tiptap/react';
import { useTranslation } from 'react-i18next';

import { IconButtonProps, Toolbar } from '../../../../components';
import { IconMergeCells, IconSplitCells } from '../../../icons/components';
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

  // Options need some computing
  const tippyOptions: FloatingMenuProps['tippyOptions'] = useMemo(() => {
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
      placement: 'bottom',
      offset: [0, 0],
      zIndex: 999,
      // popperOptions: {modifiers: [ /*see popper v2 modifiers*/ ]},
      // Try to get the bounding rect of the table.
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
  }, [editor, editor?.state, isSpan]);

  const handleShouldShow = () =>
    (editor?.isEditable && editor.isActive('table')) || false;

  return (
    <>
      {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={tippyOptions}
          shouldShow={handleShouldShow}
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
