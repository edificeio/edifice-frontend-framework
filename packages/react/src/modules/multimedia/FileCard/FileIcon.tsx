import clsx from "clsx";
import { Role } from "edifice-ts-client";
import { IconPaperclip } from "../../icons/components";

const FileIcon = ({
  type,
  roleMap,
}: {
  type: Role | "unknown";
  roleMap?: Record<string, string | JSX.Element>;
}) => {
  const hasNoShadow = typeof roleMap?.icon !== "string" && type !== "unknown";
  const fileicon = clsx(
    "position-absolute top-50 start-50 translate-middle",
    {
      "p-12 rounded-circle shadow": hasNoShadow,
    },
    roleMap?.color,
  );

  return <div className={fileicon}>{roleMap?.icon ?? <IconPaperclip />}</div>;
};

export default FileIcon;
