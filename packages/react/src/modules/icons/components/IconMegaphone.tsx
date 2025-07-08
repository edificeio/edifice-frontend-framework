import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconMegaphone = ({
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
      fillRule="evenodd"
      d="M13.962 3.067c1.333-.809 3.038.15 3.038 1.71v13.446c0 1.56-1.705 2.519-3.038 1.71l-3.794-2.304a3.67 3.67 0 0 1-7.26-1.084A3 3 0 0 1 1 13.75v-4.5a3 3 0 0 1 3-3h4.44a1 1 0 0 0 .52-.145zM4.9 16.75h3.29a1.67 1.67 0 1 1-3.29 0M15 4.777 9.997 7.814a3 3 0 0 1-1.557.436H4a1 1 0 0 0-1 1v4.5a1 1 0 0 0 1 1h4.44a3 3 0 0 1 1.557.436L15 18.223zm6.055 3.055a1 1 0 0 0-1.11-1.664l-1.5 1a1 1 0 0 0 1.11 1.664zm-2.887 7.613a1 1 0 0 1 1.387-.277l1.5 1a1 1 0 1 1-1.11 1.664l-1.5-1a1 1 0 0 1-.277-1.387M19.5 11a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconMegaphone;
