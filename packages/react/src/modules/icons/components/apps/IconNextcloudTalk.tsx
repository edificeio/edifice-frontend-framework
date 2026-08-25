import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconNextcloudTalk = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7c1.3 0 2.5-.4 3.6-1 .9.3 2.8 1.4 3.2.9.5-.5-.6-2.6-.8-3.4.6-1.1.9-2.3.9-3.5 0-3.9-3.1-7-7-7Zm0 2.7c2.4 0 4.3 1.9 4.3 4.3s-1.9 4.3-4.3 4.3S3.7 10.4 3.7 8 5.6 3.7 8 3.7"
    />
  </svg>
);
export default SvgIconNextcloudTalk;
