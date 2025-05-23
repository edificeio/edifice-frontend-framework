import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconSupport = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 21 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M12.02 19v-2.57q0-.2-.12-.32t-.3-.11H9.02q-.2 0-.32.12t-.12.32V19q0 .2.12.31t.32.12h2.57q.2 0 .31-.12t.12-.31m3.44-9.02q0-1.18-.74-2.19t-1.86-1.56-2.28-.55q-3.27 0-4.98 2.86-.21.31.1.58l1.78 1.32q.1.1.24.1.22 0 .34-.17.72-.92 1.15-1.23.46-.34 1.15-.34.65 0 1.16.36t.5.8q0 .5-.26.81t-.91.6q-.85.37-1.57 1.16t-.7 1.68v.48q0 .2.13.32t.3.12h2.58q.2 0 .31-.12t.12-.32q0-.24.3-.65t.71-.67l.68-.38q.24-.14.6-.46t.6-.65.39-.82.16-1.08m5.15 2.58q0 2.8-1.37 5.17t-3.75 3.75-5.17 1.4-5.2-1.4-3.73-3.75T0 12.56t1.4-5.17 3.73-3.76 5.2-1.4 5.17 1.4 3.75 3.76 1.37 5.17z"
    />
  </svg>
);
export default SvgIconSupport;
