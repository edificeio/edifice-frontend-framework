import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconStatistics = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 28 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M8.59 12.56v6.87H5.15v-6.87h3.43zm5.14-6.88v13.75h-3.41V5.68zM27.5 21.14v1.73H0V2.24h1.7v18.9zM18.9 9.12v10.31h-3.44V9.12zm5.15-5.15v15.46H20.6V3.97h3.44z"
    />
  </svg>
);
export default SvgIconStatistics;
