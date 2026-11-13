import { forwardRef, Ref } from 'react';

import clsx from 'clsx';

export interface LogoBetaProps {
  src: string;
  /**
   * @deprecated No longer used: the logo image is decorative, the link
   * carries the accessible name (`translate`).
   */
  is1d?: boolean;
  /**
   * Accessible name of the home link
   */
  translate?: string;
}

const LogoBeta = forwardRef(
  (
    { src, translate = 'Retour accueil' }: LogoBetaProps,
    ref: Ref<HTMLAnchorElement>,
  ) => {
    const classes = clsx('navbar-brand');
    return (
      <a
        ref={ref}
        className={classes}
        href="/timeline/timeline"
        aria-label={translate}
      >
        <img className="logo" src={src} alt="" width="300" height="52" />
      </a>
    );
  },
);

LogoBeta.displayName = 'LogoBeta';

export default LogoBeta;
