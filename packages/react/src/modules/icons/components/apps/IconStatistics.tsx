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
      d="M16.48 26v11.37h-5.69V26zM25 14.63v22.74h-5.66V14.63zm22.71 25.56v2.86H2.29V9h2.82v31.19zM33.52 20.32v17h-5.68v-17zM42 11.81v25.56h-5.65V11.81z"
    />
  </svg>
);
export default SvgIconStatistics;
