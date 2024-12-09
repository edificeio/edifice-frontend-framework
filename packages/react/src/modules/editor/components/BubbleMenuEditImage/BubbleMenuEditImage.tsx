import { useMemo } from 'react';

import { BubbleMenu, BubbleMenuProps, Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';
import Toolbar, { ToolbarItem } from '../../../../components/Toolbar/Toolbar';
import {
  IconImageSizeLarge,
  IconImageSizeMedium,
  IconImageSizeSmall,
  IconWand,
} from '../../../icons/components';

interface ButtonSize {
  size: string;
  width: string | number;
  height: string | number;
}

const BubbleMenuEditImage = ({
  editor,
  onEditImage,
  openEditImage,
  editable,
}: {
  editor: Editor;
  onEditImage: () => void;
  openEditImage: boolean;
  editable: boolean;
}) => {
  const { t } = useTranslation();

  const { selection } = editor.view.state;

  const selectedNode = editor.view.state.doc.nodeAt(selection.anchor);

  const handleButtonClick = (buttonSize: ButtonSize) => {
    editor
      .chain()
      .focus()
      .setAttributes({
        width: buttonSize.width,
        height: buttonSize.height,
        size: buttonSize.size,
      })
      .run();
  };

  const ImageSizeItems: ToolbarItem[] = useMemo(() => {
    return [
      {
        type: 'button',
        name: 'edit',
        props: {
          'size': 'lg',
          'color': 'secondary',
          'leftIcon': <IconWand />,
          'aria-label': t('tiptap.tooltip.bubblemenu.image.edit'),
          'children': t('tiptap.bubblemenu.edit'),
          'onClick': onEditImage,
        },
        tooltip: {
          message: t('tiptap.tooltip.bubblemenu.image.edit'),
          position: 'top',
        },
      },
      {
        type: 'divider',
        name: 'div-4',
      },
      {
        type: 'icon',
        name: 'small',
        props: {
          'icon': <IconImageSizeSmall />,
          'aria-label': t('tiptap.tooltip.bubblemenu.image.small'),
          'color': 'tertiary',
          'className':
            selectedNode?.attrs?.size === 'small' &&
            selectedNode?.attrs?.width === 250
              ? 'is-selected'
              : '',
          'onClick': () =>
            handleButtonClick({
              size: 'small',
              width: 250,
              height: 'auto',
            }),
        },
        tooltip: {
          message: t('tiptap.tooltip.bubblemenu.image.small'),
          position: 'top',
        },
      },
      {
        type: 'icon',
        name: 'medium',
        props: {
          'icon': <IconImageSizeMedium />,
          'aria-label': t('tiptap.tooltip.bubblemenu.image.medium'),
          'color': 'tertiary',
          'className':
            selectedNode?.attrs?.size === 'medium' &&
            selectedNode?.attrs?.width === 350
              ? 'is-selected'
              : '',
          'onClick': () =>
            handleButtonClick({
              size: 'medium',
              width: 350,
              height: 'auto',
            }),
        },
        tooltip: {
          message: t('tiptap.tooltip.bubblemenu.image.medium'),
          position: 'top',
        },
      },
      {
        type: 'icon',
        name: 'large',
        props: {
          'icon': <IconImageSizeLarge />,
          'aria-label': t('tiptap.tooltip.bubblemenu.image.big'),
          'color': 'tertiary',
          'className':
            selectedNode?.attrs?.size === 'large' &&
            selectedNode?.attrs?.width === 500
              ? 'is-selected'
              : '',
          'onClick': () =>
            handleButtonClick({
              size: 'large',
              width: 500,
              height: 'auto',
            }),
        },
        tooltip: {
          message: t('tiptap.tooltip.bubblemenu.image.big'),
          position: 'top',
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, selectedNode]);

  const tippyOptions: BubbleMenuProps['tippyOptions'] = useMemo(() => {
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
      placement: 'bottom-start',
      offset: [0, 0],
      zIndex: 999,
      duration: 100,
      // Try to get the bounding rect of the table.
      getReferenceClientRect: () => {
        const parentDiv = editor?.isActive('custom-image')
          ? editor.state.selection.$anchor
          : null;

        if (parentDiv) {
          const parentDomNode = editor?.view.nodeDOM(parentDiv.pos) as
            | HTMLElement
            | undefined;

          if (parentDomNode) {
            const childDomNode = parentDomNode.firstChild as HTMLElement;
            return adjustRect(childDomNode.getBoundingClientRect());
          }
        }

        // This should never happen... but it keeps the transpiler happy.
        return new DOMRect(0, 0, 100, 100);
      },
    };
  }, [editor]);

  return (
    <BubbleMenu
      className={openEditImage ? 'd-none' : ''}
      shouldShow={({ editor }) => {
        return editor.isActive('custom-image') && !openEditImage;
      }}
      editor={editor}
      tippyOptions={tippyOptions}
    >
      {editable && <Toolbar className="p-8" items={ImageSizeItems} />}
    </BubbleMenu>
  );
};

export default BubbleMenuEditImage;
