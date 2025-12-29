import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconSubmitToValidate = ({
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
      d="M10.844 7.9a1 1 0 0 0-.085 1.41c.366.417.998.463 1.412.1l4.18-3.656a.99.99 0 0 0 .337-.762 1.01 1.01 0 0 0-.363-.757L12.019.632a1 1 0 0 0-1.408.118 1 1 0 0 0 .134 1.41l2.2 1.84h-.939c-5.617-.067-9.838 4.478-9.905 9.887-.05 4.03 2.374 7.51 5.865 9.091a1 1 0 0 0 .825-1.822c-2.815-1.274-4.73-4.058-4.69-7.244C4.156 9.521 7.554 5.945 11.988 6h1.028zm10.785.822a1 1 0 0 1 .148 1.407l-6.875 8.5a1 1 0 0 1-1.572-.022l-3.125-4.09a1 1 0 0 1 1.59-1.215l2.352 3.08 6.076-7.51a1 1 0 0 1 1.406-.15"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconSubmitToValidate;
