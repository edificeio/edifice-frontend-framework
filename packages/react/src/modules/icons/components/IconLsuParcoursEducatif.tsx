import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconLsuParcoursEducatif = ({
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
      d="M13.695 12.509V2.464c0-.46-.232-.88-.626-1.131a1.38 1.38 0 0 0-1.305-.1L5.46 3.989c-.484.21-.795.664-.814 1.183-.019.52.259.995.724 1.238l6.075 3.199v2.818c-5.37.107-9.705 4.426-9.705 9.728v1.32h20.539v-1.32c0-4.926-3.747-9.005-8.584-9.643zM8.014 5.29l3.431-1.5V7.1zM4.042 21.264c.443-3.667 3.578-6.526 7.403-6.622v2.14h2.25V14.75c3.3.567 5.884 3.217 6.281 6.515z"
    />
  </svg>
);
export default SvgIconLsuParcoursEducatif;
