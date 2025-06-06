import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconTool = ({
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
      d="M15.865 3.931a4.761 4.761 0 0 0-4.873 6.696.95.95 0 0 1-.195 1.066l-6.58 6.58a1.068 1.068 0 0 0 1.51 1.511l6.58-6.581a.95.95 0 0 1 1.067-.194 4.762 4.762 0 0 0 6.695-4.873l-2.45 2.45a1.905 1.905 0 0 1-2.667 0l-.006-.008-1.53-1.53a1.905 1.905 0 0 1 0-2.667l.006-.007zm-1.73-1.826a6.67 6.67 0 0 1 3.943.485.953.953 0 0 1 .281 1.54l-3.584 3.584 1.51 1.51 3.584-3.583a.952.952 0 0 1 1.542.28 6.666 6.666 0 0 1-8.197 9.07l-6.14 6.14a2.973 2.973 0 0 1-4.205-4.204l6.141-6.141a6.667 6.667 0 0 1 5.125-8.681"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconTool;
