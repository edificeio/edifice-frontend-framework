import { useTranslation } from "react-i18next";
import { useDate } from "../../..";

export const CommentDate = ({
  createdAt,
  updatedAt,
}: {
  createdAt: number;
  updatedAt: number | undefined;
}) => {
  const { fromNow } = useDate();
  const { t } = useTranslation();

  const getPublishedDate = (date: number) =>
    t("comment.publish.date", {
      date: fromNow(date),
    });

  const getUpdatedDate = (date: number) =>
    t("comment.update.date", {
      date: fromNow(date),
    });

  if (updatedAt) {
    return (
      <>
        <span className="small text-gray-700">|</span>
        <span className="small text-gray-700">{getUpdatedDate(updatedAt)}</span>
      </>
    );
  }

  return createdAt ? (
    <>
      <span className="small text-gray-700">|</span>
      <span className="small text-gray-700">{getPublishedDate(createdAt)}</span>
    </>
  ) : null;
};
