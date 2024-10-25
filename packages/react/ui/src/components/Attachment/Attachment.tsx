import { ComponentPropsWithRef, forwardRef, ReactNode, Ref } from "react";

import { Paperclip } from "@edifice-ui/icons";

export interface AttachmentProps extends ComponentPropsWithRef<"div"> {
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
    { name = "Attachment Name", options, ...restProps }: AttachmentProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    return (
      <div ref={ref} className="attachment px-12 py-8" {...restProps}>
        <Paperclip height={22} width={22} />
        <div className="filename text-truncate">{name}</div>
        {options && <div className="options ps-12">{options}</div>}
      </div>
    );
  },
);

Attachment.displayName = "Attachment";

export default Attachment;
