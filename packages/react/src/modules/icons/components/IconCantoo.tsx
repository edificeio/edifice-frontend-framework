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
    viewBox="0 0 16 16"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="#000"
      d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M15 4v2h-4.455l.445 10H8.988l-.222-5H7.234l-.222 5H5.01l.445-10H1V4z"
    />
  </svg>
);
export default SvgIconCantoo;
