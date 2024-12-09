import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconConversation = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
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
      d="m0 21.67 7.8-8.23 4.22 2.41 4.24-2.4 7.79 8.22zm0-2.74V8.97l6.1 3.54zm0-12.1V3.44h24.05v3.4l-12.03 6.84zm17.94 5.68 6.1-3.54v9.96z"
    />
  </svg>
);
export default SvgIconConversation;
