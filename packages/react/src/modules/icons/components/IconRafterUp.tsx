import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconRafterUp = ({
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
      d="M19.988 17.129a1.5 1.5 0 0 1-2.117-.141L12 10.278l-5.871 6.71a1.5 1.5 0 0 1-2.258-1.976l7-8a1.5 1.5 0 0 1 2.258 0l7 8a1.5 1.5 0 0 1-.141 2.117"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconRafterUp;
