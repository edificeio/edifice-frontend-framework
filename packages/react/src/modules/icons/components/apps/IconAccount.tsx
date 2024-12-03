import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconAccount = ({
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
    <path d="M12.01 14.42c2.68 0 8.03 1.31 8.03 3.99v2.02H3.99V18.4c0-2.68 5.35-3.99 8.02-3.99zm0-2.02a4.02 4.02 0 0 1 0-8.02C14.21 4.38 16 6.2 16 8.4s-1.78 4-3.99 4" />
  </svg>
);
export default SvgIconAccount;
