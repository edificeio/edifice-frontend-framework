import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconRack = ({
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
      d="M31.74 27.71h8.33a.8.8 0 0 0 0-.24.36.36 0 0 0-.1-.19l-5.58-13.1H15.66l-5.58 13.1a.36.36 0 0 0-.1.19.8.8 0 0 0-.05.24h8.33l2.51 5.06h8.46zm13.53.75v12.73a1.63 1.63 0 0 1-.47 1.18 1.82 1.82 0 0 1-1.23.52H6.43a1.53 1.53 0 0 1-1.18-.52 1.9 1.9 0 0 1-.52-1.18V28.46a8.4 8.4 0 0 1 .66-3.21l6.29-14.57a2.34 2.34 0 0 1 1-1.14A2.17 2.17 0 0 1 14 9.11h22a2.7 2.7 0 0 1 1.37.43c.466.24.823.647 1 1.14l6.29 14.57a8.4 8.4 0 0 1 .66 3.21z"
    />
  </svg>
);
export default SvgIconRack;
