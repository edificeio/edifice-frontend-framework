import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconTextTypo = ({
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
      d="M12.199 20.963q-.414 0-.713-.276a1.01 1.01 0 0 1-.276-.713V3h1.978v16.974q0 .414-.276.713a.97.97 0 0 1-.713.276M5.92 4.817q-.414 0-.667-.253A.92.92 0 0 1 5 3.92q0-.414.253-.667T5.92 3h12.581q.414 0 .667.253t.253.667q0 .368-.253.644-.253.253-.667.253z"
    />
  </svg>
);
export default SvgIconTextTypo;
