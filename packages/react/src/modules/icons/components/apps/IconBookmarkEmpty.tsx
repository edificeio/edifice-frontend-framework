import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconBookmarkEmpty = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 17 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M15.46 3.97H1.71v16.67l6.87-6.6 1.2 1.14 5.68 5.46zm.17-1.73q.29 0 .58.12.45.2.7.55t.26.84v17.3q0 .45-.27.84t-.7.55q-.23.1-.57.1-.65 0-1.13-.44l-5.92-5.67-5.91 5.67q-.48.46-1.1.46-.32 0-.6-.12-.44-.17-.7-.55T0 21.04V3.75q0-.45.26-.84t.7-.55q.3-.12.6-.12z"
    />
  </svg>
);
export default SvgIconBookmarkEmpty;
