import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconArchive = ({
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
      d="M23 13.15v-2.94h-2.9v2.94zm3 3v-3h-3v3zm-3 2.94v-2.95h-2.9v2.94zm3 3v-3h-3v3zm16.16-9c.48.502.857 1.093 1.11 1.74a5.2 5.2 0 0 1 .46 2.07v26.57a2.16 2.16 0 0 1-.62 1.58 2.32 2.32 0 0 1-1.58.66H10.49a2.08 2.08 0 0 1-1.58-.66 2.43 2.43 0 0 1-.66-1.58V6.53A2.08 2.08 0 0 1 8.91 5a2.43 2.43 0 0 1 1.58-.66H31.2a5.5 5.5 0 0 1 2 .45A5.1 5.1 0 0 1 35 5.86zM31.9 7.44v8.7h8.7a2 2 0 0 0-.5-1l-7.24-7.21a2 2 0 0 0-1-.49zm8.91 35.33V19.08H31.2a2.06 2.06 0 0 1-1.58-.67 2.36 2.36 0 0 1-.62-1.53V7.23h-3v3h-3v-3H11.19v35.54zm-14.5-16.69 2.49 8.07c.119.393.186.8.2 1.21a3.89 3.89 0 0 1-1.66 3.19A6.58 6.58 0 0 1 23 39.79a7.15 7.15 0 0 1-4.23-1.24 4.06 4.06 0 0 1-1.7-3.19c.004-.412.075-.82.21-1.21q.49-1.44 2.78-9.15v-2.94H23V25h1.82a1.46 1.46 0 0 1 .91.29 1.6 1.6 0 0 1 .54.79zM23 36.85a4.4 4.4 0 0 0 2.11-.46c.58-.3.87-.65.87-1s-.29-.74-.87-1a4.54 4.54 0 0 0-2.11-.53 4.3 4.3 0 0 0-2.07.46c-.56.3-.85.65-.87 1s.26.73.87 1a4.44 4.44 0 0 0 2.07.53"
    />
  </svg>
);
export default SvgIconArchive;
