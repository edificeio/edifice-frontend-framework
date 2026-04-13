import { useMemo } from 'react';

import clsx from 'clsx';

import { Flex } from '../../../../components';
import { useDate } from '../../../../hooks/useDate';

export interface LastInfosProps {
  /**
   * ID of the info.
   */
  id: number | string;
  /**
   * URL of the icon to display in the upper left corner.
   * i.e. "/workspace/document/36a04526-15a2-4e8f-adb6-cca75630e50d"
   */
  icon: string;
  /**
   * ID of the thread to be displayed next to the icon.
   */
  threadId: number | string;
  /**
   * Name of the thread to be displayed next to the icon.
   * i.e. "Informations importantes"
   */
  threadName: string;
  /**
   * Title of the info.
   */
  title: string;
  /**
   * Content of the info.
   */
  content: string;
  /**
   * Publication date in ISO format.
   */
  publicationDate: string;
  /**
   * Whether the info is highlighted.
   */
  isHeadline: boolean;
  /**
   * Name of the user who posted this info.
   */
  username: string;
  /**
   * Handle the click event.
   */
  onClick?: (threadId: number | string, id: number | string) => void;
}

const LastInfos = ({
  id,
  icon,
  threadId,
  threadName,
  content,
  publicationDate,
  isHeadline,
  title,
  onClick,
}: LastInfosProps) => {
  const { formatDate } = useDate();

  const { excerpt, images } = useMemo(() => {
    if (!content) {
      return { excerpt: '', images: [] as string[] };
    }

    if (typeof DOMParser === 'undefined') {
      const plainText = content.replace(/<[^>]*>/g, ' ').trim();
      return { excerpt: plainText, images: [] as string[] };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const imageSources = Array.from(doc.querySelectorAll('img'))
      .map((image) => image.getAttribute('src') ?? '')
      .filter((src) => src.trim().length > 0);

    Array.from(
      doc.querySelectorAll('img, video, iframe, audio, embed'),
    ).forEach((mediaElement) => {
      mediaElement.parentNode?.removeChild(mediaElement);
    });

    return {
      excerpt: (doc.body.textContent ?? '').trim(),
      images: imageSources,
    };
  }, [content]);

  const previewImages = images.slice(0, 3);
  const hasMoreImages = images.length > 2;
  const remainingImagesCount = Math.max(images.length - 2, 0);

  const actionLabel = `${threadName} - ${title}`;

  return (
    <article
      className={clsx('last-infos-card', {
        'last-infos-card-headline': isHeadline,
        'last-infos-card-clickable': Boolean(onClick),
      })}
    >
      {onClick && (
        <button
          type="button"
          className="last-infos-card-action"
          onClick={() => onClick(threadId, id)}
          aria-label={actionLabel}
        />
      )}

      <header className="last-infos-card-header">
        <Flex
          gap="8"
          align="center"
          justify="start"
          className="last-infos-card-thread"
        >
          <img
            src={icon}
            alt={threadName}
            width={24}
            height={24}
            loading="lazy"
            className="last-infos-card-thread-icon"
          />
          <span className="last-infos-card-thread-name">{threadName}</span>
        </Flex>
        <time className="last-infos-card-date">
          {formatDate(publicationDate, 'short')}
        </time>
      </header>

      <Flex gap="4" direction="column" className="last-infos-card-content">
        <p className="last-infos-card-title fw-bold">{title}</p>

        <p className="last-infos-card-excerpt text-truncate-2">{excerpt}</p>

        {previewImages.length > 0 && (
          <div className="last-infos-card-medias">
            {previewImages.map((image, index) => (
              <div className="last-infos-card-media" key={`${image}-${index}`}>
                <img
                  src={image}
                  alt=""
                  className="last-infos-card-media-image"
                  loading="lazy"
                />

                {hasMoreImages && index === 2 && (
                  <div className="last-infos-card-media-overlay">
                    +{remainingImagesCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Flex>
    </article>
  );
};

LastInfos.displayName = 'LastInfos';

export default LastInfos;
