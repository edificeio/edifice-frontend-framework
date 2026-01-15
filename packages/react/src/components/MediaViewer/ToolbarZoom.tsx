import {
  IconMinus,
  IconPlus,
  IconZoomIn,
} from '../../modules/icons/components';
import { IconButton } from '../Button';
import { Flex } from '../Flex';

export default function ToolbarZoom({
  zoomIn,
  zoomOut,
}: {
  zoomIn: () => void;
  zoomOut: () => void;
}) {
  return (
    <Flex justify="center" className="media-viewer-toolbar-zoom-container">
      <Flex gap="4" className="p-12 media-viewer-toolbar-zoom" align="center">
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
