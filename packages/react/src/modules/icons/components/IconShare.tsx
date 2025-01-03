import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconShare = ({
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
      d="M18.3 2.59c-1.16 0-2.1.937-2.1 2.092a2.07 2.07 0 0 0 .316 1.103 2.1 2.1 0 0 0 1.784.988c1.16 0 2.1-.936 2.1-2.091s-.94-2.091-2.1-2.091m-2.984 5.035A4.2 4.2 0 0 0 18.3 8.864c2.32 0 4.2-1.873 4.2-4.182S20.62.5 18.3.5s-4.2 1.872-4.2 4.182c0 .394.055.775.157 1.137L8.684 9.057A4.2 4.2 0 0 0 5.7 7.818C3.38 7.818 1.5 9.69 1.5 12s1.88 4.182 4.2 4.182a4.2 4.2 0 0 0 2.984-1.24l5.575 3.234a4.2 4.2 0 0 0-.159 1.142c0 2.31 1.88 4.182 4.2 4.182s4.2-1.872 4.2-4.182-1.88-4.182-4.2-4.182c-1.165 0-2.22.473-2.98 1.236l-5.577-3.235a4.17 4.17 0 0 0 0-2.274zm-7.831 3.273a1 1 0 0 0 .058.1 2.075 2.075 0 0 1-.059 2.105 2.1 2.1 0 0 1-1.784.988c-1.16 0-2.1-.936-2.1-2.091s.94-2.09 2.1-2.09a2.1 2.1 0 0 1 1.785.988m8.715 8.42c0-.34.081-.66.226-.944a1 1 0 0 0 .129-.219 2.1 2.1 0 0 1 1.745-.928c1.16 0 2.1.936 2.1 2.091s-.94 2.091-2.1 2.091-2.1-.936-2.1-2.09"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconShare;
