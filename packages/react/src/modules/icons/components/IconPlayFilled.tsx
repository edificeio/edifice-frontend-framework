import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconPlayFilled = ({
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
      d="M5 3.804c0-1.57 1.728-2.528 3.06-1.696l13.113 8.196a2 2 0 0 1 0 3.392L8.06 21.892C6.728 22.724 5 21.767 5 20.196z"
    />
  </svg>
);
export default SvgIconPlayFilled;
