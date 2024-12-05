import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconCantoo = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 88 104"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <ellipse
      cx={44.305}
      cy={15.281}
      fill="url(#icon-cantoo_svg__a)"
      rx={14.472}
      ry={14.367}
      transform="rotate(-.145 44.305 15.281)"
    />
    <path
      fill="url(#icon-cantoo_svg__b)"
      fillRule="evenodd"
      d="m44.529 39.653-28.126-8.41c-6.42-1.785-13.121 1.8-14.968 8.008C-.414 45.46 3.294 51.94 9.713 53.724l17.54 5.245-16.845 28.892c-2.73 5.401.023 11.938 6.147 14.601 6.125 2.662 13.301.442 16.03-4.96l11.88-20.374 11.974 20.3c2.757 5.387 9.945 7.57 16.055 4.877 6.111-2.694 8.83-9.244 6.074-14.632l-16.953-28.74 17.478-5.384c6.41-1.818 10.084-8.316 8.206-14.514-1.879-6.199-8.598-9.75-15.009-7.932z"
      clipRule="evenodd"
    />
    <defs>
      <linearGradient
        id="icon-cantoo_svg__a"
        x1={28.13}
        x2={60.619}
        y1={-6.867}
        y2={27.927}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#0B4EFC" />
        <stop offset={1} stopColor="#30B3E8" />
      </linearGradient>
      <linearGradient
        id="icon-cantoo_svg__b"
        x1={-4.227}
        x2={76.299}
        y1={11.105}
        y2={112.656}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#0B4EFC" />
        <stop offset={1} stopColor="#30B3E8" />
      </linearGradient>
    </defs>
  </svg>
);
export default SvgIconCantoo;
