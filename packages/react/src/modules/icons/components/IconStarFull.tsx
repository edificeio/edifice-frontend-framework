import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconStarFull = ({
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
    <g clipPath="url(#icon-star-full_svg__a)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M10.278 1.977c.77-1.323 2.675-1.323 3.444 0l2.759 4.746 5.143 1.19c1.44.334 2.03 2.068 1.094 3.216l-3.64 4.464.775 5.446c.224 1.569-1.374 2.763-2.808 2.099L12 20.8l-5.045 2.337c-1.434.664-3.032-.53-2.808-2.1l.775-5.445-3.64-4.464C.346 9.98.936 8.247 2.376 7.914L7.52 6.723z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="icon-star-full_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconStarFull;
