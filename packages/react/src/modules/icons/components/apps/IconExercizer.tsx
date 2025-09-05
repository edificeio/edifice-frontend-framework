import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconExercizer = ({
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
      d="m15.21 41.1 8.38-4.19V30l-8.38 3.61zm-1.41-10 8.85-3.76-8.85-3.8L5 27.39zm23.81 10L46 36.91V30l-8.38 3.61zm-1.41-10 8.8-3.71-8.81-3.8-8.85 3.8zm-9.79-6.39 8.38-3.6v-5.78l-8.38 3.6zM25 16.46l9.63-4.11L25 8.2l-9.64 4.15zm23.77 11.32v9.13a2.8 2.8 0 0 1-.39 1.44 2.47 2.47 0 0 1-1.14 1l-9.79 4.9a2.68 2.68 0 0 1-2.5 0l-9.79-4.9a.3.3 0 0 1-.16-.08.34.34 0 0 1-.16.08l-9.79 4.9a2.44 2.44 0 0 1-1.25.31 2.3 2.3 0 0 1-1.22-.31l-9.79-4.9a2.5 2.5 0 0 1-1.13-1 3 3 0 0 1-.43-1.44v-9.13a2.65 2.65 0 0 1 .47-1.53 2.66 2.66 0 0 1 1.25-1l9.48-4.07v-8.75a2.82 2.82 0 0 1 1.68-2.59l9.79-4.19a2.75 2.75 0 0 1 2.2 0l9.79 4.19c.498.217.93.562 1.25 1a2.7 2.7 0 0 1 .47 1.57v8.73l9.48 4.07c.51.197.946.546 1.25 1 .307.449.458.987.43 1.53z"
    />
  </svg>
);
export default SvgIconExercizer;
