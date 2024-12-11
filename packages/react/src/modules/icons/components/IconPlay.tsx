import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconPlay = ({
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
      d="M4.5 3.804c0-1.57 1.728-2.528 3.06-1.696l13.113 8.196a2 2 0 0 1 0 3.392L7.56 21.892c-1.332.832-3.06-.125-3.06-1.696zM19.613 12 6.5 3.804v16.392z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconPlay;
