import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconFolderDelete = ({
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
      d="M2.756 2A2.756 2.756 0 0 0 0 4.756V18a3 3 0 0 0 3 3h6.5a1 1 0 1 0 0-2H3a1 1 0 0 1-1-1V4.756C2 4.34 2.339 4 2.756 4H9.5A2.5 2.5 0 0 1 12 6.5a1 1 0 0 0 1 1h8a1 1 0 0 1 1 1 1 1 0 1 0 2 0 3 3 0 0 0-3-3h-7.111A4.5 4.5 0 0 0 9.5 2zm20.85 9.536a1 1 0 0 1 0 1.414l-3.535 3.535 3.536 3.536a1 1 0 0 1-1.415 1.414L18.657 17.9l-3.536 3.535a1 1 0 0 1-1.414-1.414l3.536-3.536-3.536-3.535a1 1 0 0 1 1.414-1.414l3.536 3.535 3.535-3.535a1 1 0 0 1 1.415 0"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconFolderDelete;
