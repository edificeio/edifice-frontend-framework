import { ReactNode } from 'react';

import clsx from 'clsx';

import { IconLink } from '../../modules/icons/components';

export type LinkPillIllustrationType = 'icon' | 'img';
export type LinkPillIllustrationPosition = 'left' | 'right';

export interface LinkPillProps {
  /**
   * URL opened in a new tab when the pill is clicked.
   */
  href: string;
  /**
   * Text displayed inside the pill (single line, ellipsis on overflow).
   */
  label: string;
  /**
   * Optional second line displayed below the label (single line, ellipsis
   * on overflow). Does not affect the label's font size.
   */
  subtitle?: string;
  /**
   * Illustration node. Defaults to `<IconLink />` for the `icon` type.
   * For the `img` type, the caller must provide an `<img>` element.
   */
  illustration?: ReactNode;
  /**
   * `icon` (default): illustration wrapped in a small rounded box.
   * `img`: illustration rendered as a 36x36 rounded square (e.g. a favicon).
   */
  illustrationType?: LinkPillIllustrationType;
  /**
   * Side the illustration is displayed on.
   */
  illustrationPosition?: LinkPillIllustrationPosition;
  /**
   * Optional class for styling purpose
   */
  className?: string;
}

/**
 * LinkPill – design system component (Figma EdificeLibrary_Web, node 1625-533)
 * used to display a link to an external resource as a small rounded pill.
 */
const LinkPill = ({
  href,
  label,
  subtitle,
  illustration,
  illustrationType = 'icon',
  illustrationPosition = 'left',
  className,
}: LinkPillProps) => {
  const illustrationNode =
    illustrationType === 'icon' ? (
      <span className="link-pill-icon">{illustration ?? <IconLink />}</span>
    ) : (
      <span className="link-pill-image">{illustration}</span>
    );

  const contentNode = (
    <span className="link-pill-content">
      <span className="link-pill-label" title={label}>
        {label}
      </span>
      {subtitle && (
        <span className="link-pill-subtitle" title={subtitle}>
          {subtitle}
        </span>
      )}
    </span>
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="link-pill"
      className={clsx(
        'link-pill',
        `link-pill--illustration-${illustrationPosition}`,
        className,
      )}
    >
      {illustrationPosition === 'left' ? (
        <>
          {illustrationNode}
          {contentNode}
        </>
      ) : (
        <>
          {contentNode}
          {illustrationNode}
        </>
      )}
    </a>
  );
};

LinkPill.displayName = 'LinkPill';

export default LinkPill;
