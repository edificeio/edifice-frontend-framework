import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconLoader = ({
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
      d="M16.672 5.558a7.96 7.96 0 0 0-9.841.397 7.95 7.95 0 0 0-1.908 9.66 7.964 7.964 0 0 0 8.949 4.12A7.95 7.95 0 0 0 19.962 12a1.021 1.021 0 1 1 2.045 0A9.994 9.994 0 0 1 7.83 21.083a10.01 10.01 0 0 1-5.634-11.027 9.99 9.99 0 0 1 9.402-8.048c2.244-.09 4.453.577 6.272 1.895a1.022 1.022 0 1 1-1.198 1.655"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconLoader;
