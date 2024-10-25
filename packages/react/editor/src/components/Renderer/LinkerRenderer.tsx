import { MouseEventHandler } from "react";

import { AppIcon, Badge, useOdeIcons } from "@edifice-ui/react";
import { Node } from "@tiptap/pm/model";
import { Editor, NodeViewWrapper } from "@tiptap/react";
import clsx from "clsx";

interface LinkerProps {
  selected: boolean;
  editor: Editor;
  node: Node;
}

const LinkerRenderer = ({ selected, ...props }: LinkerProps) => {
  const { getIconCode } = useOdeIcons();
  const { editor, node } = props;
  const {
    class: className,
    title,
    "data-app-prefix": appPrefix,
    href,
    target,
  } = node.attrs;

  const classes = clsx(
    "align-middle badge-linker c-pointer mx-4 my-2",
    className,
    selected && "bg-secondary-200",
  );

  const appCode = getIconCode(appPrefix);

  const handleBadgeClick: MouseEventHandler<HTMLSpanElement> = (event) => {
    // Clicking a linker badge in read mode opens the link
    if (editor && !editor.isEditable) {
      event.preventDefault;
      window.open(href ?? "about:blank", target ?? "_self");
    }
  };

  return (
    <NodeViewWrapper as="span" contentEditable={false}>
      <Badge
        variant={{ type: "link" }}
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
