import { useMemo, useState, useEffect, useCallback } from 'react';

import { BubbleMenu } from '@tiptap/react/menus';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';
import { useEditorState } from '../../hooks/useEditorState';
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
  const editorState = useEditorState(editor);
  const [currentSize, setCurrentSize] = useState<string | null>(null);
  const [currentWidth, setCurrentWidth] = useState<number | null>(null);

  useEffect(() => {
    const { selection } = editor.view.state;
    const selectedNode = editor.view.state.doc.nodeAt(selection.anchor);

    setCurrentSize(selectedNode?.attrs?.size || null);
    setCurrentWidth(selectedNode?.attrs?.width || null);
  }, [editor, editorState]);

  const handleButtonClick = useCallback(
    (buttonSize: ButtonSize) => {
      editor
        .chain()
        .focus()
        .updateAttributes('custom-image', {
          width: buttonSize.width,
          height: buttonSize.height,
          size: buttonSize.size,
        })
        .run();
    },
    [editor],
  );

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
            currentSize === 'small' && currentWidth === 250
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
            currentSize === 'medium' && currentWidth === 350
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
            currentSize === 'large' && currentWidth === 500
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
  }, [t, currentSize, currentWidth, onEditImage, handleButtonClick]);

  const reference = useMemo(() => {
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
    // Try to get the bounding rect of the image
    return {
      getBoundingClientRect: () => {
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

        return new DOMRect(0, 0, 100, 100);
      },
    };
  }, [editor]);

  const floatingOptions = useMemo(() => {
    return {
      placement: 'bottom-start' as const,
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
      className={openEditImage ? 'd-none' : ''}
      shouldShow={({ editor }) => {
        return editor.isActive('custom-image') && !openEditImage;
      }}
      editor={editor}
      options={floatingOptions}
      getReferencedVirtualElement={() => reference}
    >
      {editable && (
        <Toolbar
          key={`toolbar-${currentSize}-${currentWidth}`}
          className="p-8"
          items={ImageSizeItems}
        />
      )}
    </BubbleMenu>
  );
};

export default BubbleMenuEditImage;
