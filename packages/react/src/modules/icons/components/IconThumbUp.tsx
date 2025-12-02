import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconThumbUp = ({
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
      d="M10 3.333a1.67 1.67 0 0 0-1.16-1.587L5.833 8.511v8.156h8.576a.834.834 0 0 0 .833-.708l.001-.002 1.15-7.498.008-.09a.834.834 0 0 0-.842-.869h-4.726A.833.833 0 0 1 10 6.667zm-8.333 12.5a.833.833 0 0 0 .833.834h1.667v-7.5H2.5a.833.833 0 0 0-.833.833zm10-10h3.883a2.5 2.5 0 0 1 2.49 2.876l-1.15 7.5a2.5 2.5 0 0 1-2.49 2.124H2.5a2.5 2.5 0 0 1-2.5-2.5V10a2.5 2.5 0 0 1 2.5-2.5h1.958L7.572.495l.057-.108A.83.83 0 0 1 8.333 0a3.333 3.333 0 0 1 3.334 3.333z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconThumbUp;
