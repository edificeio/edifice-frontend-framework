import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconUnlock = ({
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
    <g clipPath="url(#icon-unlock_svg__a)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.919 3.981a4 4 0 0 1 7.337.888 1 1 0 0 0 1.926-.538A6 6 0 0 0 5.624 7.558L6.027 9H5a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3H8.102l-.014-.053-.537-1.927a4 4 0 0 1 .368-3.039M4 12a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="icon-unlock_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconUnlock;
