import { Carousel } from 'antd';
import ToolbarZoom from './ToolbarZoom';
import useZoom from '../../hooks/useZoom/useZoom';
import ToolbarViewer from './ToolbarViewer';
import { Flex } from '../Flex';
import { useEffect, useState } from 'react';
import { MediaWrapper } from './MediaWraper';
import { MediaLibraryType } from 'dist';

/**
 * A divider component that renders a horizontal or vertical line to separate content.
 *
 * @param props - The component props
 * @param props.children - Content to be displayed inside the divider
 * @param props.vertical - Whether the divider is vertical. Defaults to false
 * @param props.className - Optional CSS class name for additional styling of the divider
 * @default 'border-gray-500'
 * @param props.style - Optional inline styles for the divider
 *
 * @returns A React component that renders a divider with the specified properties
 *
 * @example
 * ```tsx
 * // Basic horizontal divider
 * <Divider />
 *
 * // Divider with text content
 * <Divider>Section Title</Divider>
 *
 * // Vertical divider
 * <Divider vertical />
 *
 * // Custom colored divider
 * <Divider className="border-red-500" />
 * ```
 */
export interface MediaProps {
  name: string;
  url: string;
  type: MediaLibraryType;
  mimeType?: string;
}

interface MediaViewerProps {
  onClose: () => void;
  media: MediaProps[];
  initialIndex?: number;
}

const MediaViewer = ({
  onClose,
  media,
  initialIndex = 0,
}: MediaViewerProps) => {
  const { zoomIn, zoomOut, setScale, scale } = useZoom(1);

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);
  return (
    <div className="media-viewer">
      <ToolbarViewer
        onClose={onClose}
        mediaUrl={media[currentIndex].url}
        mediaName={media[currentIndex].name}
        nbMedia={media.length}
        currentIndex={currentIndex}
      />
      <Flex className="media-viewer-inner-overlay" onClick={onClose}>
        <div
          className="media-viewer-inner"
          onClick={(e) => e.stopPropagation()}
        >
          <Carousel
            initialSlide={initialIndex}
            dots={false}
            arrows
            draggable
            infinite={false}
            afterChange={(current) => {
              setCurrentIndex(current);
            }}
            beforeChange={() => {
              setScale(1);
            }}
          >
            {media.map((item, index) => (
              <MediaWrapper
                mediaUrl={item.url}
                mediaType={item.type}
                mimeType={item.mimeType}
                scale={index === currentIndex ? scale : 1}
              />
            ))}
          </Carousel>
          <ToolbarZoom zoomIn={zoomIn} zoomOut={zoomOut} />
        </div>
      </Flex>
    </div>
  );
};

MediaViewer.displayName = 'MediaViewer';

export default MediaViewer;
