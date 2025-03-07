import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconNeoAssistance = ({
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
      d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12M7.123 7.667C8.276 5.958 9.745 5 12.013 5 14.425 5 17 6.941 17 9.5c0 2.113-1.377 2.932-2.418 3.552-.633.376-1.142.68-1.142 1.154v.169a.693.693 0 0 1-.682.703h-2.06a.693.693 0 0 1-.681-.703v-.287c0-1.768 1.269-2.5 2.266-3.075l.073-.042c.863-.499 1.392-.838 1.392-1.499 0-.874-1.082-1.454-1.956-1.454-1.112 0-1.64.53-2.351 1.449a.67.67 0 0 1-.945.121L7.27 8.63a.72.72 0 0 1-.147-.963M9.76 17.97c0-1.12.883-2.03 1.969-2.03 1.085 0 1.968.91 1.968 2.03S12.814 20 11.73 20c-1.086 0-1.969-.91-1.969-2.03"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconNeoAssistance;
