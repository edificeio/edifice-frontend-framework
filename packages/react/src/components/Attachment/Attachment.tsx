import { ComponentPropsWithRef, forwardRef, ReactNode, Ref } from 'react';

import { Tooltip } from '..';
import { IconPaperclip } from '../../modules/icons/components';

export interface AttachmentProps extends ComponentPropsWithRef<'div'> {
  /**
   * Name of resource or Folder
   * */
  name?: string;
  /**
   * Actions attachment
   * */
  options: ReactNode | undefined;
}

export type AttachmentType = AttachmentProps;

const Attachment = forwardRef(
  (
    { name = 'Attachment Name', options, ...restProps }: AttachmentProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={ref}
        className="attachment px-12 py-8"
        {...restProps}
        tabIndex={0}
      >
        <Tooltip
          message={name}
          className="filename text-truncate d-flex align-items-center gap-8"
        >
          <IconPaperclip height={22} width={22} />
          <div className="filename text-truncate">{name}</div>
        </Tooltip>
        {options && <div className="options ps-12">{options}</div>}
      </div>
    );
  },
);

Attachment.displayName = 'Attachment';

export default Attachment;
