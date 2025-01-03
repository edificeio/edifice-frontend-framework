import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconListOrder = ({
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
      d="M6.5 3a1 1 0 0 1 .713.298l4.5 4.572a1 1 0 0 1-1.426 1.403L7.5 6.44V20a1 1 0 1 1-2 0V6.441L2.713 9.273A1 1 0 0 1 1.287 7.87l4.5-4.572A1 1 0 0 1 6.5 3M17.5 3a1 1 0 0 1 1 1v13.559l2.787-2.832a1 1 0 0 1 1.426 1.403l-4.5 4.572a1 1 0 0 1-1.426 0l-4.5-4.572a1 1 0 0 1 1.426-1.403L16.5 17.56V4a1 1 0 0 1 1-1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconListOrder;
