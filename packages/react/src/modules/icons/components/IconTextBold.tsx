import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconTextBold = ({
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
      d="M7.058 20.963a1.13 1.13 0 0 1-.759-.276.93.93 0 0 1-.299-.713V3.989q0-.437.276-.713A.97.97 0 0 1 6.989 3h5.566q1.426 0 2.553.598a4.7 4.7 0 0 1 1.817 1.633q.667 1.012.667 2.369 0 1.219-.667 2.162a4.4 4.4 0 0 1-1.702 1.472q1.518.39 2.461 1.518.943 1.104.943 2.852 0 1.587-.736 2.783-.712 1.196-2.001 1.886-1.265.69-2.921.69zm.92-1.863h4.991q1.08 0 1.909-.414a3.37 3.37 0 0 0 1.334-1.196q.483-.782.483-1.886 0-1.012-.483-1.748a3.1 3.1 0 0 0-1.334-1.127q-.828-.39-1.909-.391H7.978zm0-8.648h4.577q1.357 0 2.231-.736.874-.735.874-2.116 0-1.357-.874-2.047t-2.231-.69H7.978z"
    />
  </svg>
);
export default SvgIconTextBold;
