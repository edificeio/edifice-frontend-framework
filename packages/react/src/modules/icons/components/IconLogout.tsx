import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconLogout = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 22 22"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M11.917.917a.916.916 0 0 1 0 1.833H5.042a.46.46 0 0 0-.459.458v15.584c0 .253.206.458.459.458h6.875a.917.917 0 0 1 0 1.833H5.042a2.29 2.29 0 0 1-2.292-2.291V3.208A2.29 2.29 0 0 1 5.042.917zm3.018 5.769a.916.916 0 0 1 1.296 0l3.667 3.666a.917.917 0 0 1 0 1.296l-3.667 3.667a.916.916 0 1 1-1.296-1.296L17.956 11l-3.02-3.019a.916.916 0 0 1 0-1.295"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M7.333 11c0-.506.41-.917.917-.917h11a.917.917 0 1 1 0 1.834h-11A.917.917 0 0 1 7.333 11"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconLogout;
