import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconFolderAdd = ({
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
    <g clipPath="url(#icon-folder-add_svg__a)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M10.985 5.283A2 2 0 0 0 12.965 7H22v12H2V4h7.5a1.5 1.5 0 0 1 1.485 1.283M1.902 2C.852 2 0 2.852 0 3.902V19a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-9.035A3.5 3.5 0 0 0 9.5 2zM12 8a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H8a1 1 0 1 1 0-2h3V9a1 1 0 0 1 1-1"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="icon-folder-add_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconFolderAdd;
