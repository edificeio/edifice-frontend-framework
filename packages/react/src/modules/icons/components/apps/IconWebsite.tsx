import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconWebsite = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M17.55 14.61c0 1.01.28 1.41 1.03 1.41 1.68 0 2.74-2.13 2.74-5.67 0-5.43-3.94-8.02-8.88-8.02-5.07 0-9.68 3.4-9.68 9.83 0 6.14 4.03 9.49 10.23 9.49 2.1 0 3.52-.23 5.68-.95l.46 1.93c-2.13.69-4.41.89-6.17.89C4.83 23.52.48 19.05.48 12.16.48 5.21 5.52.5 12.48.5c7.23 0 11.06 4.32 11.06 9.62 0 4.5-1.41 7.93-5.85 7.93-2.02 0-3.34-.8-3.52-2.6-.51 2-1.9 2.6-3.77 2.6-2.51 0-4.62-1.93-4.62-5.82 0-3.92 1.85-6.34 5.17-6.34 1.75 0 2.85.69 3.34 1.78l.83-1.52h2.43v8.47zM14 10.81a2.12 2.12 0 0 0-2.16-2.25c-1.07 0-2.25.86-2.25 3.4 0 2.02.9 3.14 2.25 3.14.95 0 2.16-.6 2.16-2.27V10.8z"
    />
  </svg>
);
export default SvgIconWebsite;
