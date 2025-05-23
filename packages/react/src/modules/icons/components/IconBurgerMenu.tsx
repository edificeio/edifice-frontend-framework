import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconBurgerMenu = ({
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
      d="M21 5c0 .828-.711 1.5-1.588 1.5H4.588C3.711 6.5 3 5.828 3 5s.711-1.5 1.588-1.5h14.824C20.289 3.5 21 4.172 21 5M21 12c0 .828-.711 1.5-1.588 1.5H4.588C3.711 13.5 3 12.828 3 12s.711-1.5 1.588-1.5h14.824c.877 0 1.588.672 1.588 1.5M21 19c0 .828-.711 1.5-1.588 1.5H4.588C3.711 20.5 3 19.828 3 19s.711-1.5 1.588-1.5h14.824c.877 0 1.588.672 1.588 1.5"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconBurgerMenu;
