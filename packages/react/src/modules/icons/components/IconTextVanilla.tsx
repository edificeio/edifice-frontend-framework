import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconTextVanilla = ({
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
      d="m9.976 13.304-1.47 6.244a1 1 0 0 0 1.947.458l1.186-5.039zM12.716 10.388 13.984 5H19.9a1 1 0 1 0 0-2h-14a1 1 0 0 0-.46.112L7.328 5h4.601l-.876 3.725z"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M1.793 2.293a1 1 0 0 1 1.414 0l18 18a1 1 0 0 1-1.414 1.414l-18-18a1 1 0 0 1 0-1.414"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconTextVanilla;
