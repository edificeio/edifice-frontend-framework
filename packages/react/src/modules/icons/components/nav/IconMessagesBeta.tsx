import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconMessagesBeta = ({
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
    <g fill="currentColor" clipPath="url(#icon-messages-beta_svg__a)">
      <path d="M23.401 9.243V23.4H4.821A4.824 4.824 0 0 1 0 18.578V9.243l3.898-2.508L4.98 8.417 2 10.334v8.244A2.824 2.824 0 0 0 4.821 21.4h16.58V10.334l-2.9-1.863.541-.841.54-.842z" />
      <path d="M19.962 0v11.318h-2V2H5.439v9.318h-2V0z" />
      <path d="M16.669 3.773v2H6.732v-2zM15.904 7.546v2H7.496v-2z" />
      <path d="m22.898 10.657-10.702 6.114-.496.284-.496-.284-10.7-6.114.992-1.736L11.7 14.75l10.204-5.83z" />
    </g>
    <defs>
      <clipPath id="icon-messages-beta_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconMessagesBeta;
