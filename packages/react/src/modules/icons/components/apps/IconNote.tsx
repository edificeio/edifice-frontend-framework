import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconNote = ({
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
      d="m11.93 16.43 1.54-1.57-2.05-2.04-1.54 1.56v.75h1.28v1.3zm5.89-9.67q-.22-.22-.43 0l-4.72 4.71q-.21.22 0 .44t.44 0l4.7-4.72q.23-.21 0-.43zm1.08 7.96v2.55q0 1.61-1.13 2.74t-2.74 1.13H3.87q-1.6 0-2.74-1.13T0 17.27V6.1q0-1.58 1.13-2.7t2.74-1.15h11.16q.84 0 1.56.34.22.1.24.31.05.24-.12.39l-.65.67q-.19.19-.43.1-.31-.08-.6-.08H3.87q-.89 0-1.51.63T1.7 6.1v11.16q0 .89.65 1.52t1.51.64h11.16q.89 0 1.51-.64t.63-1.52v-1.68q0-.17.12-.3l.87-.86q.19-.19.48-.1t.26.4zm-1.3-9.88 3.87 3.84-9.01 9.02H8.58v-3.85zm5.97 1.75-1.23 1.25-3.87-3.87 1.22-1.25q.39-.36.92-.36t.91.36l2.05 2.04q.38.39.38.92t-.38.91"
    />
  </svg>
);
export default SvgIconNote;
