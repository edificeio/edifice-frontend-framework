import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconPlaceholder = ({
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
    <g fill="currentColor" clipPath="url(#icon-placeholder_svg__a)">
      <path d="M11.945 22.68C6.048 22.578 1.348 17.632 1.45 11.635 1.545 5.782 6.187 1.058 11.945.96a10.4 10.4 0 0 1 4.572 1.051 1.38 1.38 0 0 1 .71 1.802 1.34 1.34 0 0 1-1.88.666A7.924 7.924 0 0 0 4.71 8.325a8.18 8.18 0 0 0 3.765 10.819 7.927 7.927 0 0 0 10.663-3.849 8.2 8.2 0 0 0 .773-3.475 6 6 0 0 0-.269-2.117 1.375 1.375 0 0 1 .869-1.738 1.34 1.34 0 0 1 1.691.887c.297.95.431 1.944.397 2.939.029 5.983-4.718 10.86-10.602 10.889z" />
      <path d="M19.087 7.325c.786 0 1.422-.647 1.422-1.445s-.636-1.445-1.422-1.445-1.421.647-1.421 1.445.636 1.445 1.421 1.445" />
    </g>
    <defs>
      <clipPath id="icon-placeholder_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconPlaceholder;
