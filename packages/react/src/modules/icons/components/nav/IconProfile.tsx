import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconProfile = ({
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
      d="M22.308 18.368A13.4 13.4 0 0 1 12.154 23 13.4 13.4 0 0 1 2 18.368c1.528-2.63 7.136-3.927 10.154-3.927s8.625 1.296 10.154 3.927M6.91 6.41c.004 2.948 2.348 5.335 5.243 5.33h.008c2.895-.004 5.239-2.39 5.235-5.338C17.397 3.45 15.053 1 12.154 1S6.91 3.45 6.91 6.402z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconProfile;
