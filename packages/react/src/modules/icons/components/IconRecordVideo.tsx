import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconRecordVideo = ({
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
      d="M2 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-1.936l4.409 1.365A2 2 0 0 0 24 15.519V8.48a2 2 0 0 0-2.591-1.91l-4.41 1.364V6a2 2 0 0 0-2-2zm0 2h13v12H2zm15 7.97V10.03l5-1.548v7.037z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconRecordVideo;
