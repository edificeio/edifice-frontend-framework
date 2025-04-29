import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../components';
import { useToggle } from '../../../../hooks';
import { IconRafterDown, IconRafterUp } from '../../../icons/components';

/**
 * `ConversationHistoryRenderer` is a React component that renders a button to toggle the visibility
 * of conversation history content. It uses the `@tiptap/react` library for rendering content and
 * `clsx` for conditional class names. The component also utilizes the `useTranslation` hook from
 * `react-i18next` for internationalization and a custom `useToggle` hook for managing the open state.
 */
const ConversationHistoryRenderer = () => {
  const { t } = useTranslation('conversation');

  // const appCode = getIconCode(appPrefix);
  const [open, toggleOpen] = useToggle(false);

  const classes = clsx('conversation-history ps-16 pt-8', { show: open });
  return (
    <NodeViewWrapper as="div" contentEditable={false}>
      <Button
        variant="ghost"
        onClick={toggleOpen}
        size="sm"
        className="d-flex align-items-center gap-4 text-gray-800 fs-6 mt-24"
      >
        {open ? (
          <>
            {t('message.history.hide')}
            <IconRafterUp width={16} height={16} />
          </>
        ) : (
          <>
            {t('message.history.show')}
            <IconRafterDown width={16} height={16} />
          </>
        )}
      </Button>
      <div className={classes} data-testid="conversation-history-content">
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
};

export default ConversationHistoryRenderer;
