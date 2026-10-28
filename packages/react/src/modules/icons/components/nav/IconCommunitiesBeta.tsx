import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconCommunitiesBeta = ({
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
    <g fill="currentColor" clipPath="url(#icon-communities-beta_svg__a)">
      <path d="M13.97 3.852a1.852 1.852 0 1 0-3.704.001 1.852 1.852 0 0 0 3.705-.001m2 0a3.853 3.853 0 1 1-7.705-.001 3.853 3.853 0 0 1 7.706 0M6.251 8.396a1.852 1.852 0 1 0-3.705.001 1.852 1.852 0 0 0 3.705-.001m2 0a3.853 3.853 0 1 1-7.706-.001 3.853 3.853 0 0 1 7.706 0M21.69 8.396a1.852 1.852 0 1 0-3.704.001 1.852 1.852 0 0 0 3.704-.001m2 0a3.853 3.853 0 1 1-7.705-.001 3.853 3.853 0 0 1 7.705 0M6.728 17.57c0-1.75-1.216-2.935-2.437-2.935s-2.435 1.185-2.435 2.936V21.7h4.872zm2 6.13H-.144v-6.13c0-2.591 1.864-4.934 4.435-4.935 2.572 0 4.436 2.344 4.437 4.936zM22.164 17.57c0-1.75-1.216-2.935-2.437-2.935s-2.435 1.185-2.436 2.936V21.7h4.873zm2 6.13H15.29v-6.13c0-2.591 1.865-4.934 4.436-4.935 2.572 0 4.436 2.344 4.437 4.936z" />
      <path d="M15.055 13.152a2.94 2.94 0 0 0-2.937-2.935 2.94 2.94 0 0 0-2.935 2.935v8.549h5.872zm2 10.549H7.183V13.152a4.94 4.94 0 0 1 4.935-4.935 4.94 4.94 0 0 1 4.937 4.935z" />
    </g>
    <defs>
      <clipPath id="icon-communities-beta_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconCommunitiesBeta;
