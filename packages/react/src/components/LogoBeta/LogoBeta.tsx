import { forwardRef, Ref } from 'react';

import clsx from 'clsx';

export interface LogoBetaProps {
  src: string;
  is1d?: boolean;
  translate?: string;
}

const LogoBeta = forwardRef(
  (
    { src, is1d, translate = 'Retour accueil' }: LogoBetaProps,
    ref: Ref<HTMLAnchorElement>,
  ) => {
    const classes = clsx('navbar-brand');
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

LogoBeta.displayName = 'LogoBeta';

export default LogoBeta;
