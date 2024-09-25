import { Role } from '@edifice.io/ts-client';
import clsx from 'clsx';
import { Icon } from '..';

const FileIcon = ({
  type,
  roleMap,
}: {
  type: Role | 'unknown';
  roleMap?: Record<string, string | JSX.Element>;
}) => {
  const hasNoShadow = typeof roleMap?.icon !== 'string' && type !== 'unknown';
  const fileicon = clsx(
    'position-absolute top-50 start-50 translate-middle',
    {
      'p-12 rounded-circle shadow': hasNoShadow,
    },
    roleMap?.color,
  );

  return (
    <div className={fileicon}>{roleMap?.icon ?? <Icon name="paperclip" />}</div>
  );
};

export default FileIcon;