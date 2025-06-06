import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconReset = ({
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
      d="M4.583 7.313 3.976 3.87a.996.996 0 1 0-1.96.346l1.012 5.747a.996.996 0 0 0 1.153.809l5.743-1.014a.997.997 0 0 0-.346-1.962l-3.3.582a7.754 7.754 0 0 1 8.399-4.254 7.76 7.76 0 0 1 .78 15.064 7.745 7.745 0 0 1-8.912-3.56.995.995 0 1 0-1.724.997 9.744 9.744 0 0 0 11.201 4.474 9.74 9.74 0 0 0 5.19-3.718 9.756 9.756 0 0 0-.625-12.055A9.74 9.74 0 0 0 8.73 3.117a9.75 9.75 0 0 0-4.147 4.196"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconReset;
