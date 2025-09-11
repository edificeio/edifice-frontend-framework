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
  handleClickOnDetail?: () => void;
  handleClickOnMedia?: () => void;
  maxMediaDisplayed?: number;
}

const EditorPreview = ({
  content,
  variant = 'outline',
  handleClickOnDetail,
  handleClickOnMedia,
  maxMediaDisplayed = 3,
}: EditorPreviewProps) => {
  const { t } = useTranslation();
  const [summaryContent, setSummaryContent] = useState<string>('');
  const [mediaURLs, setMediaURLs] = useState<string[]>([]);

  const borderClass = clsx(
    variant === 'outline' && 'border rounded-3 py-12 px-16',
  );
  const contentClass = clsx(
    'flex-fill text-truncate text-truncate-2 post-preview-content overflow-hidden',
  );

  const stripHtml = (html: string) => {
    // Create a temporary element
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    // Get text content only
    return tmp.textContent || tmp.innerText || '';
  };

  useEffect(() => {
    let contentHTML = content;
    if (contentHTML) {
      const getMediaTags = /<(img|video|iframe|audio|embed)[^>]*>(<\/\1>)?/gim;
      const getSrc = /src=(?:"|')([^"|']*)(?:"|')/;
      const mediaTags = contentHTML.match(getMediaTags);
      contentHTML = contentHTML.replace(getMediaTags, '');
      if (mediaTags?.length) {
        setMediaURLs(
          mediaTags
            .filter((tag) => tag.includes('img'))
            .map((tag) => {
              const srcMatch = getSrc.exec(tag);
              if (srcMatch?.length) {
                return getThumbnail(srcMatch[1], 0, 300);
              }
              return '';
            }) || [],
        );
      }

      setSummaryContent(stripHtml(contentHTML));
    }
  }, [content]);

  return (
    <div className={borderClass} data-testid="editor-preview">
      <div
        onClick={handleClickOnDetail}
        tabIndex={handleClickOnDetail ? -1 : undefined}
        role={handleClickOnDetail ? 'button' : undefined}
        className={contentClass}
      >
        {summaryContent}
      </div>
      <div
        onClick={handleClickOnMedia}
        tabIndex={handleClickOnMedia ? -1 : undefined}
        role={handleClickOnMedia ? 'button' : undefined}
        className="d-flex align-items-center justify-content-center gap-24 px-32 pt-16"
      >
        {mediaURLs.slice(0, maxMediaDisplayed).map((url, index) => (
          <div
            className={clsx('position-relative col-12 col-md-4 ', {
              'd-none d-md-block': index >= 1,
            })}
            style={{ maxWidth: '150px' }}
            key={url}
          >
            <Image
              alt=""
              objectFit="cover"
              ratio="16"
              className="rounded"
              src={url}
              sizes=""
            />
            {(index === 0 || index === 2) &&
              mediaURLs.length - (index + 1) > 0 && (
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
                    mediaCount: mediaURLs.length - (index + 1),
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
