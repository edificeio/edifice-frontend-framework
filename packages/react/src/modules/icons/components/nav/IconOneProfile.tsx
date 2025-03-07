import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconOneProfile = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g clipPath="url(#icon-one-profile_svg__a)">
      <path
        fill="currentColor"
        d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24m0 4.65a4.26 4.26 0 1 1 0 8.51 4.26 4.26 0 0 1 0-8.51m0 16.64a9.27 9.27 0 0 1-7.09-3.3 5.4 5.4 0 0 1 4.77-2.9c.11 0 .23.03.34.06.63.2 1.29.33 1.98.33.7 0 1.35-.13 1.98-.33.11-.03.23-.05.34-.05a5.4 5.4 0 0 1 4.77 2.89 9.27 9.27 0 0 1-7.09 3.3"
      />
    </g>
    <defs>
      <clipPath id="icon-one-profile_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconOneProfile;
