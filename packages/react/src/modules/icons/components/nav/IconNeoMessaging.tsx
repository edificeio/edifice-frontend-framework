import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconNeoMessaging = ({
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
      d="m.5 21.257 7.46-8.216 4.052 2.403 4.052-2.403 7.46 8.216zm0-2.738V8.573l5.848 3.531zm0-12.084V3.048h23.024v3.387l-11.512 6.847zm17.176 5.67 5.848-3.532v9.946z"
    />
  </svg>
);
export default SvgIconNeoMessaging;
