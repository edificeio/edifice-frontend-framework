import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconUsers = ({
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
    <g
      fill="currentColor"
      fillRule="evenodd"
      clipPath="url(#icon-users_svg__a)"
      clipRule="evenodd"
    >
      <path d="M19.055 12.803a1 1 0 0 1 1.272-.618c1.128.39 2.061 1.247 2.7 2.351.64 1.106.972 2.435.973 3.782V21a1 1 0 1 1-2 0v-2.681c0-1.03-.258-2.009-.704-2.782-.448-.773-1.034-1.258-1.623-1.462a1 1 0 0 1-.618-1.272M15.187 1.384a1 1 0 0 1 1.036-.962 5.129 5.129 0 0 1 2.11 9.71 1 1 0 1 1-.896-1.788 3.129 3.129 0 0 0-1.288-5.924 1 1 0 0 1-.962-1.036M1.505 15.694C2.481 14.622 3.825 14 5.25 14h8.5c1.424 0 2.769.622 3.744 1.694.974 1.068 1.506 2.498 1.506 3.973V22a1 1 0 1 1-2 0v-2.333c0-1.001-.363-1.945-.984-2.627-.618-.679-1.436-1.04-2.266-1.04h-8.5c-.83 0-1.648.361-2.266 1.04-.621.682-.984 1.626-.984 2.627V22a1 1 0 1 1-2 0v-2.333c0-1.475.533-2.905 1.505-3.974M9.5 3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7M4 6.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0" />
    </g>
    <defs>
      <clipPath id="icon-users_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconUsers;
