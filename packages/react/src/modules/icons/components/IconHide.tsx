import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconHide = ({
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
    <g clipPath="url(#icon-hide_svg__a)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M1.707.293A1 1 0 0 0 .293 1.707l4.275 4.276a19.5 19.5 0 0 0-4.45 5.544 1 1 0 0 0-.012.92L1 12c-.894.447-.894.448-.894.449l.002.002.003.007.011.022.04.078q.053.099.152.276a20.682 20.682 0 0 0 2.831 3.85C5.105 18.774 8.1 21 12 21h.016a11.07 11.07 0 0 0 5.81-1.76l4.467 4.467a1 1 0 0 0 1.414-1.414l-5.06-5.06-3.816-3.816-.007-.007-4.234-4.234-.007-.007-3.816-3.816zm14.664 17.493-2.321-2.322a4 4 0 0 1-3.623.32A4 4 0 0 1 8.536 9.95L5.987 7.401a17.5 17.5 0 0 0-3.844 4.602 18.68 18.68 0 0 0 2.462 3.313c1.789 1.909 4.29 3.68 7.387 3.684a9.1 9.1 0 0 0 4.38-1.214m-6.343-6.344a2 2 0 0 0 2.53 2.53zm10.725 2.246L12.073 5c3.067.028 5.546 1.789 7.322 3.684a18.7 18.7 0 0 1 2.463 3.314 18 18 0 0 1-1.105 1.69M23 12l.894-.447zm.882.471a1 1 0 0 0 .012-.918l-.002-.004-.003-.007-.011-.022a9 9 0 0 0-.192-.354 20.676 20.676 0 0 0-2.831-3.85C18.895 5.226 15.9 3 12 3a10 10 0 0 0-2.329.266 1 1 0 0 0-.48 1.68l10.94 10.95a1 1 0 0 0 1.473-.062 19.5 19.5 0 0 0 2.277-3.363M12.002 3H12v1z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="icon-hide_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconHide;
