import { Heading } from "../../../components/Heading";

export const CommentHeader = ({ title }: { title: string }) => {
  return (
    <Heading level="h3" headingStyle="h3">
      {title}
    </Heading>
  );
};
