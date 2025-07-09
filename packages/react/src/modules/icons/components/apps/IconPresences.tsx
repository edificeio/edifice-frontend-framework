import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconPresences = ({
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
      d="M38.974 5.007c1.987.131 3.496 1.895 3.496 3.93v1.987c.128 7.763-1.295 13.937-4.23 18.335-1.472 2.157-2.026 4.785-1.856 7.42.044.3.044.603.044.949v6.516A1.84 1.84 0 0 1 34.572 46H8.855A1.86 1.86 0 0 1 7 44.144v-6.516c0-4.762 2.483-7.772 5.702-9.569a1.45 1.45 0 0 1 1.548.083c2.089 1.486 4.786 2.358 7.42 2.358s5.094-.779 7.12-2.157c.477-.34.907-.686 1.34-1.033 3.368-2.804 5.093-8.497 4.962-16.395V8.674c0-2.074 1.77-3.799 3.882-3.667m-23.546 6.437A8.892 8.892 0 1 1 28.002 24.02a8.892 8.892 0 0 1-12.574-12.575"
    />
  </svg>
);
export default SvgIconPresences;
