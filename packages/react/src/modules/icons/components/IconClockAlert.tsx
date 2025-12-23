import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconClockAlert = ({
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
    <g fill="currentColor" clipPath="url(#icon-clock-alert_svg__a)">
      <path d="M0 10.075C0 4.51 4.51 0 10.075 0c4.573 0 8.431 3.046 9.663 7.217a1 1 0 0 1-1.918.566A8.075 8.075 0 1 0 7.783 17.82a1 1 0 0 1-.566 1.918C3.046 18.506 0 14.648 0 10.075" />
      <path d="M10.075 4.108a1 1 0 0 1 1 1v5.43a1 1 0 0 1-.357.767L7.83 13.728a1 1 0 1 1-1.286-1.532l2.53-2.123V5.108a1 1 0 0 1 1-1M17 13.3a1 1 0 0 1 1 1v2.2a1 1 0 1 1-2 0v-2.2a1 1 0 0 1 1-1M17 18.4a1 1 0 1 0 0 2h.006a1 1 0 1 0 0-2z" />
      <path
        fillRule="evenodd"
        d="M17 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14m-5 7a5 5 0 1 1 10 0 5 5 0 0 1-10 0"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="icon-clock-alert_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconClockAlert;
