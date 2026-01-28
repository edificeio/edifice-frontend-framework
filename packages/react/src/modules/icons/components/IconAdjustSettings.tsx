import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconAdjustSettings = ({
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
      d="M10 17c1.306 0 2.414.835 2.826 2H21.9c.608 0 1.1.448 1.1 1s-.492 1-1.1 1h-9.074a2.998 2.998 0 0 1-5.652 0H2.1c-.608 0-1.1-.448-1.1-1s.492-1 1.1-1h5.074c.412-1.165 1.52-2 2.826-2m8-8c1.306 0 2.414.835 2.826 2H21.9c.608 0 1.1.448 1.1 1s-.492 1-1.1 1h-1.074a2.998 2.998 0 0 1-5.652 0H2.1c-.608 0-1.1-.448-1.1-1s.492-1 1.1-1h13.074c.412-1.165 1.52-2 2.826-2M7 1c1.306 0 2.414.835 2.826 2H21.9c.608 0 1.1.448 1.1 1s-.492 1-1.1 1H9.826A3 3 0 0 1 7 7a3 3 0 0 1-2.826-2H2.1C1.492 5 1 4.552 1 4s.492-1 1.1-1h2.074C4.586 1.835 5.694 1 7 1"
    />
  </svg>
);
export default SvgIconAdjustSettings;
