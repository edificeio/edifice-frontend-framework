import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconHighlightColumn = ({
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
      d="M4.222 1.001A3.22 3.22 0 0 0 1 4.224v15.555a3.22 3.22 0 0 0 3.222 3.222h15.555A3.22 3.22 0 0 0 23 19.78V4.224A3.22 3.22 0 0 0 19.777 1zm3.778 20h11.777c.675 0 1.223-.547 1.223-1.222V4.224C21 3.549 20.452 3 19.777 3H6.91V21z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconHighlightColumn;
