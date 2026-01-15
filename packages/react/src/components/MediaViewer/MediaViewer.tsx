import { Carousel } from 'antd';
import ToolbarZoom from './ToolbarZoom';
import useZoom from '../../hooks/useZoom/useZoom';
import ToolbarViewer from './ToolbarViewer';
import { Flex } from '../Flex';
import { useEffect, useState } from 'react';
import { MediaWrapper } from './MediaWrapper';
import { MediaLibraryType } from 'src/modules/multimedia';

export interface MediaProps {
  name: string;
  url: string;
  type: MediaLibraryType;
  mimeType?: string;
}

interface MediaViewerProps {
  onClose: () => void;
  media: MediaProps[];
  indexMedia?: number;
}

const MediaViewer = ({ onClose, media, indexMedia = 0 }: MediaViewerProps) => {
  const { zoomIn, zoomOut, setScale, scale } = useZoom(1);

  const [currentIndex, setCurrentIndex] = useState<number>(indexMedia);

  useEffect(() => {
    setCurrentIndex(indexMedia);
  }, [indexMedia]);

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
            initialSlide={indexMedia}
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
              <div key={index} className="viewer-slide">
                <MediaWrapper
                  mediaUrl={item.url}
                  mediaType={item.type}
                  mimeType={item.mimeType}
                  scale={index === currentIndex ? scale : 1}
                />
              </div>
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
