import { useTranslation } from 'react-i18next';
import { Button } from '../../..';
import { IconSend } from '../../icons/components';
import { useAutosizeTextarea } from '../hooks/useAutosizeTextarea';
import { useCommentsContext } from '../hooks/useCommentsContext';
import { CommentAvatar } from './CommentAvatar';
import { TextCounter } from './TextCounter';
import { useState } from 'react';

export const CommentForm = ({
  userId,
  replyTo,
}: {
  userId: string;
  replyTo?: string;
}) => {
  const [content, setContent] = useState<string>('');
  const { handleCreateComment, options, type } = useCommentsContext();
  const [ref, onFocus] = useAutosizeTextarea();
  const { t } = useTranslation();

  const handleChangeContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContent(event.target.value);
  };

  const handleSubmit = () => {
    handleCreateComment(content, replyTo);
    setContent('');
  };

  return (
    <>
      {type === 'edit' && (
        <div className="border rounded-3 p-12 pb-8 d-flex gap-12 bg-gray-200">
          <CommentAvatar id={userId as string} />
          <div className="d-flex flex-column flex-fill gap-4">
            <textarea
              id="add-comment"
              ref={ref}
              value={content}
              className="form-control"
              placeholder={t('comment.placeholder.textarea')}
              maxLength={options.maxCommentLength as number}
              onChange={handleChangeContent}
              onFocus={onFocus}
              rows={1}
              style={{ resize: 'none', overflow: 'hidden' }}
            />
            <div className="d-flex justify-content-end align-items-center gap-4">
              <TextCounter
                content={content}
                maxLength={options.maxCommentLength as number}
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                leftIcon={<IconSend />}
                disabled={!content?.length}
                onClick={handleSubmit}
              >
                {t('comment.post')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
