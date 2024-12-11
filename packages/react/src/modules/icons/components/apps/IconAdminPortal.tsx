import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconAdminPortal = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 26 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M24.02 21.91v-1.5h-1.5v-9h1.5V9.9h-4.5v1.5h1.5v9.01h-4.5v-9h1.5V9.9h-4.5v1.5h1.5v9.01H10.5v-9H12V9.9H7.5v1.5H9v9.01H4.5v-9H6V9.9H1.5v1.5H3v9.01H1.5v1.5H0v1.5h25.52v-1.5zM12.02-.6h1.5l12 7.5v1.5H0V6.9L12.01-.6z"
    />
  </svg>
);
export default SvgIconAdminPortal;
