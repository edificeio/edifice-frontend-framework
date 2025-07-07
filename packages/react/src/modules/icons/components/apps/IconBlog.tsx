import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconBlog = ({
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
      d="M10.18 22.18a.7.7 0 0 0 .64-.72.63.63 0 0 0-.64-.65h-4a.7.7 0 0 0-.72.65.77.77 0 0 0 .72.72zm0 2.9a.69.69 0 0 0 0-1.37h-4a.69.69 0 1 0 0 1.37zm8.46.57a15.7 15.7 0 0 1 11.68 4.87V15.38a15.37 15.37 0 0 1-11.68 5.07zm20-8.86-1.33-1.37 5.52-5.48 1.37 1.29zm1 7V21.9h9.26v1.93zm-2.34 6.89 1.33-1.37 5.56 5.56-1.35 1.33zM32.17 9.94a1.4 1.4 0 0 1 1.45 1.37v23.24a1.41 1.41 0 0 1-1.45 1.37 1.37 1.37 0 0 1-1.41-1.37c-2.38-2.9-6.53-6.65-12.76-6.65h-2.59l5.64 9.51-3.42 2.49a1.9 1.9 0 0 1-2.26-.72l-7-11.28H4.58S1.08 26 1.08 23s3.5-4.75 3.5-4.75H18c6.24 0 10.39-3.87 12.77-6.93a1.36 1.36 0 0 1 1.41-1.37z"
    />
  </svg>
);
export default SvgIconBlog;
