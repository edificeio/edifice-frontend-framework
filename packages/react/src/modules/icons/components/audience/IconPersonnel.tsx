import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconPersonnel = ({
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
      d="M2 20V5.25q0-.25.1-.45a1 1 0 0 1 .3-.35l4-3a1 1 0 0 1 1.2 0l4 3q.2.15.3.35t.1.45V7h9q.424 0 .712.287Q22 7.576 22 8v12q0 .424-.288.712A.97.97 0 0 1 21 21H3a.97.97 0 0 1-.712-.288A.97.97 0 0 1 2 20m2-1h2v-2H4zm0-4h2v-2H4zm0-4h2V9H4zm0-4h2V5H4zm4 0h2V5H8zm0 12h12V9H8zm7-8h2q.424 0 .712.287.288.288.288.713 0 .424-.288.713A.97.97 0 0 1 17 13h-2a.97.97 0 0 1-.713-.287A.97.97 0 0 1 14 12q0-.424.287-.713A.97.97 0 0 1 15 11m0 4h2q.424 0 .712.287.288.288.288.713 0 .424-.288.712A.97.97 0 0 1 17 17h-2a.97.97 0 0 1-.713-.288A.97.97 0 0 1 14 16q0-.424.287-.713A.97.97 0 0 1 15 15m-3-3q0 .424-.287.713A.97.97 0 0 1 11 13a.97.97 0 0 1-.713-.287A.97.97 0 0 1 10 12q0-.424.287-.713A.97.97 0 0 1 11 11q.424 0 .713.287.287.288.287.713m-1 5a.97.97 0 0 1-.713-.288A.97.97 0 0 1 10 16q0-.424.287-.713A.97.97 0 0 1 11 15q.424 0 .713.287.287.288.287.713 0 .424-.287.712A.97.97 0 0 1 11 17"
    />
  </svg>
);
export default SvgIconPersonnel;
