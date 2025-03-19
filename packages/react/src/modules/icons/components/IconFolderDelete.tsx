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
      d="M2.297 1.667A2.297 2.297 0 0 0 0 3.963V15a2.5 2.5 0 0 0 2.5 2.5h5.417a.833.833 0 0 0 0-1.667H2.5A.833.833 0 0 1 1.667 15V3.963a.63.63 0 0 1 .63-.63h5.62c1.15 0 2.083.933 2.083 2.084 0 .46.373.833.833.833H17.5c.46 0 .833.373.833.833a.833.833 0 0 0 1.667 0 2.5 2.5 0 0 0-2.5-2.5h-5.926a3.75 3.75 0 0 0-3.657-2.916zm17.375 7.946a.833.833 0 0 1 0 1.178l-2.946 2.947 2.946 2.946a.833.833 0 0 1-1.178 1.179l-2.947-2.947-2.946 2.947a.833.833 0 0 1-1.178-1.179l2.946-2.946-2.946-2.946A.833.833 0 0 1 12.6 9.613l2.946 2.946 2.947-2.946a.833.833 0 0 1 1.178 0"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconFolderDelete;
