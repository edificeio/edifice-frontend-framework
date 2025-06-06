import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconBlog = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 29 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M6.04 10.87c.21 0 .38-.21.38-.43s-.17-.39-.38-.39h-2.4c-.23 0-.44.17-.44.39s.22.43.43.43h2.4zm0 1.73c.21 0 .38-.21.38-.4s-.17-.41-.38-.41h-2.4c-.23 0-.44.19-.44.4s.22.41.43.41h2.4zm5.05.34a9.36 9.36 0 0 1 6.97 2.91V6.81a9.17 9.17 0 0 1-6.97 3.03zm11.95-5.29-.8-.82 3.3-3.27.82.77zm.6 4.2V10.7h5.53v1.16h-5.53zm-1.4 4.12.8-.82 3.32 3.32-.82.77zm-3.07-12.4c.48 0 .86.35.86.8v13.88c0 .46-.38.82-.87.82s-.84-.36-.84-.82c-1.42-1.73-3.9-3.96-7.62-3.96H9.16l3.37 5.67-2.04 1.5c-.51.26-1.06-.08-1.35-.44l-4.19-6.73H2.7S.6 13.16.6 11.35s2.1-2.83 2.1-2.83h8c3.73 0 6.2-2.31 7.62-4.14 0-.46.37-.82.85-.82z"
    />
  </svg>
);
export default SvgIconBlog;
