import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconBulletList = ({
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
    <circle cx={3.5} cy={12} r={1.5} fill="currentColor" />
    <circle cx={3.5} cy={3.5} r={1.5} fill="currentColor" />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M8 3.5c0-.552.418-1 .933-1h12.134c.515 0 .933.448.933 1s-.418 1-.933 1H8.933C8.418 4.5 8 4.052 8 3.5M8 12c0-.552.418-1 .933-1h12.134c.515 0 .933.448.933 1s-.418 1-.933 1H8.933C8.418 13 8 12.552 8 12"
      clipRule="evenodd"
    />
    <circle cx={3.5} cy={20.5} r={1.5} fill="currentColor" />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M8 20.5c0-.552.418-1 .933-1h12.134c.515 0 .933.448.933 1s-.418 1-.933 1H8.933c-.515 0-.933-.448-.933-1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconBulletList;
