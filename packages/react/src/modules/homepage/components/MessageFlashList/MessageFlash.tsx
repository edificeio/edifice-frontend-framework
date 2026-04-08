import { IFlashMessageModel } from '@edifice.io/client';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Flex, IconButton, useEdificeClient } from '../../../..';
import {
  IconAlertTriangle,
  IconClose,
  IconInfoCircle,
} from '../../../icons/components';

export type MessageFlashProps = {
  /** Message to display */
  message: IFlashMessageModel;
  /** Callback when the message is closed */
  onCloseMessage?: (message: IFlashMessageModel) => void;
};

const MessageFlash = ({ message, onCloseMessage }: MessageFlashProps) => {
  const { currentLanguage } = useEdificeClient();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [hasOverflow, setHasOverflow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const checkContentTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { t } = useTranslation();

  let content = '';
  if (message.contents) {
    if (currentLanguage && message.contents[currentLanguage]) {
      content = message.contents[currentLanguage];
    } else if (message.contents['fr']) {
      content = message.contents['fr'];
    } else {
      content = Object.keys(message.contents)
        .map((key) => message.contents![key])
        .filter((cont) => cont !== null)[0];
    }
  }

  // Check if content overflows beyond two lines
  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        // Temporarily remove truncation to measure full height
        const element = contentRef.current;
        const originalClass = element.className;

        // Remove truncation classes to measure full content height
        element.className = element.className
          .replace(/text-truncate(-\d+)?/g, '')
          .trim();

        // Get line height and calculate if content exceeds 2 lines
        const computedStyle = window.getComputedStyle(element);
        const lineHeight =
          parseFloat(computedStyle.lineHeight) ||
          parseFloat(computedStyle.fontSize) * 1.2;
        const contentHeight = element.scrollHeight;
        const twoLinesHeight = lineHeight * 2;

        setHasOverflow(contentHeight > twoLinesHeight + 2); // +2 for tolerance

        // Restore original classes
        element.className = originalClass;
      }
    };

    // Check after component mounts and when content changes
    if (content) {
      if (checkContentTimeoutRef.current) {
        clearTimeout(checkContentTimeoutRef.current);
      }
      // Use timeout to ensure DOM is fully rendered
      checkContentTimeoutRef.current = setTimeout(checkOverflow, 0);
    }
  }, [content]);

  useEffect(() => {
    return () => {
      if (checkContentTimeoutRef.current) {
        clearTimeout(checkContentTimeoutRef.current);
      }
    };
  });

  const classes = clsx(
    'message-flash',
    message.color ? `message-flash-${message.color}` : null,
  );
  const classesContent = clsx(
    'message-flash-content',
    isCollapsed ? `text-truncate text-truncate-2` : null,
  );

  const handleCollapse = () => {
    setIsCollapsed((collapsed) => {
      return !collapsed;
    });
  };

  const handleClose = () => {
    onCloseMessage?.(message);
  };

  return (
    <Card className={classes} isClickable={false} isSelectable={false}>
      <IconButton
        variant="ghost"
        color="tertiary"
        icon={<IconClose />}
        onClick={handleClose}
        className="message-flash-close-button"
        data-testid={'message-flash-close-button'}
        aria-label={t('close.message', { title: message.title })}
        title={t('close.message', { title: message.title })}
      />
      <div
        className="message-flash-icon"
        role="img"
        aria-label={message.color === 'red' ? t('warning') : t('information')}
      >
        {message.color && message.color === 'red' ? (
          <IconAlertTriangle />
        ) : (
          <IconInfoCircle />
        )}
      </div>
      <Card.Body>
        <Flex direction="column">
          <Card.Title>{message.title}</Card.Title>
          <div ref={contentRef} className={classesContent}>
            {content}
          </div>
          <Flex justify="between" align="center">
            <div className="fst-italic">{message.signature || ''}</div>
            {hasOverflow && (
              <Button
                data-testid={
                  isCollapsed
                    ? 'message-flash-view-more-button'
                    : 'message-flash-view-less-button'
                }
                color="tertiary"
                variant="ghost"
                size="sm"
                className="btn-icon"
                onClick={handleCollapse}
                aria-controls={`message-flash-${message.id}-content`}
                aria-expanded={!isCollapsed}
              >
                {t(isCollapsed ? 'read.more' : 'read.less')}
              </Button>
            )}
          </Flex>
        </Flex>
      </Card.Body>
    </Card>
  );
};

MessageFlash.displayName = 'MessageFlash';

export default MessageFlash;
