import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconLsuLangue2 = ({
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
    <g clipPath="url(#icon-lsu-langue2_svg__a)">
      <path
        fill="currentColor"
        d="M24 8.58h-5.453V6.566c0-.612-.502-1.105-1.125-1.105-.622 0-1.125.493-1.125 1.105v2.016H11.27L7.785 1.48A1.14 1.14 0 0 0 6.746.854a1.13 1.13 0 0 0-1.009.67L.277 14.078h2.445l1.43-3.287h5.7l1.612 3.287h2.497l-1.612-3.287h8.445c.101 1.53-.045 4.267-1.909 6.736a9.6 9.6 0 0 1-1.391 1.489c-.094-.081-.192-.162-.282-.254a5.6 5.6 0 0 1-1.248-1.813 1.13 1.13 0 0 0-1.474-.586c-.574.24-.84.888-.596 1.448a7.8 7.8 0 0 0 1.71 2.494c-.518.273-1.005.476-1.436.627a1.1 1.1 0 0 0-.683 1.411 1.123 1.123 0 0 0 1.44.667 12.7 12.7 0 0 0 2.67-1.304 8.7 8.7 0 0 0 2.989.855q.056.006.112.007c.57 0 1.061-.424 1.118-.995a1.113 1.113 0 0 0-1.005-1.212 6.5 6.5 0 0 1-1.23-.243 11.6 11.6 0 0 0 1.117-1.283c2.213-2.937 2.471-6.083 2.355-8.051h.945v-2.21zm-18.885 0 1.717-3.95 1.94 3.95z"
      />
    </g>
    <defs>
      <clipPath id="icon-lsu-langue2_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconLsuLangue2;
