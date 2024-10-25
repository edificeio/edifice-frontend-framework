import { forwardRef, ReactNode, Ref } from "react";

import clsx from "clsx";
import { UserProfile } from "edifice-ts-client";

export type BadgeRef = HTMLSpanElement;

/** Badge variant : notification */
export type NotificationBadgeVariant = {
  type: "notification";
  level: "success" | "warning" | "danger" | "info";
};

/** Badge variant : content */
export type ContentBadgeVariant = {
  type: "content";
  level: "success" | "warning" | "danger" | "info";
  background?: boolean;
};

/** Badge variant : profile = teacher, student, relative or personnel, guest */
export type ProfileBadgeVariant = {
  type: "user";
  profile: UserProfile[number];
  background?: boolean;
};

/** Badge variant : chip */
export type ChipBadgeVariant = {
  type: "chip";
};

/** Badge variant : link */
export type LinkBadgeVariant = {
  type: "link";
};

export type BadgeVariants =
  | NotificationBadgeVariant
  | ContentBadgeVariant
  | ProfileBadgeVariant
  | ChipBadgeVariant
  | LinkBadgeVariant;

export interface BadgeProps extends React.ComponentPropsWithRef<"span"> {
  /**
   * Badge variant : notification, link or profile (Teacher|Student|Relative|Personnel)
   * Defaults to notification.
   */
  variant?: BadgeVariants;
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
      variant = { type: "notification", level: "info" },
      children,
      ...restProps
    }: BadgeProps,
    ref: Ref<BadgeRef>,
  ) => {
    const classes = clsx(
      "badge rounded-pill",
      (variant.type === "content" || variant.type === "user") &&
        "background" in variant
        ? "bg-gray-200"
        : (variant.type === "content" || variant.type === "user") &&
            !("background" in variant)
          ? "border border-0"
          : "",
      variant.type === "content" && `text-${variant.level}`,
      variant.type === "notification" &&
        `badge-notification bg-${variant.level} text-light border border-0`,
      variant.type === "user" &&
        `badge-profile-${variant.profile.toLowerCase()}`,
      variant.type === "link" && "badge-link border border-0",
      variant.type === "chip" && "bg-gray-200",
      className,
    );

    return (
      <span ref={ref} className={classes} {...restProps}>
        {variant.type === "chip" ? (
          <div className="d-flex fw-800 align-items-center">{children}</div>
        ) : (
          children
        )}
      </span>
    );
  },
);

export default Badge;
