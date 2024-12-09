import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconCahierTextes = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 23 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M8.49 9.89V7.17h5.36v2.72H8.5zm10.72-2.7 2.67 2.7h-2.67V23.3H3.13q-1.11 0-1.9-.79t-.8-1.92V4.49q0-1.1.8-1.9t1.9-.79H19.2v2.7h2.7zm-2.67 13.4V4.5H5.8v16.09z"
    />
  </svg>
);
export default SvgIconCahierTextes;
