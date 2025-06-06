import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconHome = ({
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
      d="M20.584 13.536v7.458q0 .42-.294.699a1.06 1.06 0 0 1-.667.307H13.91v-5.978h-3.817V22H4.383a.85.85 0 0 1-.668-.307 1.16 1.16 0 0 1-.293-.699v-7.569l8.567-7.375 8.568 7.375q.027.027.027.111m3.31-1.09-.908 1.146a.54.54 0 0 1-.32.168h-.054a.6.6 0 0 1-.32-.084L11.989 4.682 1.687 13.676a.5.5 0 0 1-.347.084.54.54 0 0 1-.32-.168l-.935-1.145a.52.52 0 0 1-.08-.363.6.6 0 0 1 .16-.335l10.703-9.33q.48-.42 1.121-.419.64 0 1.148.419l3.63 3.156V2.56q0-.224.133-.363a.46.46 0 0 1 .347-.14h2.856q.214 0 .347.14a.5.5 0 0 1 .134.363v6.34l3.256 2.85q.16.111.16.335 0 .223-.107.363"
    />
  </svg>
);
export default SvgIconHome;
