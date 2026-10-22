import { useCallback, useMemo, useState, useEffect } from 'react';

import { BubbleMenu } from '@tiptap/react/menus';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';
import { useEditorState } from '../../hooks/useEditorState';
import Toolbar, { ToolbarItem } from '../../../../components/Toolbar/Toolbar';
import {
  FLOATING_MENU_Z_INDEX,
  getFloatingMenuOptions,
  useReferencedVirtualElement,
} from '../Toolbar/FloatingMenuOptions';
import {
  IconAlertTriangle,
  IconDelete,
  IconInfoCircle,
  IconQuestion,
  IconSuccessOutline,
} from '../../../icons/components';

const BubbleMenuEditInformationPane = ({
  editor,
  editable,
}: {
  editor: Editor;
  editable: boolean;
}) => {
  const { t } = useTranslation();
  const editorState = useEditorState(editor);
  const [currentType, setCurrentType] = useState<string | null>(null);

  useEffect(() => {
    const { $anchor } = editor.view.state.selection;
    let selectedNode = null;
    for (let depth = $anchor.depth; depth >= 0; depth--) {
      const node = $anchor.node(depth);
      if (node.type.name === 'information-pane') {
        selectedNode = node;
        break;
      }
    }
    setCurrentType(selectedNode?.attrs?.type ?? null);
  }, [editor, editorState]);

  const InformationPaneTypeItems: ToolbarItem[] = useMemo(() => {
    return [
      {
        type: 'icon',
        name: 'info',
        props: {
          'size': 'lg',
          'icon': <IconInfoCircle />,
          'aria-label': t('tiptap.tooltip.bubblemenu.information.pane.info'),
          'className': currentType === 'info' ? 'is-selected' : '',
          'onClick': () =>
            editor
              .chain()
              .focus()
              .updateAttributes('information-pane', { type: 'info' })
              .run(),
        },
        tooltip: {
          message: t('tiptap.tooltip.bubblemenu.information.pane.info'),
          position: 'top',
        },
      },
      {
        type: 'icon',
        name: 'success',
        props: {
          'size': 'lg',
          'icon': <IconSuccessOutline />,
          'aria-label': t('tiptap.tooltip.bubblemenu.information.pane.success'),
          'className': currentType === 'success' ? 'is-selected' : '',
          'onClick': () =>
            editor
              .chain()
              .focus()
              .updateAttributes('information-pane', { type: 'success' })
              .run(),
        },
        tooltip: {
          message: t('tiptap.tooltip.bubblemenu.information.pane.success'),
          position: 'top',
        },
      },
      {
        type: 'icon',
        name: 'warning',
        props: {
          'size': 'lg',
          'icon': <IconAlertTriangle />,
          'aria-label': t('tiptap.tooltip.bubblemenu.information.pane.warning'),
          'className': currentType === 'warning' ? 'is-selected' : '',
          'onClick': () =>
            editor
              .chain()
              .focus()
              .updateAttributes('information-pane', { type: 'warning' })
              .run(),
        },
        tooltip: {
          message: t('tiptap.tooltip.bubblemenu.information.pane.warning'),
          position: 'top',
        },
      },
      {
        type: 'icon',
        name: 'question',
        props: {
          'size': 'lg',
          'icon': <IconQuestion />,
          'aria-label': t(
            'tiptap.tooltip.bubblemenu.information.pane.question',
          ),
          'className': currentType === 'question' ? 'is-selected' : '',
          'onClick': () =>
            editor
              .chain()
              .focus()
              .updateAttributes('information-pane', { type: 'question' })
              .run(),
        },
        tooltip: {
          message: t('tiptap.tooltip.bubblemenu.information.pane.question'),
          position: 'top',
        },
      },
      {
        type: 'divider',
        name: 'div-4',
      },
      {
        type: 'button',
        name: 'delete',
        props: {
          'size': 'lg',
          'leftIcon': <IconDelete />,
          'aria-label': t('tiptap.bubblemenu.delete'),
          'children': t('tiptap.bubblemenu.delete'),
          'onClick': () =>
            editor.chain().focus().deleteNode('information-pane').run(),
        },
        tooltip: {
          message: t('tiptap.bubblemenu.delete'),
          position: 'top',
        },
      },
    ];
  }, [t, editor, currentType]);

  const reference = useMemo(() => {
    return {
      getBoundingClientRect: () => {
        const { state } = editor;
        const { $anchor } = state.selection;

        let informationPanePos: number | null = null;
        for (let depth = $anchor.depth; depth >= 0; depth--) {
          const node = $anchor.node(depth);
          if (node.type.name === 'information-pane') {
            informationPanePos = $anchor.before(depth);
            break;
          }
        }

        if (informationPanePos !== null) {
          let domNode = editor.view.nodeDOM(
            informationPanePos,
          ) as HTMLElement | null;

          while (
            domNode &&
            domNode instanceof HTMLElement &&
            !domNode.classList.contains('information-pane')
          ) {
            domNode = domNode.children[0] as HTMLElement | null;
          }

          if (domNode instanceof HTMLElement) {
            return domNode.getBoundingClientRect();
          }
        }

        return new DOMRect(0, 0, 0, 0);
      },
    };
  }, [editor]);

  const floatingOptions = useMemo(
    () =>
      getFloatingMenuOptions({
        placement: 'bottom',
        offset: { mainAxis: 0, crossAxis: 0 },
      }),
    [],
  );

  const getReferencedVirtualElement = useReferencedVirtualElement(reference);

  // Memoized: an identity change on `shouldShow`/`getReferencedVirtualElement`
  // makes v3's BubbleMenu re-run a `dispatch` effect, which combined with
  // `useEditorState` above (re-renders on every transaction) caused an
  // infinite render loop.
  const handleShouldShow = useCallback(
    ({ editor }: { editor: Editor }) => editor.isActive('information-pane'),
    [],
  );

  return (
    <BubbleMenu
      shouldShow={handleShouldShow}
      editor={editor}
      options={floatingOptions}
      getReferencedVirtualElement={getReferencedVirtualElement}
      // v3's `options` has no `zIndex` field - set via style instead.
      style={{ zIndex: FLOATING_MENU_Z_INDEX }}
    >
      {editable && <Toolbar className="p-8" items={InformationPaneTypeItems} />}
    </BubbleMenu>
  );
};

export default BubbleMenuEditInformationPane;
