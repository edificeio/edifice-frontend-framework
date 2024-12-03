import { forwardRef, Ref } from "react";

import clsx from "clsx";

import { Size } from "../../types";
import { useFormControl } from "../Form/FormContext";

export type OmitTextAreaProps =
  | "disabled"
  | "required"
  | "size"
  | "id"
  | "readOnly";

export interface TextAreaProps
  extends Omit<React.ComponentPropsWithRef<"textarea">, OmitTextAreaProps> {
  /**
   * Control size of TextArea
   */
  size: Size;
  /**
   * Control maxHeight of TextArea
   */
  height?: Size;
  /**
   * Change text of placeholder
   */
  placeholder?: string;
  /**
   * Disabled status
   */
  disabled?: boolean;
  /**
   * Remove validation icon
   */
  noValidationIcon?: boolean;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

/**
 * TextArea Form Component
 */

const TextArea = forwardRef(
  (
    {
      noValidationIcon,
      placeholder,
      size = "md",
      height = "md",
      className,
      ...restProps
    }: TextAreaProps,
    ref: Ref<HTMLTextAreaElement>,
  ) => {
    const { id, isRequired, isReadOnly, status } = useFormControl();

    const classes = clsx(
      {
        "form-control": !isReadOnly,
        "form-control-lg": size === "lg",
        "form-control-sm": size === "sm",
        "textarea-height-lg": height === "lg",
        "textarea-height-md": height === "md",
        "textarea-height-sm": height === "sm",
        "is-invalid": status === "invalid",
        "is-valid": status === "valid",
        "form-control-plaintext": isReadOnly,
        "no-validation-icon": noValidationIcon,
      },
      className,
    );

    return (
      <>
        <textarea
          ref={ref}
          id={id}
          className={classes}
          placeholder={placeholder}
          required={isRequired}
          readOnly={isReadOnly}
          {...restProps}
        />
      </>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
