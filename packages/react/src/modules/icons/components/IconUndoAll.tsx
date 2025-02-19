import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconUndoAll = ({
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
      d="M11.648 12.564a.917.917 0 0 0 0-1.297L7.713 7.332l3.935-3.935A.917.917 0 1 0 10.352 2.1L5.768 6.684a.917.917 0 0 0 0 1.296l4.584 4.583a.917.917 0 0 0 1.296 0"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M7.523 12.564a.917.917 0 0 0 0-1.297L3.588 7.332l3.935-3.935A.917.917 0 1 0 6.227 2.1L1.643 6.684a.917.917 0 0 0 0 1.296l4.584 4.583a.917.917 0 0 0 1.296 0"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M19.25 18.332c.506 0 .917-.41.917-.917V11a4.583 4.583 0 0 0-4.584-4.584H6.417a.917.917 0 0 0 0 1.834h9.166a2.75 2.75 0 0 1 2.75 2.75v6.416c0 .507.41.917.917.917"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconUndoAll;
