import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconCommunities = ({
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
      d="M25.807 33.165c4.726.17 8 3.997 8 8.5 0 .984-.795 1.775-1.775 1.775H18.977a1.774 1.774 0 0 1-1.776-1.775v-.201h-.004a8.303 8.303 0 0 1 8.61-8.299M8.61 24.451c4.726.17 8.001 3.997 8.001 8.5 0 .984-.796 1.776-1.775 1.776H1.776A1.774 1.774 0 0 1 0 32.95v-.201a8.303 8.303 0 0 1 8.61-8.299M41.61 24.006c4.499.162 8.001 3.996 8.001 8.5 0 .984-.796 1.775-1.775 1.775H34.779a1.774 1.774 0 0 1-1.775-1.775v-.201H33a8.303 8.303 0 0 1 8.61-8.3M25.142 20a5.143 5.143 0 1 1 0 10.285 5.143 5.143 0 0 1 0-10.285M8.308 11.627a5.141 5.141 0 1 1 0 10.282 5.141 5.141 0 0 1 0-10.282M41.691 11.627a5.142 5.142 0 1 1 .001 10.284 5.142 5.142 0 0 1 0-10.284M24.997 5.557a5.143 5.143 0 1 1 0 10.285 5.143 5.143 0 0 1 0-10.285"
    />
  </svg>
);
export default SvgIconCommunities;
