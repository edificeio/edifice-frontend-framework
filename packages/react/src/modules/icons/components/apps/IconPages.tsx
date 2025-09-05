import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconPages = ({
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
      d="M5 43.77V6.23h40v37.54zm4.92-4.93h30.17V11.16H9.91zm3.29-3.12v-6.64h6.64v6.64zm0-8.76V14.68h23.51V27zm8.44 8.76v-6.64h6.64v6.64zm8.44 0v-6.64h6.64v6.64z"
    />
  </svg>
);
export default SvgIconPages;
