import { MouseEventHandler } from 'react';

import { Node } from '@tiptap/pm/model';
import { Editor, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import { AppIcon, Badge } from '../../../../components';
import { useEdificeIcons } from '../../../../hooks';

interface LinkerProps {
  selected: boolean;
  editor: Editor;
  node: Node;
}

const LinkerRenderer = ({ selected, ...props }: LinkerProps) => {
  const { getIconCode } = useEdificeIcons();
  const { editor, node } = props;
  const {
    'class': className,
    'data-app-prefix': appPrefix,
    title,
    href,
    target,
  } = node.attrs;

  const classes = clsx(
    'align-middle badge-linker c-pointer mx-4 my-2',
    className,
    selected && 'bg-secondary-200',
  );

  const appCode = getIconCode(appPrefix);

  const handleBadgeClick: MouseEventHandler<HTMLSpanElement> = (event) => {
    // Clicking a linker badge in read mode opens the link
    if (editor && !editor.isEditable) {
      event.preventDefault();
      window.open(href ?? 'about:blank', target ?? '_self');
    }
  };

  return (
    <NodeViewWrapper as="span" contentEditable={false}>
      <Badge
        variant={{ type: 'chip' }}
        className={classes}
        onClick={handleBadgeClick}
        data-drag-handle
      >
        <AppIcon size="24" app={appCode} />
        <span className="ms-8 text-truncate">{title || node.textContent}</span>
      </Badge>
    </NodeViewWrapper>
  );
};

export default LinkerRenderer;
