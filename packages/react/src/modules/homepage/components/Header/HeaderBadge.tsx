import { ReactNode } from 'react';

import { VisuallyHidden } from '../../../../components';

export interface HeaderBadgeProps {
  /**
   * Counter to display, or the label announced to assistive technologies
   * only when `dot` is set
   */
  children: ReactNode;
  /**
   * Render a dot ("pastille") instead of a counter
   */
  dot?: boolean;
}

/**
 * Notification badge of the Header v2 navbar items: a counter (e.g. unread
 * messages) or a dot (e.g. new notifications today). Mirrors the
 * "notifications badges" component of the Figma design system (Pastille
 * off / on), which the shared `Badge` component does not implement yet.
 *
 * TODO(ENABLING-1399): replace with the redesigned Badge component.
 */
export const HeaderBadge = ({ children, dot = false }: HeaderBadgeProps) =>
  dot ? (
    <span className="navbar-nav-dot">
      <VisuallyHidden>{children}</VisuallyHidden>
    </span>
  ) : (
    <span className="navbar-nav-badge">{children}</span>
  );

export default HeaderBadge;
