import clsx from 'clsx';
import { ButtonSkeleton, TextSkeleton } from '../../../../components';

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
          <ButtonSkeleton className="col-2 flex-shrink-1"></ButtonSkeleton>
          <ButtonSkeleton className="col-4"></ButtonSkeleton>
          <ButtonSkeleton className="col-4"></ButtonSkeleton>
          <ButtonSkeleton className="col-2"></ButtonSkeleton>
        </div>
        <div className="d-flex flex-column gap-8 px-16">
          <TextSkeleton className="col-10"></TextSkeleton>
          <TextSkeleton className="col-7"></TextSkeleton>
          <TextSkeleton className="col-8"></TextSkeleton>
          <TextSkeleton className="col-6"></TextSkeleton>
        </div>
      </div>
    );
  }

  return (
    <div className={contentClass}>
      <TextSkeleton className="col-10"></TextSkeleton>
      <TextSkeleton className="col-7"></TextSkeleton>
      <TextSkeleton className="col-8"></TextSkeleton>
    </div>
  );
};

EditorSkeleton.displayName = 'EditorSkeleton';

export default EditorSkeleton;
