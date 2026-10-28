import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconNotificationBeta = ({
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
      d="M12.016.5a3.04 3.04 0 0 1 3.02 2.663c3.36 1.192 5.771 4.401 5.772 8.168v1.845h1.656v7.01h-6.522a3.94 3.94 0 0 1-7.778 0h-6.12v-7.01h1.434V11.33c0-3.666 2.284-6.802 5.505-8.066A3.045 3.045 0 0 1 12.016.5m-1.798 19.687a1.94 1.94 0 0 0 3.67 0zm-6.175-5.01v3.01h16.42v-3.01zm8.1-10.511a6.67 6.67 0 0 0-6.665 6.665v1.845h13.33V11.33a6.67 6.67 0 0 0-6.665-6.665"
    />
  </svg>
);
export default SvgIconNotificationBeta;
