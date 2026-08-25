import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconNextcloudNotes = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M15 94.2V115h20.8l61.4-61.4-20.8-20.9zm98.4-56.7c2.2-2.2 2.2-5.7 0-7.8l-13-13c-2.2-2.2-5.7-2.2-7.8 0L82.4 26.8l20.8 20.8z"
    />
  </svg>
);
export default SvgIconNextcloudNotes;
