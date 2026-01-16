import { useTranslation } from 'react-i18next';

export const CommentDeleted = () => {
  const { t } = useTranslation();

  return (
    <div
      data-testid="div-comment-deleted"
      className="border rounded-3 p-12 pb-8 d-flex gap-12 bg-gray-200 my-16"
    >
      {t('comment.deleted')}
    </div>
  );
};
