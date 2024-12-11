import { forwardRef, Ref } from 'react';

import clsx from 'clsx';

export interface LogoProps {
  src: string;
  is1d?: boolean;
  translate?: string;
}

const Logo = forwardRef(
  (
    { src, is1d, translate = 'Retour accueil' }: LogoProps,
    ref: Ref<HTMLAnchorElement>,
  ) => {
    const classes = clsx('navbar-brand d-none d-md-block');
    const logo = `logo ${is1d ? 'ONE' : 'NEO'}`;
    return (
      <a
        ref={ref}
        className={classes}
        href="/timeline/timeline"
        aria-label={translate}
      >
        <img className="logo" src={src} alt={logo} width="300" height="52" />
      </a>
    );
  },
);

Logo.displayName = 'Logo';

export default Logo;
