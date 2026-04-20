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
    viewBox="0 0 32 32"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g
      strokeMiterlimit={10}
      strokeWidth={2.667}
      clipPath="url(#icon-communities-beta_svg__a)"
    >
      <path
        fill="#FEECFE"
        stroke="#E26AE2"
        d="M19.96 5.803a3.803 3.803 0 1 0-7.605 0 3.803 3.803 0 0 0 7.606 0Z"
      />
      <path
        stroke="#E26AE2"
        d="M9.668 11.861a3.803 3.803 0 1 0-7.606 0 3.803 3.803 0 0 0 7.606 0ZM30.254 11.861a3.803 3.803 0 1 0-7.606 0 3.803 3.803 0 0 0 7.606 0Z"
      />
      <path
        stroke="#FC94FF"
        d="M6.389 18.847a5.25 5.25 0 0 1 5.248 5.248v6.837H1.14v-6.837a5.25 5.25 0 0 1 5.248-5.248ZM25.637 18.847a5.25 5.25 0 0 1 5.248 5.248v6.837H20.389v-6.837a5.25 5.25 0 0 1 5.248-5.248Z"
      />
      <path
        fill="#FEECFE"
        stroke="#E26AE2"
        d="M16.158 12.955a5.25 5.25 0 0 1 5.248 5.248v12.73H10.91v-12.73a5.25 5.25 0 0 1 5.248-5.248Z"
      />
    </g>
    <defs>
      <clipPath id="icon-communities-beta_svg__a">
        <path fill="#fff" d="M0 0h32v32H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconCommunitiesBeta;
