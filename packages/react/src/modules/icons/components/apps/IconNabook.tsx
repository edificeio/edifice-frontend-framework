import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconNabook = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 50 50"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g clipPath="url(#icon-nabook_svg__a)">
      <path
        fill="#066"
        d="m36.34 10.071 1.832 26.459-10.044 2.177L20.972 25.3l.908 14.45-8.723 1.071-2.677-27.575 9.635-1.655 8.421 13.134-1.308-13.22z"
      />
      <path
        fill="#0FC"
        d="M36.228 8.772 38.06 35.23l-10.044 2.178L20.86 24l.908 14.45-8.723 1.072-2.678-27.575 9.636-1.655 8.421 13.134-1.308-13.22z"
      />
    </g>
    <defs>
      <clipPath id="icon-nabook_svg__a">
        <path fill="#fff" d="M0 0h50v50H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconNabook;
