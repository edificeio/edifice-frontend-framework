import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconSuccessFill = ({
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
      d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11m4.808-13.41a1 1 0 1 0-1.616-1.18l-3.61 4.951-1.806-2.222a1 1 0 0 0-1.552 1.26l2.625 3.232a1 1 0 0 0 1.584-.042z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconSuccessFill;
