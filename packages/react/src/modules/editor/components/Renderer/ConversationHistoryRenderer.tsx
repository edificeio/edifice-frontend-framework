import { useState } from 'react';

import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../components';
import { IconRafterDown, IconRafterUp } from '../../../icons/components';

const ConversationHistoryRenderer = () => {
  const { t } = useTranslation('conversation');

  // const appCode = getIconCode(appPrefix);
  const [open, setOpen] = useState(false);

  const classes = clsx('conversation-history ps-16', { show: open });

  const handleButtonClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <NodeViewWrapper as="div" contentEditable={false}>
      <Button
        variant="ghost"
        data-testid="conversation-history-button"
        onClick={handleButtonClick}
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
