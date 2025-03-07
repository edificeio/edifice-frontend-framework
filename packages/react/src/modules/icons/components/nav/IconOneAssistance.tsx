import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconOneAssistance = ({
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
      d="M11.685 2C8.66 2 6.7 3.277 5.164 5.556A.96.96 0 0 0 5.36 6.84l1.634 1.278a.89.89 0 0 0 1.26-.162c.95-1.226 1.653-1.932 3.136-1.932 1.165 0 2.607.773 2.607 1.939 0 .88-.705 1.333-1.856 1.998-1.342.776-3.118 1.742-3.118 4.157v.382c0 .518.407.938.909.938h2.746c.502 0 .91-.42.91-.938v-.226c0-1.674 4.745-1.743 4.745-6.274 0-3.412-3.432-6-6.648-6m-.38 14.588c-1.447 0-2.625 1.214-2.625 2.706S9.858 22 11.305 22s2.624-1.214 2.624-2.706-1.177-2.706-2.624-2.706"
    />
  </svg>
);
export default SvgIconOneAssistance;
