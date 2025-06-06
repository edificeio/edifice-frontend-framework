import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconAddUser = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M21 7a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2zM2.005 14.694C2.981 13.622 4.325 13 5.75 13h8.5c1.424 0 2.769.622 3.744 1.694.974 1.068 1.506 2.498 1.506 3.973V21a1 1 0 1 1-2 0v-2.333c0-1.001-.363-1.945-.984-2.627-.618-.679-1.436-1.04-2.266-1.04h-8.5c-.83 0-1.648.361-2.266 1.04-.621.682-.984 1.626-.984 2.627V21a1 1 0 1 1-2 0v-2.333c0-1.475.533-2.905 1.505-3.974M10 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7M4.5 5.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconAddUser;
