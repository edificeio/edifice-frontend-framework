export const TextCounter = ({
  content,
  maxLength,
}: {
  content: string;
  maxLength: number;
}) => {
  return (
    <p className="small text-gray-700 p-2 text-end">
      {`${content?.length || 0} / ${maxLength}`}
    </p>
  );
};
