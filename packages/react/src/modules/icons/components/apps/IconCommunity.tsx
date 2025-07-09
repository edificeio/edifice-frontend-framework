import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconCommunity = ({
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
    <path
      fill="currentColor"
      d="M39.763 35.477q2.166 0 3.72 1.55 1.553 1.55 1.553 3.711t-1.554 3.712T39.81 46t-3.718-1.55-1.554-3.759q0-.845.377-1.832l-7.955-5.731q-2.307 2.349-5.555 2.349t-5.554-2.302q-2.307-2.303-2.354-5.591 0-.424.141-1.222l-6.307-2.067q-.753.658-1.695.658-1.129 0-1.883-.752Q3 23.451 3 22.322q0-1.127.753-1.832.753-.704 1.883-.752.942 0 1.6.611.66.611.895 1.456l6.355 2.114a7.5 7.5 0 0 1 2.871-3.053 7.74 7.74 0 0 1 4.048-1.128q2.447 0 4.52 1.457l9.366-9.35q-.753-1.408-.753-2.583 0-2.16 1.554-3.712Q37.645 4 39.81 4t3.672 1.55 1.553 3.712-1.553 3.664-3.719 1.55q-1.224 0-2.589-.798l-9.367 9.396q1.46 2.067 1.46 4.51 0 1.738-.801 3.43l7.955 5.684q1.554-1.221 3.342-1.222"
    />
  </svg>
);
export default SvgIconCommunity;
