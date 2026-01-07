import { Flex, IconButton } from "@edifice.io/react";
import { IconMinus, IconPlus, IconZoomIn } from "@edifice.io/react/icons";

export default function ToolbarZoom({
  zoomIn,
  zoomOut,
}: {
  zoomIn: () => void;
  zoomOut: () => void;
}) {
  return (
    <Flex
      justify="center"
      className="media-viewer-toolbar-zoom-container"
    >
      <Flex
        gap="4"
        className="p-12 media-viewer-toolbar-zoom"
        align="center"
      >
        <IconButton
          variant="ghost"
          icon={<IconMinus color="#fff" />}
          onClick={zoomOut}
        />

        <IconZoomIn color="#fff" className="m-4" />
        <IconButton
          variant="ghost"
          icon={<IconPlus color="#fff" />}
          onClick={zoomIn}
        />
      </Flex>
    </Flex>
  );
}
