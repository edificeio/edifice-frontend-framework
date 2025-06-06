import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconCalendar = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 23 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M1.7 22.87h3.88V19H1.7zm4.75 0h4.28V19H6.45zM1.7 18.13h3.87v-4.28H1.7zm4.74 0h4.28v-4.28H6.45v4.28zM1.7 13h3.87V9.12H1.7v3.87zm9.88 9.88h4.3V19h-4.3v3.87zM6.45 13h4.28V9.12H6.45v3.87zm10.29 9.88h3.87V19h-3.87v3.87zm-5.15-4.74h4.3v-4.28h-4.3zM6.88 6.54V2.67q0-.16-.15-.29t-.29-.14h-.86q-.17 0-.29.14t-.14.3v3.86q0 .17.14.32t.29.12h.86q.17 0 .3-.12t.14-.32m9.86 11.6h3.87v-4.29h-3.87v4.28zm-5.15-5.15h4.3V9.12h-4.3zm5.15 0h3.87V9.12h-3.87zm.43-6.45V2.67q0-.16-.12-.29t-.31-.14h-.84q-.17 0-.32.14t-.12.3v3.86q0 .17.12.32t.32.12h.84q.19 0 .31-.12t.12-.32m5.17-.86v17.2q0 .69-.53 1.2t-1.2.5H1.7q-.7 0-1.2-.5t-.5-1.2V5.67q0-.7.5-1.2t1.2-.5h1.73v-1.3q0-.9.63-1.52T5.57.53h.86q.9 0 1.52.63t.63 1.51v1.3h5.14v-1.3q0-.89.65-1.51T15.9.53h.84q.89 0 1.54.63t.62 1.51v1.3h1.7q.7 0 1.2.5t.54 1.2z"
    />
  </svg>
);
export default SvgIconCalendar;
