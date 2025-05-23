import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconPaperclip = ({
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
      d="M15.968 3c-.775 0-1.517.306-2.062.847l-8.983 8.918a4.8 4.8 0 0 0-1.423 3.41c0 1.277.511 2.504 1.423 3.41A4.9 4.9 0 0 0 8.368 21a4.9 4.9 0 0 0 3.445-1.416l8.983-8.918a1 1 0 1 1 1.409 1.42l-8.983 8.917A6.9 6.9 0 0 1 8.368 23a6.9 6.9 0 0 1-4.854-1.997A6.8 6.8 0 0 1 1.5 16.174c0-1.812.725-3.549 2.014-4.828l8.983-8.918A4.93 4.93 0 0 1 15.967 1c1.301 0 2.55.513 3.471 1.428a4.87 4.87 0 0 1 1.442 3.456 4.87 4.87 0 0 1-1.442 3.455l-8.992 8.918a2.965 2.965 0 0 1-4.175 0 2.935 2.935 0 0 1 0-4.165l8.299-8.23a1 1 0 0 1 1.408 1.42l-8.298 8.23a.935.935 0 0 0 0 1.326.963.963 0 0 0 1.357 0l8.992-8.918c.545-.541.85-1.274.85-2.036a2.87 2.87 0 0 0-.85-2.037A2.93 2.93 0 0 0 15.968 3"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconPaperclip;
