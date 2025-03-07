import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconForgoing = ({
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
      d="M19.887 8.564c-1.905-4.616-7.175-6.815-11.766-4.92A8.9 8.9 0 0 0 4.824 5.99l1.55.112a1 1 0 0 1-.145 1.995l-3.345-.243a1 1 0 0 1-.921-.884l-.411-3.617a1 1 0 1 1 1.987-.226l.132 1.165a10.9 10.9 0 0 1 3.687-2.497c5.619-2.318 12.054.375 14.377 6.006a11.03 11.03 0 0 1-.762 9.945 1 1 0 1 1-1.71-1.036 9.03 9.03 0 0 0 .624-8.146M7.06 22.049a1 1 0 0 1 .824-1.822 9 9 0 0 0 1.725.575 1 1 0 0 1-.435 1.952c-.722-.161-1.43-.396-2.114-.705m10.67-3.447a1 1 0 1 1 1.368 1.46 11 11 0 0 1-2.128 1.558 1 1 0 1 1-.979-1.744 9 9 0 0 0 1.739-1.274m-5.624 4.405a1 1 0 0 1-.093-1.998 9 9 0 0 0 1.73-.249 1 1 0 0 1 .473 1.943c-.693.17-1.4.27-2.11.304M13.5 7a1 1 0 1 0-2 0v6.117l-3.143 2.637a1 1 0 1 0 1.286 1.533l3.5-2.938a1 1 0 0 0 .357-.766z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconForgoing;
