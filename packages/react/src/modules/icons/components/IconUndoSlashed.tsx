import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconUndoSlashed = ({
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
      d="M19.775 8.466A5 5 0 0 1 22 12.625V21a1 1 0 0 1-2 0v-8.375c0-1.186-.69-2.208-1.689-2.695zM7.918 2.293a1 1 0 1 1 1.414 1.414L5.414 7.625h6.719l-2 2H5.414l2.36 2.36-1.415 1.414-4.066-4.067a1 1 0 0 1 0-1.414zM20.293 2.293a1 1 0 1 1 1.414 1.414l-17 17a1 1 0 1 1-1.414-1.414z"
    />
  </svg>
);
export default SvgIconUndoSlashed;
