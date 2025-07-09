import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconConversation = ({
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
      d="m4.31 41.68 13.41-14.15L25 31.67l7.28-4.14 13.41 14.15zm0-4.71V19.83l10.51 6.09zm0-20.82v-5.83h41.38v5.83L25 28zm30.87 9.77 10.51-6.09V37z"
    />
  </svg>
);
export default SvgIconConversation;
