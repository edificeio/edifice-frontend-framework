import { useMemo } from 'react';

import { BubbleMenu, BubbleMenuProps, Editor } from '@tiptap/react';
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

  const { selection } = editor.view.state;

  const selectedNode = selection.$from.node(1);

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
            selectedNode?.attrs?.type === 'info' ? 'is-selected' : '',
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
            selectedNode?.attrs?.type === 'success' ? 'is-selected' : '',
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
            selectedNode?.attrs?.type === 'warning' ? 'is-selected' : '',
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
            selectedNode?.attrs?.type === 'question' ? 'is-selected' : '',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, selectedNode]);

  const tippyOptions: BubbleMenuProps['tippyOptions'] = useMemo(() => {
    return {
      placement: 'bottom',
      offset: [0, 0],
      zIndex: 999,
      duration: 100,
      getReferenceClientRect: () => {
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
          let domNode = editor.view.nodeDOM(informationPanePos);

          while (
            domNode &&
            domNode instanceof HTMLElement &&
            !domNode.classList.contains('information-pane')
          ) {
            domNode = domNode.children[0];
          }

          if (domNode instanceof HTMLElement) {
            return domNode.getBoundingClientRect();
          }
        }

        return new DOMRect(0, 0, 0, 0);
      },
    };
  }, [editor]);

  return (
    <BubbleMenu
      shouldShow={({ editor }) => {
        return editor.isActive('information-pane');
      }}
      editor={editor}
      tippyOptions={tippyOptions}
    >
      {editable && <Toolbar className="p-8" items={InformationPaneTypeItems} />}
    </BubbleMenu>
  );
};

export default BubbleMenuEditInformationPane;
