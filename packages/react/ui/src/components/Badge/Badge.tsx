import { forwardRef, ReactNode, Ref } from "react";

import clsx from "clsx";

export type BadgeRef = HTMLSpanElement;

/** Badge variant : notification */
export type NotificationBadgeVariant = {
  type: "notification";
  level: "warning" | "danger" | "info";
  color?: "background" | "text";
};
/** Badge variant : profile = teacher, student, relative or personnel */
export type ProfileBadgeVariant = {
  type: "profile";
  profile: "teacher" | "student" | "relative" | "personnel";
};
/** Badge variant : link */
export type LinkBadgeVariant = {
  type: "link";
};

export type BadgeVariants =
  | NotificationBadgeVariant
  | ProfileBadgeVariant
  | LinkBadgeVariant;

export interface BadgeProps extends React.ComponentPropsWithRef<"span"> {
  /**
   * Badge variant : notification, link or profile (Teacher|Student|Relative|Personnel)
   * Defaults to notification.
   */
  variant?: BadgeVariants;
  /**
   * Is badge always visible ?
   * A badge with no children is hidden by default.
   */
  visibility?: "always";
  /**
   * If set, forces the radius of the rounded border.
   */
  rounded?: "pill" | "circle";
  /**
   * Text or icon (or whatever) to render as children elements.
   */
  children?: ReactNode;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

/**
 * Primary UI component for user interaction
 */
const Badge = forwardRef(
  (
    {
      className,
      variant = { type: "notification", level: "danger", color: "background" },
      visibility,
      rounded,
      children,
      ...restProps
    }: BadgeProps,
    ref: Ref<BadgeRef>,
  ) => {
    function getRadiusClass() {
      // If radius is not forced, set it to a default value when needed.
      if (!rounded) {
        if ("always" === visibility && !children) {
          return "rounded-circle";
        }

        if ("notification" === variant.type) {
          return "rounded-pill";
        } else if ("link" === variant.type) {
          return "rounded-2";
        }
      }
    }

    const classes = clsx(
      "badge",

      getRadiusClass(),

      "always" === visibility &&
        `position-absolute translate-middle p-8 d-inline`,

      "notification" === variant.type &&
        (!variant.color || variant.color === "background") &&
        `bg-${variant.level} text-light`,

      "notification" === variant.type &&
        variant.color === "text" &&
        `text-${variant.level} bg-gray-200 border border-gray-400`,

      "profile" === variant.type && `badge-profile-${variant.profile}`,

      "link" === variant.type && `border border-secondary`,

      className,
    );

    return (
      <span ref={ref} className={classes} {...restProps}>
        {variant.type === "link" ? (
          <div className="d-flex fw-800 align-items-center">{children}</div>
        ) : (
          children
        )}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export default Badge;
