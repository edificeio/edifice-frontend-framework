import clsx from 'clsx';

import { Skeleton } from '../../../../components';

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
        <Skeleton className="editor-preview-skeleton-line col-12" />
        <Skeleton className="editor-preview-skeleton-line col-12" />
        <div className="d-flex justify-content-center gap-24 px-32 pt-16">
          <div style={{ maxWidth: '150px' }} className="col-12 col-md-4">
            <div className="ratio ratio-16x9">
              <Skeleton variant="block" tone="strong" />
            </div>
          </div>
          <div style={{ maxWidth: '150px' }} className="col-12 col-md-4">
            <div className="ratio ratio-16x9">
              <Skeleton variant="block" tone="strong" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPreview;
