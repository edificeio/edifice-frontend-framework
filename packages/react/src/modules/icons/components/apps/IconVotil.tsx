import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconVotil = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="icon-votil_svg__vote"
    viewBox="0 0 156.53 156.53"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <defs>
      <style>{'.icon-votil_svg__cls-1{fill:#fff}'}</style>
    </defs>
    <path
      d="m39.66 79.79 43.6 28.55c.78.51 1.69.78 2.62.78 1.62 0 3.13-.81 4.01-2.17l39.99-61.06c1.45-2.21.83-5.19-1.38-6.63L84.9 10.71a4.85 4.85 0 0 0-3.61-.68c-1.25.26-2.33 1-3.03 2.07L38.27 73.16c-.7 1.07-.94 2.35-.68 3.6s1 2.33 2.07 3.03M69.53 52.1c.76-1.35 2-2.32 3.49-2.73 3.07-.85 6.28.96 7.13 4.03l1.88 6.77 18.23-9.09c1.38-.69 2.95-.8 4.42-.31s2.66 1.52 3.35 2.91c.69 1.38.8 2.95.31 4.42s-1.52 2.66-2.91 3.35L80.91 73.68a5.8 5.8 0 0 1-4.94.11 5.8 5.8 0 0 1-3.23-3.74l-3.76-13.54a5.78 5.78 0 0 1 .54-4.4Z"
      className="icon-votil_svg__cls-1"
    />
    <path
      d="M134.03 99.44h-17.64c-2.64 0-4.79 2.15-4.79 4.79s2.15 4.79 4.79 4.79h12.85v23.41H32.97v-23.41h15.5c2.64 0 4.79-2.15 4.79-4.79s-2.15-4.79-4.79-4.79H28.18c-2.64 0-4.79 2.15-4.79 4.79v33c0 2.64 2.15 4.79 4.79 4.79h105.86c2.64 0 4.79-2.15 4.79-4.79v-33c0-2.64-2.15-4.79-4.79-4.79Z"
      className="icon-votil_svg__cls-1"
    />
  </svg>
);
export default SvgIconVotil;
