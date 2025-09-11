import clsx from 'clsx';

import { Image, TextSkeleton } from '../../../../components';

/**
 * Editor component properties
 */
export interface EditorPreviewSkeletonProps {
  variant?: 'outline' | 'ghost';
}

const EditorPreview = ({ variant = 'outline' }: EditorPreviewSkeletonProps) => {
  const borderClass = clsx(variant === 'outline' && 'border rounded-3');
  const contentClass = clsx('mt-16', variant === 'outline' && 'my-12 mx-16');

  return (
    <div className={borderClass} data-testid="editor-preview">
      <div className={contentClass}>
        <TextSkeleton className="col-12"></TextSkeleton>
        <TextSkeleton className="col-12"></TextSkeleton>
        <div className="d-flex justify-content-center gap-24 px-32 pt-16">
          <div style={{ maxWidth: '150px' }} className="col-12 col-md-4">
            <Image
              alt=""
              objectFit="cover"
              ratio="16"
              className="rounded placeholder"
              src={''}
              sizes=""
            />
          </div>
          <div style={{ maxWidth: '150px' }} className="col-12 col-md-4">
            <Image
              alt=""
              objectFit="cover"
              ratio="16"
              className="rounded placeholder"
              src={''}
              sizes=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPreview;
