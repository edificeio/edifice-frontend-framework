import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconFolderMove = ({
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
    <g
      fill="currentColor"
      fillRule="evenodd"
      clipPath="url(#icon-folder-move_svg__a)"
      clipRule="evenodd"
    >
      <path d="M12.965 7a2 2 0 0 1-1.98-1.717A1.5 1.5 0 0 0 9.5 4H2v15h20V7zM0 3.902C0 2.852.852 2 1.902 2H9.5a3.5 3.5 0 0 1 3.465 3H22a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z" />
      <path d="M6.5 13a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2h-9a1 1 0 0 1-1-1" />
      <path d="M12.293 8.793a1 1 0 0 1 1.414 0l3.5 3.5a1 1 0 0 1 0 1.414l-3.5 3.5a1 1 0 0 1-1.414-1.414L15.086 13l-2.793-2.793a1 1 0 0 1 0-1.414" />
    </g>
    <defs>
      <clipPath id="icon-folder-move_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconFolderMove;
