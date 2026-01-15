import { useEffect } from 'react';
import {
  IconClose,
  IconDownload,
  IconExternalLink,
} from '../../modules/icons/components';
import { SmartEllipsis } from '../SmartEllipsis';
import { Flex } from '../Flex';
import { IconButton } from '../Button';

export default function ToolbarViewer({
  onClose,
  mediaName,
  mediaUrl,
  nbMedia,
  currentIndex,
}: {
  onClose: () => void;
  mediaName: string;
  nbMedia?: number;
  mediaUrl?: string;
  currentIndex: number;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <Flex className="media-viewer-toolbar p-8" align="center">
      <Flex gap="8" align="center" style={{ minWidth: '50%' }}>
        <IconButton
          icon={<IconClose color="#fff" />}
          onClick={onClose}
          variant="ghost"
        />
        <SmartEllipsis text={mediaName} />
      </Flex>
      <Flex gap="8" align="center" justify="between" className="w-100">
        {nbMedia ? (
          <p>{`${currentIndex + 1}/${nbMedia} `}</p>
        ) : (
          <p>{`${currentIndex + 1}`}</p>
        )}
        {mediaUrl && (
          <Flex className="ms-8" gap="8" align="center">
            <a
              href={mediaUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton
                icon={<IconDownload color="#fff" />}
                variant="ghost"
              />
            </a>
            <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
              <IconButton
                icon={<IconExternalLink color="#fff" />}
                variant="ghost"
              />
            </a>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
