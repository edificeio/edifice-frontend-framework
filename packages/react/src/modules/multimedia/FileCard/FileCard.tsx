import { useRef, ReactNode } from 'react';

import {
  DocumentHelper,
  Role,
  WorkspaceElement,
  odeServices,
} from '@edifice.io/client';
import clsx from 'clsx';

import { Card, CardProps } from '../../../components';
import { useThumbnail } from '../../../hooks/useThumbnail';
import {
  IconLandscape,
  IconMic,
  IconTextPage,
  IconVideo,
} from '../../icons/components';
import FileIcon from './FileIcon';

export interface FileCardProps extends CardProps {
  /**
   * WorkspaceElement
   */
  doc: WorkspaceElement;

  /**
   * Custom icon to override the default based on file type
   * Can be a string or a React node
   */
  customIcon?: ReactNode;

  /**
   * Custom color class to override the default based on file type
   * Example: "bg-purple-300" or any valid CSS class
   */
  customColor?: string;
}

// INFO: This component is for internal use only. It is not exported for external use.
const FileCard = ({
  doc,
  isClickable = true,
  isSelectable = false,
  isSelected = false,
  onClick,
  className,
  onSelect,
  isFocused,
  app,
  customIcon,
  customColor,
}: FileCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const type = DocumentHelper.getRole(doc);

  function getRoleMap(type: Role | 'unknown'): {
    icon: ReactNode | string;
    color: string;
    hasShadow?: boolean;
  } {
    // If custom icon and color are provided, use them instead of the default mapping
    if (customIcon !== undefined || customColor !== undefined) {
      return {
        icon: customIcon || <IconTextPage width={22} height={22} />,
        color: customColor || 'bg-gray-300',
        hasShadow: false,
      };
    }

    const roleMappings = {
      csv: {
        icon: '.CSV',
        color: 'bg-orange-200',
      },
      xls: {
        icon: '.XLS',
        color: 'bg-green-200',
      },
      doc: {
        icon: '.DOC',
        color: 'bg-blue-200',
      },
      txt: {
        icon: '.TXT',
        color: 'bg-blue-200',
      },
      pdf: {
        icon: '.PDF',
        color: 'bg-red-200',
      },
      audio: {
        icon: <IconMic width={22} height={22} />,
        color: 'bg-red-200',
      },
      ppt: {
        icon: '.PPT',
        color: 'bg-red-200',
      },
      img: {
        icon: <IconLandscape width={22} height={22} />,
        color: 'bg-green-200',
      },
      video: {
        icon: <IconVideo width={22} height={22} />,
        color: 'bg-purple-200',
      },
      zip: {
        icon: '.ZIP',
        color: 'bg-gray-300',
      },
      md: {
        icon: '.MD',
        color: 'bg-blue-200',
      },
      unknown: {
        icon: <IconTextPage width={22} height={22} />,
        color: 'bg-gray-300',
      },
    };

    return roleMappings[type] || roleMappings.unknown;
  }

  const roleMap = getRoleMap(type ?? 'unknown');

  const file = clsx(
    'file position-relative rounded',
    roleMap?.color ?? 'bg-yellow-200',
  );

  const mediaSrc =
    doc.eType === 'resource'
      ? (doc as any).thumbnail
      : type === 'img' || type === 'video'
        ? odeServices.workspace().getThumbnailUrl(doc)
        : null;

  const hasThumbnail = useThumbnail(mediaSrc!, { ref });

  const imageStyles = hasThumbnail && {
    backgroundImage: `url(${mediaSrc})`,
    backgroundSize: 'cover',
  };

  return (
    <Card
      className={clsx('card-file', className)}
      isClickable={isClickable}
      isSelectable={isSelectable}
      isSelected={isSelected}
      onClick={onClick}
      app={app}
      isFocused={isFocused}
      onSelect={onSelect}
    >
      <Card.Body space="8">
        <div
          ref={ref}
          className={file}
          style={{
            aspectRatio: '16/10',
            ...imageStyles,
          }}
        >
          {type !== 'img' || (type === 'img' && !hasThumbnail) ? (
            <FileIcon type={type} roleMap={roleMap} />
          ) : null}
        </div>
        <div className="mt-4">
          <Card.Text>{doc.name}</Card.Text>
          <Card.Text className="text-black-50">{doc?.ownerName}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
};

FileCard.displayName = 'FileCard';

export default FileCard;
