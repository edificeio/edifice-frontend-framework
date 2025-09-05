import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconTimelinegenerator = ({
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
      d="M34.52 35a5.71 5.71 0 0 1 0 11.42 5.22 5.22 0 0 1-5.24-3.52h-7.8c-2.8 0-4.87-.86-6.24-2.57a8.86 8.86 0 0 1-2.05-5.62V12.58a5.44 5.44 0 0 1-3.42-5.24 5.5 5.5 0 0 1 1.66-4 5.5 5.5 0 0 1 4.05-1.66 5.67 5.67 0 0 1 5.71 5.71 5.44 5.44 0 0 1-3.43 5.24V18q0 3.72 3.72 3.72h7.8a5.22 5.22 0 0 1 5.24-3.43A5.67 5.67 0 0 1 40.23 24a5.67 5.67 0 0 1-5.71 5.71 5.22 5.22 0 0 1-5.24-3.52h-7.8a9 9 0 0 1-3.72-.76v9.23q0 3.72 3.72 3.72h7.8A5.22 5.22 0 0 1 34.52 35m0-14.28a3.27 3.27 0 0 0-2.33.95 3.13 3.13 0 0 0-1 2.38 3 3 0 0 0 1 2.28 3.31 3.31 0 0 0 4.66 0 3 3 0 0 0 1-2.28 3.13 3.13 0 0 0-1-2.38 3.27 3.27 0 0 0-2.33-1zM12.15 7.34a3 3 0 0 0 1 2.28 3.31 3.31 0 0 0 4.66 0 3 3 0 0 0 1-2.28 3.13 3.13 0 0 0-1-2.38 3.33 3.33 0 0 0-4.66 0 3.13 3.13 0 0 0-1 2.38M34.52 43.9a3.27 3.27 0 0 0 2.33-.9 3 3 0 0 0 1-2.29 3.15 3.15 0 0 0-1-2.38 3.33 3.33 0 0 0-4.66 0 3.15 3.15 0 0 0-1 2.38 3 3 0 0 0 1 2.29 3.27 3.27 0 0 0 2.33.9"
    />
  </svg>
);
export default SvgIconTimelinegenerator;
