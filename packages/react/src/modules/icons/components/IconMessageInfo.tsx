import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconMessageInfo = ({
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
      d="M4.3 5c-.292 0-.572.105-.778.293A.96.96 0 0 0 3.2 6v14.586l2.522-2.293c.206-.188.486-.293.778-.293h13.2c.292 0 .572-.105.778-.293A.96.96 0 0 0 20.8 17V6a.96.96 0 0 0-.322-.707A1.16 1.16 0 0 0 19.7 5zM1.967 3.879A3.48 3.48 0 0 1 4.3 3h15.4c.875 0 1.715.316 2.334.879C22.652 4.44 23 5.204 23 6v11c0 .796-.348 1.559-.966 2.121A3.48 3.48 0 0 1 19.7 20H6.956l-4.078 3.707a1.18 1.18 0 0 1-1.199.217C1.268 23.769 1 23.404 1 23V6c0-.796.348-1.559.967-2.121"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M7 9a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1M7 14a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconMessageInfo;
