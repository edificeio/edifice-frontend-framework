import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconNewRelease = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M13.07 13.07V6.54h-2.14v6.53zm0 4.4v-2.2h-2.14v2.2zM24 12l-2.65 3.01.35 4.04-3.93.86-2.04 3.48L12 21.8l-3.73 1.6-2.04-3.42-3.93-.92.35-4.04L0 12l2.65-3.06-.35-3.99 3.93-.86L8.27.6 12 2.2 15.73.6l2.04 3.48 3.93.86L21.34 9z"
    />
  </svg>
);
export default SvgIconNewRelease;
