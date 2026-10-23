import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconHomeBeta = ({
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
    <g fill="currentColor" clipPath="url(#icon-home-beta_svg__a)">
      <path d="M20.9 9.188 12 2.266 3.1 9.188V20.8A1.2 1.2 0 0 0 4.3 22h15.4a1.2 1.2 0 0 0 1.2-1.2zm2 11.612a3.2 3.2 0 0 1-3.2 3.2H4.3a3.2 3.2 0 0 1-3.2-3.2V8.7a1 1 0 0 1 .386-.789l9.9-7.7.142-.093a1 1 0 0 1 1.086.093l9.9 7.7a1 1 0 0 1 .386.79z" />
      <path d="M14.3 23V13H9.7v10a1 1 0 1 1-2 0V12a1 1 0 0 1 1-1h6.6a1 1 0 0 1 1 1v11a1 1 0 1 1-2 0" />
    </g>
    <defs>
      <clipPath id="icon-home-beta_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconHomeBeta;
