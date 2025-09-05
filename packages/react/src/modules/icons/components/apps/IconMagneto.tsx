import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconMagneto = ({
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
      d="M28 32.5v-9a13.5 13.5 0 1 0-27 0v9h6v-9a7.5 7.5 0 0 1 15 0v9m-15 3H1V40h6m21-4.5h-6V40h6"
    />
    <path
      fill="currentColor"
      d="M49 32.5v-9a13.5 13.5 0 0 0-27 0v9h6v-9a7.5 7.5 0 0 1 15 0v9m-15 3h-6V40h6m21-4.5h-6V40h6"
    />
  </svg>
);
export default SvgIconMagneto;
