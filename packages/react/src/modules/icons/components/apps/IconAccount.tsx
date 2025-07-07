import type { SVGProps } from 'react';
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
      d="M25 29.78c6.33 0 19 3.11 19 9.44V44H6v-4.78c0-6.33 12.67-9.44 19-9.44M25 26a9.43 9.43 0 0 1-9.44-9.44 9.44 9.44 0 1 1 18.164 3.614A9.43 9.43 0 0 1 25 26"
    />
  </svg>
);
export default SvgIconAccount;
