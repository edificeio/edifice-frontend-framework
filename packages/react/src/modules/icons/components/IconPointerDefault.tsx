import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconPointerDefault = ({
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
      d="M2.567 2.285a1 1 0 0 0-.227 1.092l7.77 19.092a1 1 0 0 0 1.857-.012l3.025-7.712 7.35-2.678a1 1 0 0 0 .056-1.857L3.664 2.083a1 1 0 0 0-1.097.202M19.3 11.047l-5.417 1.973a1 1 0 0 0-.589.575l-2.276 5.802L5.116 4.893z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconPointerDefault;
