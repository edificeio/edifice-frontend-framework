import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconVisioconf = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M7.85 4.15c.08 0 .14.15.14.34v15.5c0 .18-.06.34-.14.34s-.14-.16-.14-.34V4.49c0-.19.06-.34.14-.34m.09 5.59v.01a.14.14 0 0 1-.14.14H1.54a.14.14 0 0 1-.14-.14v-.01c0-.08.07-.14.14-.14H7.8c.08 0 .14.06.14.14m-.13 5.18v.01a.14.14 0 0 1-.13.14H1.4a.14.14 0 0 1-.13-.14v-.01c0-.08.06-.14.13-.14h6.27c.07 0 .13.06.13.14zM2.6 19.65l.03-.24a2.1 2.1 0 0 1 .89-1.36c.33.31.72.48 1.17.48s.84-.17 1.17-.48l.2.16c.4.35.64.8.7 1.33l.02.11v.13H2.6zm2.19-4.05.24.05a1.25 1.25 0 1 1-1.57 1.43 1.25 1.25 0 0 1 .97-1.45l.16-.03zm4.97 3.46.08-.63a5.52 5.52 0 0 1 2.34-3.6c.87.82 1.9 1.26 3.1 1.26s2.22-.43 3.1-1.27c.18.14.36.27.53.42a5.46 5.46 0 0 1 1.86 3.54l.04.28v.35H9.74v-.35zm5.78-10.7c.22.04.44.07.66.13a3.32 3.32 0 0 1 2.38 2.84 3.31 3.31 0 0 1-6.56.93 3.31 3.31 0 0 1 2.57-3.83l.43-.08h.52zM2.58 14.64l.04-.24a2.1 2.1 0 0 1 .88-1.36c.33.3.72.47 1.17.47q.675 0 1.17-.48l.2.16c.4.36.64.8.7 1.34l.02.1v.14H2.58zm2.19-4.05.25.05a1.25 1.25 0 1 1-1.58 1.42 1.25 1.25 0 0 1 .97-1.44c.05-.02.1-.02.16-.03zM2.59 9.48l.03-.24a2.1 2.1 0 0 1 .89-1.36c.33.31.72.48 1.17.48s.84-.17 1.17-.48l.2.16c.4.35.64.8.7 1.33l.02.11v.13H2.6v-.13zm2.19-4.05.25.05a1.25 1.25 0 1 1-1.58 1.43 1.25 1.25 0 0 1 .97-1.45l.16-.03zm19.24-.07v13.62a2.01 2.01 0 0 1-2 2h-6.8c0 1.07.8 1.97.8 2.4a.8.8 0 0 1-.8.8H8.8a.8.8 0 0 1-.8-.8c0-.46.8-1.31.8-2.4H2a2 2 0 0 1-2-2V5.36c0-1.1.9-2 2-2h20.02a2 2 0 0 1 2 2m-1.6 13.41V5.47c0-.27-.19-.5-.4-.5H2c-.22 0-.4.23-.4.5v13.3c0 .27.18.51.4.51h20.02c.21 0 .4-.24.4-.51M12.01 2.95a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2m0-1.94c.05 0 .09.04.09.08s-.04.09-.09.09c-.04 0-.08-.04-.08-.09s.04-.08.08-.08m0 .34a.5.5 0 1 1 0 1.01.5.5 0 0 1 0-1.01m0 .76c.14 0 .25-.12.25-.26a.25.25 0 1 0-.25.26m.73.78a1.26 1.26 0 0 1-1.46 0l-.2.3a.17.17 0 0 0 .14.27h1.58a.17.17 0 0 0 .14-.26z"
    />
  </svg>
);
export default SvgIconVisioconf;
