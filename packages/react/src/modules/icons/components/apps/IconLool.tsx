import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconLool = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 50 50"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M47.128 41.944a2.5 2.5 0 0 1-2.5 2.5H40a1.667 1.667 0 0 1 0-3.333h3.795V3.333H16.017V6.08a1.667 1.667 0 0 1-3.333 0V2.5a2.5 2.5 0 0 1 2.5-2.5h29.444a2.5 2.5 0 0 1 2.5 2.5z"
    />
    <path
      fill="currentColor"
      d="M8.333 45.833H37.5v-37.5H8.333zm32.5.834a2.5 2.5 0 0 1-2.5 2.5H7.5a2.5 2.5 0 0 1-2.5-2.5V7.5A2.5 2.5 0 0 1 7.5 5h30.833a2.5 2.5 0 0 1 2.5 2.5z"
    />
    <path
      fill="currentColor"
      d="M20.982 21.11a9.314 9.314 0 0 0-9.315 9.314 9.314 9.314 0 0 0 9.315 9.315 9.314 9.314 0 0 0 9.315-9.315h-9.315z"
    />
    <path
      fill="currentColor"
      d="M25.127 17.22v9.315h9.315a9.314 9.314 0 0 0-9.315-9.315"
    />
  </svg>
);
export default SvgIconLool;
