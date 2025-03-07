import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconVideo = ({
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
      d="M4 4.962C4 4.376 4.435 4 4.853 4H6.5v2H4zM4 8h2.5v3H4zm-2 4V4.962C2 3.381 3.224 2 4.853 2h13.294C19.776 2 21 3.38 21 4.962v14.076C21 20.619 19.776 22 18.147 22H4.853C3.224 22 2 20.62 2 19.038zm17-6V4.962c0-.586-.435-.962-.853-.962H16.5v2zm0 2h-2.5v3H19zm-2.5 5H19v3h-2.5zm0 5H19v1.038c0 .586-.435.962-.853.962H16.5zm-2-7V4h-6v7zm-6 2h6v7h-6zm-2 5v2H4.853C4.435 20 4 19.624 4 19.038V18zm0-2v-3H4v3z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconVideo;
