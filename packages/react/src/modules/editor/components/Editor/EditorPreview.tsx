import { useEffect, useState } from 'react';

import clsx from 'clsx';

import { getThumbnail } from '@edifice.io/utilities';
import { useTranslation } from 'react-i18next';
import { Image } from '../../../../components';

/**
 * Editor component properties
 */
export interface EditorPreviewProps {
  /** Rich content to render. */
  content: string;
  /** Display with or without a border */
  variant?: 'outline' | 'ghost';
  onDetailClick?: () => void;
  onMediaClick?: () => void;
  maxMediaDisplayed?: number;
}

const EditorPreview = ({
  content,
  variant = 'outline',
  onDetailClick,
  onMediaClick,
  maxMediaDisplayed = 3,
}: EditorPreviewProps) => {
  const { t } = useTranslation();
  const [summaryContent, setSummaryContent] = useState<string>('');
  const [medias, setMedias] = useState<
    {
      url: string;
      alt: string;
    }[]
  >([]);

  const borderClass = clsx(
    variant === 'outline' && 'border rounded-3 py-12 px-16',
  );

  const hasMediaCallback = onDetailClick || onMediaClick;

  const handleMediaClick = (e: React.MouseEvent) => {
    if (onMediaClick) {
      e.stopPropagation();
      onMediaClick();
    }
  };

  useEffect(() => {
    const contentHTML = content;
    if (contentHTML) {
      // Use DOMParser to safely parse the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(contentHTML, 'text/html');

      // Extract media URLs from <img>, <video>, <iframe>, <audio>, <embed>
      const mediaElements = Array.from(
        doc.querySelectorAll('img, video, iframe, audio, embed'),
      );

      setMedias(
        mediaElements
          .filter((el) => el.tagName.toLowerCase() === 'img')
          .map((el) => {
            const image = el as HTMLImageElement;
            if (image.src) {
              return { url: getThumbnail(image.src, 0, 300), alt: image.alt };
            }
            return { url: '', alt: '' };
          }),
      );

      // Remove media elements from the document for summary content
      mediaElements.forEach((el) => el.parentNode?.removeChild(el));

      // Get the text content for summary
      setSummaryContent(doc.body.textContent || '');
    }
  }, [content]);

  return (
    <div
      className={borderClass}
      data-testid="editor-preview"
      onClick={onDetailClick}
      tabIndex={onDetailClick ? -1 : undefined}
      role={onDetailClick ? 'button' : undefined}
    >
      <div
        className="flex-fill text-truncate text-truncate-2 post-preview-content overflow-hidden"
        style={{
          overflowWrap: 'anywhere',
        }}
      >
        {summaryContent}
      </div>
      <div
        onClick={handleMediaClick}
        tabIndex={hasMediaCallback ? -1 : undefined}
        role={hasMediaCallback ? 'button' : undefined}
        className="d-flex align-items-center justify-content-center gap-24 px-32 pt-16"
      >
        {medias.slice(0, maxMediaDisplayed).map((media, index) => (
          <div
            className={clsx('position-relative col-12 col-md-4 ', {
              'd-none d-md-block': index >= 1,
            })}
            key={media.url}
          >
            <Image
              alt={media.alt}
              objectFit="cover"
              ratio="16"
              className="rounded"
              loading="lazy"
              src={media.url}
              sizes=""
            />
            {(index === 0 || index === 2) &&
              medias.length - (index + 1) > 0 && (
                <div
                  className={clsx(
                    'position-absolute top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-center rounded text-light bg-dark bg-opacity-50',
                    {
                      'd-flex d-md-none': index === 0,
                      'd-none d-md-flex': index === 2,
                    },
                  )}
                >
                  {t('editor.preview.moreMedia', {
                    mediaCount: medias.length - (index + 1),
                  })}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorPreview;
