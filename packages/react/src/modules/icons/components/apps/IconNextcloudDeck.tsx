import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconNextcloudDeck = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M5.1 14.2h21.7c1 0 1.8.8 1.8 1.8v10.9c0 1-.8 1.8-1.8 1.8H5.1c-1 0-1.8-.8-1.8-1.8V16c0-1 .8-1.8 1.8-1.8m.9-3.6h20c.5 0 .9.4.9.9s-.4.9-.9.9H6c-.5 0-.9-.4-.9-.9s.4-.9.9-.9M7.9 7h16.3c.4 0 .8.4.8.9s-.4.9-.9.9H7.9c-.5 0-.9-.4-.9-.9s.4-.9.9-.9m1.8-3.7h12.7c.5 0 .9.4.9.9s-.4.9-.9.9H9.7c-.5 0-.9-.4-.9-.9s.4-.9.9-.9"
    />
  </svg>
);
export default SvgIconNextcloudDeck;
