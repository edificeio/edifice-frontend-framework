import { useMemo, useState, useEffect } from 'react';

import { BubbleMenu } from '@tiptap/react/menus';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';
import Toolbar, { ToolbarItem } from '../../../../components/Toolbar/Toolbar';
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
  const [currentType, setCurrentType] = useState<string | null>(null);

  const getSelectedNode = () => {
    const { $anchor } = editor.view.state.selection;
    for (let depth = $anchor.depth; depth >= 0; depth--) {
      const node = $anchor.node(depth);
      if (node.type.name === 'information-pane') {
        return node;
      }
    }
    return null;
  };

  useEffect(() => {
    const updateCurrentType = () => {
      const selectedNode = getSelectedNode();
      setCurrentType(selectedNode?.attrs?.type || null);
    };

    updateCurrentType();

    editor.on('selectionUpdate', updateCurrentType);
    editor.on('transaction', updateCurrentType);

    return () => {
      editor.off('selectionUpdate', updateCurrentType);
      editor.off('transaction', updateCurrentType);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  const InformationPaneTypeItems: ToolbarItem[] = useMemo(() => {
    return [
      {
        type: 'icon',
        name: 'info',
        props: {
          'size': 'lg',
          'icon': <IconInfoCircle />,
          'aria-label': t('tiptap.tooltip.bubblemenu.information.pane.info'),
          'className':
            currentType === 'info' ? 'is-selected' : '',
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
          'className':
            currentType === 'success' ? 'is-selected' : '',
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
          'className':
            currentType === 'warning' ? 'is-selected' : '',
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
          'className':
            currentType === 'question' ? 'is-selected' : '',
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

  const floatingOptions = useMemo(() => {
    return {
      placement: 'bottom' as const,
      middleware: [
        {
          name: 'offset',
          options: { mainAxis: 0, crossAxis: 0 },
        },
      ],
      strategy: 'fixed' as const,
    };
  }, []);

  return (
    <BubbleMenu
      shouldShow={({ editor }) => {
        return editor.isActive('information-pane');
      }}
      editor={editor}
      options={floatingOptions}
      getReferencedVirtualElement={() => reference}
    >
      {editable && <Toolbar className="p-8" items={InformationPaneTypeItems} />}
    </BubbleMenu>
  );
};

export default BubbleMenuEditInformationPane;
