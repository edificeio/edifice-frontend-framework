import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconSearch = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M4 10a7 7 0 1 1 14 0 7 7 0 0 1-14 0m7-9a9 9 0 1 0 5.7 15.96 1 1 0 0 0 .24.4l4.35 4.35a1 1 0 0 0 1.42-1.42l-4.35-4.35a1 1 0 0 0-.4-.24A9 9 0 0 0 11 1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconSearch;
