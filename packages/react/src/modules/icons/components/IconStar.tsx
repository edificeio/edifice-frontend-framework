import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconStar = ({
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
    <g clipPath="url(#icon-star_svg__a)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M10.272 1.977c.772-1.323 2.684-1.323 3.455 0l2.769 4.746 5.16 1.19a2 2 0 0 1 1.099 3.216l-3.653 4.464.778 5.446c.224 1.569-1.379 2.763-2.818 2.099L12 20.8l-5.062 2.337c-1.44.664-3.042-.53-2.818-2.1l.778-5.445-3.653-4.464a2 2 0 0 1 1.098-3.215l5.161-1.191zm4.496 5.754L12 2.985 9.232 7.73a2 2 0 0 1-1.278.94l-5.16 1.191 3.652 4.465a2 2 0 0 1 .432 1.55L6.1 21.321l5.062-2.337a2 2 0 0 1 1.676 0l5.062 2.337-.778-5.446a2 2 0 0 1 .432-1.55l3.653-4.464-5.16-1.19a2 2 0 0 1-1.279-.941"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="icon-star_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconStar;
