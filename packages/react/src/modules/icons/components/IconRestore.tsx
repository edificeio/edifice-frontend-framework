import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconRestore = ({
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
      d="m20.417 7.812.606-3.442a.996.996 0 1 1 1.962.346l-1.013 5.747a.996.996 0 0 1-1.153.809l-5.743-1.014a.996.996 0 0 1 .346-1.962l3.3.582a7.754 7.754 0 0 0-8.399-4.254 7.75 7.75 0 0 0-6.321 7.224 7.76 7.76 0 0 0 5.54 7.84 7.745 7.745 0 0 0 8.913-3.56.995.995 0 1 1 1.724.997 9.744 9.744 0 0 1-11.201 4.474 9.74 9.74 0 0 1-5.19-3.718 9.756 9.756 0 0 1 .625-12.055A9.74 9.74 0 0 1 16.27 3.617a9.75 9.75 0 0 1 4.147 4.195"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconRestore;
