import clsx from 'clsx';
import { Skeleton } from '../../../../components';

export interface EditorSkeletonProps {
  /** Mode of the editor, either 'edit' or 'read' */
  mode?: 'edit' | 'read';
  /** Display with or without a border */
  variant?: 'outline' | 'ghost';
}

const EditorSkeleton = ({
  mode = 'read',
  variant = 'outline',
}: EditorSkeletonProps) => {
  const contentClass = clsx(
    'd-flex flex-column gap-16 position-relative flex-fill',
    variant === 'outline' && 'border rounded-3 py-12 px-16',
  );
  if (mode === 'edit') {
    return (
      <div className={contentClass}>
        <div className="d-flex col-12 gap-8 py-8 px-16">
          <Skeleton className="editor-skeleton-button col-2 flex-shrink-1" />
          <Skeleton className="editor-skeleton-button col-4" />
          <Skeleton className="editor-skeleton-button col-4" />
          <Skeleton className="editor-skeleton-button col-2" />
        </div>
        <div className="d-flex flex-column gap-8 px-16">
          <Skeleton className="col-10" />
          <Skeleton className="col-7" />
          <Skeleton className="col-8" />
          <Skeleton className="col-6" />
        </div>
      </div>
    );
  }

  return (
    <div className={contentClass}>
      <Skeleton className="col-10" />
      <Skeleton className="col-7" />
      <Skeleton className="col-8" />
    </div>
  );
};

EditorSkeleton.displayName = 'EditorSkeleton';

export default EditorSkeleton;
