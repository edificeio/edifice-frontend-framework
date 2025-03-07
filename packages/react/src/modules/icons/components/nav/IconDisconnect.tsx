import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconDisconnect = ({
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
      d="M22.996 13.153q0 2.09-.873 3.987a10.6 10.6 0 0 1-2.336 3.292q-1.462 1.393-3.516 2.21t-4.26.817-4.287-.817-3.49-2.21a12.3 12.3 0 0 1-2.362-3.291A8.1 8.1 0 0 1 1 13.153q0-2.451 1.155-4.589t3.234-3.627q.616-.433 1.386-.337t1.181.673q.462.553.36 1.273-.104.72-.72 1.13a7 7 0 0 0-2.155 2.426 6.38 6.38 0 0 0-.18 5.717 7 7 0 0 0 1.566 2.186q.975.913 2.335 1.466a7.5 7.5 0 0 0 2.85.552 7.3 7.3 0 0 0 2.823-.552 8.3 8.3 0 0 0 2.36-1.466 6.04 6.04 0 0 0 1.567-2.186q.538-1.274.564-2.666 0-1.635-.77-3.051T16.4 7.675a1.75 1.75 0 0 1-.719-1.129q-.128-.697.36-1.273.436-.577 1.206-.673t1.36.337q2.079 1.466 3.234 3.627a9.6 9.6 0 0 1 1.155 4.589M13.833 2.846v8.6q0 .698-.54 1.202-.538.505-1.283.505t-1.309-.505q-.564-.505-.539-1.201v-8.6q0-.697.54-1.202.538-.504 1.308-.504t1.284.504.539 1.201"
    />
  </svg>
);
export default SvgIconDisconnect;
