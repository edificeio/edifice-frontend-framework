import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconTextColor = ({
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
      d="M5.74 18a.91.91 0 0 1-.838-.473 1.01 1.01 0 0 1-.043-.99L11.01 1.888q.28-.688.946-.688.71 0 .968.688L19.1 16.58a.97.97 0 0 1-.086.968q-.28.452-.84.452-.278 0-.537-.15a1.05 1.05 0 0 1-.387-.474l-5.571-13.68h.624l-5.615 13.68a.92.92 0 0 1-.387.473q-.258.15-.56.151m1.248-4.832.796-1.7h8.54l.774 1.7z"
    />
    <path
      fill="#46AFE6"
      d="M1.2 21.8a2 2 0 0 1 2-2h3.4V24H3.2a2 2 0 0 1-2-2z"
    />
    <path fill="#A348C0" d="M6.6 19.8H12V24H6.6z" />
    <path fill="#FF3A55" d="M12 19.8h5.4V24H12z" />
    <path
      fill="#FF8D2E"
      d="M17.4 19.8h3.4a2 2 0 0 1 2 2v.2a2 2 0 0 1-2 2h-3.4z"
    />
  </svg>
);
export default SvgIconTextColor;
