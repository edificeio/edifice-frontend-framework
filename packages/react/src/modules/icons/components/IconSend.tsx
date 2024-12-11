import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconSend = ({
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
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M20.604 3.159a.91.91 0 0 1 .345 1.05l-6.364 18.182a.909.909 0 0 1-1.689.07l-3.494-7.863-7.862-3.495a.91.91 0 0 1 .069-1.688l18.158-6.356a.91.91 0 0 1 .837.1M11.175 14.11l6.742-6.742-4.29 12.258zM9.89 12.825l-5.515-2.452 12.257-4.29z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconSend;
