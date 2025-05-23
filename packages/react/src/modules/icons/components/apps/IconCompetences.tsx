import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconCompetences = ({
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
      d="M.32 21.44H23.7a.32.32 0 0 1 .32.32v1.76a.32.32 0 0 1-.32.32H.32a.32.32 0 0 1-.32-.32v-1.76a.32.32 0 0 1 .32-.32m0-3.2h3.2a.32.32 0 0 1 .32.32v1.76a.32.32 0 0 1-.32.32H.32a.32.32 0 0 1-.32-.32v-1.76a.32.32 0 0 1 .32-.32m5.04-2h3.2a.32.32 0 0 1 .33.32v3.76a.32.32 0 0 1-.32.32h-3.2a.32.32 0 0 1-.32-.32v-3.76a.32.32 0 0 1 .32-.32zm5.05-1.2h3.2a.32.32 0 0 1 .32.31v4.97a.32.32 0 0 1-.32.32h-3.2a.32.32 0 0 1-.32-.32v-4.97a.32.32 0 0 1 .32-.32zm5.04-2.8h3.2a.32.32 0 0 1 .33.31v7.77a.32.32 0 0 1-.32.32h-3.2a.32.32 0 0 1-.32-.32v-7.77a.32.32 0 0 1 .32-.32zm5.05-3.61h3.2a.32.32 0 0 1 .32.32v11.37a.32.32 0 0 1-.32.32h-3.2a.32.32 0 0 1-.32-.32V8.95a.32.32 0 0 1 .32-.32M.39 15.99c-.44 0-.45-.05-.01-.13 0 0 5.24-.63 12.2-5.2s7.24-6.04 7.24-6.04l2.68 1.45s-1.26 2.08-8.25 6.2C7.51 16.25.4 16 .4 16zM23.74-.1c.14-.1.26-.04.26.14l-.02 6.57c0 .18-.12.25-.28.17l-5.31-2.76c-.16-.08-.17-.23-.03-.33z"
    />
  </svg>
);
export default SvgIconCompetences;
