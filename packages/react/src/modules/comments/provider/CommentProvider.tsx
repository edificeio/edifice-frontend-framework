import { useMemo } from 'react';
import { Button, EmptyScreen, Heading } from '../../..';
import { CommentForm } from '../components/CommentForm';
import { CommentList } from '../components/CommentList';
import {
  DEFAULT_ADD_COMMENTS,
  DEFAULT_ADD_REPLIES,
  DEFAULT_ALLOW_REPLIES,
  DEFAULT_MAX_COMMENTS,
  DEFAULT_MAX_COMMENT_LENGTH,
  DEFAULT_MAX_REPLIES,
  DEFAULT_MAX_REPLY_LENGTH,
} from '../constants';
import { CommentContext } from '../context/Context';
import { useComments } from '../hooks/useComments';
import { CommentOptions, RootProps } from '../types';

const CommentProvider = ({
  comments: defaultComments,
  options: commentOptions,
  ...props
}: RootProps) => {
  const options = {
    maxCommentLength: DEFAULT_MAX_COMMENT_LENGTH,
    maxReplyLength: DEFAULT_MAX_REPLY_LENGTH,
    maxComments: DEFAULT_MAX_COMMENTS,
    additionalComments: DEFAULT_ADD_COMMENTS,
    maxReplies: DEFAULT_MAX_REPLIES,
    additionalReplies: DEFAULT_ADD_REPLIES,
    allowReplies: DEFAULT_ALLOW_REPLIES,
    ...commentOptions,
  } as CommentOptions;

  const { type } = props;

  const {
    profilesQueries,
    title,
    user,
    emptyscreenPath,
    displayedComments,
    showMoreComments,
    editCommentId,
    setEditCommentId,
    replyToCommentId,
    setReplyToCommentId,
    t,
    handleMoreComments,
    handleDeleteComment,
    handleCreateComment,
    handleModifyComment,
    handleUpdateComment,
    handleReplyToComment,
    handleReset,
  } = useComments({
    type,
    defaultComments,
    callbacks: type == 'edit' ? props.callbacks : null,
    options,
  });

  const userRights = type === 'edit' ? props.rights : undefined;

  const values = useMemo(
    () => ({
      displayedComments,
      defaultComments,
      profiles: profilesQueries.data,
      editCommentId,
      replyToCommentId,
      options,
      type,
      userRights,
      setEditCommentId,
      setReplyToCommentId,
      handleCreateComment,
      handleModifyComment,
      handleUpdateComment,
      handleDeleteComment,
      handleReplyToComment,
      handleReset,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedComments, editCommentId, profilesQueries, options],
  );

  return (
    <CommentContext.Provider value={values}>
      <div className="my-24">
        <Heading
          data-testid="comments-info-count-text"
          level="h3"
          headingStyle="h3"
          className={displayedComments.length === 0 ? 'd-print-none' : ''}
        >
          {title}
        </Heading>

        <div className="my-24">
          {user && <CommentForm userId={user.userId} />}
          {!profilesQueries.isLoading && (
            <>
              <CommentList />

              {showMoreComments && (
                <Button
                  variant="ghost"
                  color="tertiary"
                  onClick={handleMoreComments}
                  className="my-16"
                >
                  {t('comment.more')}
                </Button>
              )}
            </>
          )}
        </div>

        {!displayedComments.length && type === 'edit' && (
          <div className="comments-emptyscreen d-print-none">
            <div className="comments-emptyscreen-wrapper">
              <EmptyScreen imageSrc={emptyscreenPath} size={150} />
            </div>
            <p>{t('comment.emptyscreen')}</p>
          </div>
        )}
      </div>
    </CommentContext.Provider>
  );
};

export default CommentProvider;
