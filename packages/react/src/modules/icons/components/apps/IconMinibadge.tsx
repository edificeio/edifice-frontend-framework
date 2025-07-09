import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconMinibadge = ({
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
      d="M25.098 3c-1.127 0-3.226 1.277-3.226 1.277L8.636 12.404s-1.45.885-1.86 1.617c-.408.731-.243 2.233-.243 2.233v17.153s-.066 1.81.407 2.655c.472.846 2.001 1.804 2.001 1.804l13.114 8.05S23.736 47 24.855 47c1.117 0 2.92-.958 2.92-.958l13.198-8.102s1.348-.766 1.877-1.716c.53-.95.65-3.39.65-3.39V16.499s-.05-1.382-.57-2.314-2.495-2.372-2.495-2.372L27.643 3.958S26.225 3 25.099 3zm-3.2 7.76 2.08 7.051 7.017 2.09-7.016 2.09-2.08 7.05-2.08-7.05-7.016-2.09 7.016-2.09zm5.198 14.365 5.198 2.872 5.198-2.872-2.858 5.224 2.858 5.223-5.198-2.873-5.198 2.873 2.86-5.223zm-11.694 5.222 3.899 2.22 3.896-2.22-2.208 3.918 2.208 3.917-3.896-2.22-3.899 2.22 2.209-3.917z"
    />
  </svg>
);
export default SvgIconMinibadge;
