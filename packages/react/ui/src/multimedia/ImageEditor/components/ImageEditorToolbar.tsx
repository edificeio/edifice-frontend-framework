import { useState } from "react";

import { Blur, Crop, Reset, Undo } from "@edifice-ui/icons";
import { useTranslation } from "react-i18next";

import { Toolbar, ToolbarItem } from "../../../components";

export type ImageEditorAction = "ROTATE" | "UNDO" | "CROP" | "BLUR" | "RESIZE";
interface ImageEditorToolbarProps {
  historyCount: number;
  handle(operation: ImageEditorAction): void;
}

const ImageEditorToolbar = ({
  historyCount,
  handle,
}: ImageEditorToolbarProps) => {
  const { t } = useTranslation();
  const [action, setAction] = useState<ImageEditorAction | undefined>(
    undefined,
  );
  const handleAndSave = (action: ImageEditorAction) => {
    setAction(action);
    handle(action);
  };

  const ImageEditorItems: ToolbarItem[] = [
    {
      type: "button",
      name: "undo",
      props: {
        "color": "tertiary",
        "leftIcon": <Undo />,
        "aria-label": t("cancel"),
        "children": t("cancel"),
        "onClick": () => handleAndSave("UNDO"),
        "disabled": historyCount === 0,
      },
      tooltip: t("cancel"),
    },
    {
      type: "divider",
      name: "div-1",
    },
    {
      type: "button",
      name: "reset",
      props: {
        "color": "tertiary",
        "leftIcon": <Reset />,
        "aria-label": t("rotate"),
        "children": t("rotate"),
        "onClick": () => handleAndSave("ROTATE"),
      },
      tooltip: t("rotate"),
    },
    {
      type: "button",
      name: "crop",
      props: {
        "color": "tertiary",
        "leftIcon": <Crop />,
        "aria-label": t("crop"),
        "children": t("crop"),
        "className": action === "CROP" ? "is-selected" : "",
        "onClick": () => handleAndSave("CROP"),
      },
      tooltip: t("crop"),
    },
    {
      type: "button",
      name: "blur",
      props: {
        "color": "tertiary",
        "leftIcon": <Blur />,
        "aria-label": t("blur"),
        "children": t("blur"),
        "className": action === "BLUR" ? "is-selected" : "",
        "onClick": () => handleAndSave("BLUR"),
      },
      tooltip: t("blur"),
    },
  ];

  return (
    <Toolbar
      variant="no-shadow"
      align="left"
      isBlock
      items={ImageEditorItems}
    />
  );
};
export default ImageEditorToolbar;
