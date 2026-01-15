import IconTextPage from '../../modules/icons/components/IconTextPage';
import IconLink from '../../modules/icons/components/IconLink';
import IconHeadphone from '../../modules/icons/components/IconHeadphone';
import IconDownload from '../../modules/icons/components/IconDownload';
import IconExternalLink from '../../modules/icons/components/IconExternalLink';
import { Flex } from '../Flex';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import PdfViewer from './PdfViewer';
import { MediaLibraryType } from 'src/modules/multimedia';
import { Image } from '../Image';

export const MediaWrapper = ({
  mediaUrl,
  mediaType,
  mimeType,
  scale,
}: {
  mediaUrl: string;
  mediaType: MediaLibraryType;
  mimeType?: string;
  scale?: number;
}) => {
  const { t } = useTranslation();

  const imageMediaStyle: React.CSSProperties = {
    flex: 'none',
    height: '100%',
    transform: `scale(${scale})`,
    maxHeight: '70vh',
  };
  const audioStyle: React.CSSProperties = { width: '100%', maxWidth: '500px' };

  const videoMediaStyle: React.CSSProperties = {
    height: '100%',
    objectFit: 'cover',
    transform: `scale(${scale})`,
  };

  const iframeMediaStyle: React.CSSProperties = {
    width: '100%',
    height: '600px',
    maxWidth: '900px',
    transform: `scale(${scale})`,
  };

  switch (mediaType) {
    case 'image':
      return (
        <Image
          className="rounded-2"
          src={mediaUrl}
          alt={mediaType}
          width="100%"
          objectFit={'contain'}
          style={imageMediaStyle}
        />
      );
    case 'audio':
      return (
        <Flex direction="column" align="center" style={{ height: '200px' }}>
          <Flex
            justify="center"
            align="center"
            className="bg-gray-300 h-100 w-100 rounded-2 mb-8"
            style={{ maxWidth: '500px' }}
          >
            <IconHeadphone width={40} height={40} color="#B0B0B0" />
          </Flex>
          <audio
            src={mediaUrl}
            className="media-audio"
            controls
            style={audioStyle}
          />
        </Flex>
      );
    case 'video':
      return (
        <Flex justify="center" align="center">
          <video
            src={mediaUrl}
            controls
            className="media-video"
            style={videoMediaStyle}
          />
        </Flex>
      );
    case 'embedder':
      return (
        <Flex justify="center" align="center">
          <iframe
            title="Embedded media content"
            src={mediaUrl}
            className="media-video"
            style={iframeMediaStyle}
          />
        </Flex>
      );
    case 'hyperlink':
    case 'attachment':
      return mimeType && mimeType === 'application/pdf' ? (
        <PdfViewer mediaUrl={mediaUrl} scale={scale} />
      ) : (
        <Flex direction="column" align="center">
          <Flex
            justify="center"
            align="center"
            className="bg-gray-300 w-100 rounded-2 mb-8"
            style={{ maxWidth: '500px', height: '200px' }}
          >
            {mediaType === 'hyperlink' ? (
              <IconLink width={40} height={40} color="#B0B0B0" />
            ) : (
              <IconTextPage width={40} height={40} color="#B0B0B0" />
            )}
          </Flex>
          <a
            className="w-100 d-flex justify-content-center"
            href={mediaUrl}
            download={mediaType === 'hyperlink' ? false : true}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="w-100"
              style={{ height: '40px', maxWidth: '500px' }}
              leftIcon={
                mediaType === 'hyperlink' ? (
                  <IconExternalLink />
                ) : (
                  <IconDownload />
                )
              }
              color="tertiary"
            >
              {mediaType === 'hyperlink'
                ? t('mediaWrapper.attachment.open')
                : t('mediaWrapper.attachment.download')}
            </Button>
          </a>
        </Flex>
      );
    default:
      return null;
  }
};
