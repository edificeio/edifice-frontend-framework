import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconPeertube = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="69.8 0 372.4 512"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M69.8 0v256L256 139.6"
      style={{
        fill: '#211f20',
      }}
    />
    <path
      d="M69.8 256v256L256 372.4"
      style={{
        fill: '#737373',
      }}
    />
    <path
      d="M256 139.6v232.7L442.2 256"
      style={{
        fill: '#f1680d',
      }}
    />
    <path d="M256 372.4V139.6L69.8 256z" />
  </svg>
);
export default SvgIconPeertube;
