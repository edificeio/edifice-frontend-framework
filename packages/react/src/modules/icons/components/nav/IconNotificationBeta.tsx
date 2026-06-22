import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconNotificationBeta = ({
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
    <path
      stroke="#1C1C73"
      strokeMiterlimit={10}
      strokeWidth={2.667}
      d="M13.363 5.348a2.726 2.726 0 1 1 5.383-.622q0 .423-.12.808M19.886 25.184a3.919 3.919 0 1 1-7.559-.26"
    />
    <path
      stroke="#1C1C73"
      strokeMiterlimit={10}
      strokeWidth={2.667}
      d="M28.62 18.901H4.058v6.682h24.56z"
    />
    <path
      stroke="#1C1C73"
      strokeMiterlimit={10}
      strokeWidth={2.667}
      d="M16.189 4.889c5.639 0 10.22 4.581 10.22 10.22v3.794H5.97V15.11c0-5.639 4.581-10.22 10.22-10.22Z"
    />
  </svg>
);
export default SvgIconNotificationBeta;
