import { Ref, forwardRef } from "react";

import { RafterUp } from "@edifice-ui/icons";
import clsx from "clsx";

import { useDropdownContext } from "./DropdownContext";

export interface DropdownTriggerProps
  extends React.ComponentPropsWithRef<"button"> {
  /**
   * Dropdown trigger title
   */
  label?: string;
  /**
   * Add an icon in dropdown trigger
   */
  icon?: React.ReactNode;
  /**
   * Add a badge
   */
  badgeContent?: string | number;
  /**
   * Set appearance
   */
  variant?: "ghost";
  /**
   * Button size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Disabled Trigger
   * */
  disabled?: boolean;
  /**
   * Stretch the dropdown trigger.
   */
  block?: boolean;
  /**
   * Hide the carret
   */
  hideCarret?: boolean;
}

export type DropdownTriggerType = React.ReactElement<DropdownTriggerProps>;

const DropdownTrigger = forwardRef(
  (
    {
      label,
      icon,
      variant,
      disabled = false,
      size,
      badgeContent,
      hideCarret = false,
      ...restProps
    }: DropdownTriggerProps,
    forwardRef: Ref<HTMLButtonElement>,
  ) => {
    const { triggerProps, block } = useDropdownContext();

    const className = clsx(
      "dropdown-toggle ",
      size,
      variant,
      { "w-100": block },
      triggerProps.className,
      restProps.className,
    );

    const mergedProps = {
      ...triggerProps,
      ...restProps,
      className,
    };

    return (
      <button
        ref={forwardRef}
        type="button"
        disabled={disabled}
        {...mergedProps}
      >
        {icon}
        {label}
        {badgeContent ? (
          <span className="badge text-bg-secondary rounded-pill">
            {badgeContent}
          </span>
        ) : (
          !hideCarret && (
            <RafterUp
              width={16}
              height={16}
              className="dropdown-toggle-caret"
            />
          )
        )}
      </button>
    );
  },
);

DropdownTrigger.displayName = "Dropdown.Trigger";

export default DropdownTrigger;
