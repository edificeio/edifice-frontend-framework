import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconDeleteColor = ({
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
      d="M8.937 15.502a1 1 0 0 1 1.061.934c.046.727.17 1.217.408 1.526.188.244.574.538 1.594.538a1 1 0 1 1 0 2c-1.442 0-2.507-.444-3.18-1.319-.622-.809-.767-1.82-.818-2.618a1 1 0 0 1 .935-1.061"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12.95 1.184a1 1 0 0 0-1.897 0c-.575 1.722-1.339 3.332-2.14 4.9l1.485 1.485A56 56 0 0 0 12 4.263c.662 1.515 1.413 2.95 2.118 4.298.291.556.574 1.098.84 1.624.623 1.231 1.148 2.372 1.51 3.455l2.522 2.523c-.1-2.342-1.112-4.636-2.247-6.88-.291-.577-.592-1.151-.893-1.729-1.065-2.035-2.146-4.105-2.9-6.37m4.89 19.484-1.459-1.459a4.2 4.2 0 0 1-.606.869c-.733.806-1.906 1.422-3.773 1.422s-3.04-.616-3.775-1.422c-.757-.831-1.142-1.969-1.215-3.14-.108-1.745.501-3.561 1.474-5.624L6.988 9.816c-1.165 2.362-2.125 4.778-1.972 7.246.094 1.497.592 3.11 1.732 4.362C7.91 22.7 9.648 23.5 12.002 23.5s4.09-.8 5.252-2.076q.328-.36.586-.756M3.293 3.293a1 1 0 0 1 1.414 0l17 17a1 1 0 0 1-1.414 1.414l-17-17a1 1 0 0 1 0-1.414"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconDeleteColor;
