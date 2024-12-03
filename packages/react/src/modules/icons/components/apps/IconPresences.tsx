import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconPresences = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g fill="currentColor" clipPath="url(#icon-presences_svg__a)">
      <path d="M13.44 11.529a4.268 4.268 0 1 0-6.035-6.036 4.268 4.268 0 0 0 6.036 6.036Z" />
      <path d="M20.386 5.243V4.29c0-.977-.725-1.824-1.679-1.887-1.014-.063-1.863.765-1.863 1.76V5.24c.063 3.791-.765 6.524-2.382 7.87-.207.166-.414.332-.643.495a6.05 6.05 0 0 1-3.417 1.036 6.28 6.28 0 0 1-3.562-1.132.7.7 0 0 0-.743-.04c-1.545.863-2.737 2.308-2.737 4.593v3.128c0 .491.4.891.89.891h12.345c.495 0 .89-.392.89-.89V18.06c0-.166 0-.31-.021-.455-.082-1.265.185-2.527.89-3.562 1.41-2.111 2.093-5.074 2.032-8.8" />
    </g>
    <defs>
      <clipPath id="icon-presences_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconPresences;
