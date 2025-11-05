import { Role } from '@edifice.io/client';
import clsx from 'clsx';
import { IconPaperclip } from '../../icons/components';

const FileIcon = ({
  type,
  roleMap,
}: {
  type: Role | 'unknown';
  roleMap?: {
    icon: React.ReactNode | string;
    color: string;
    hasShadow?: boolean;
  };
}) => {
  // has shadow if the icon is not a string (i.e., it's a React component) and the type is not 'unknown' and hasShadow is not explicitly set to false
  const hasShadow =
    typeof roleMap?.icon !== 'string' &&
    type !== 'unknown' &&
    roleMap?.hasShadow !== false;
  const fileicon = clsx(
    'position-absolute rounded-circle top-50 start-50 translate-middle',
    {
      'p-12 rounded-circle shadow': hasShadow,
    },
    roleMap?.color,
  );

  return <div className={fileicon}>{roleMap?.icon ?? <IconPaperclip />}</div>;
};

export default FileIcon;
