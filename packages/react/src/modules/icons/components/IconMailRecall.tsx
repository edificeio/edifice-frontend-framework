import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconMailRecall = ({
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
    <g clipPath="url(#icon-mail-recall_svg__a)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.253 6.532A1.34 1.34 0 0 1 3.333 6H6.5a1 1 0 0 0 0-2H3.333C1.512 4 0 5.452 0 7.286v11.428C0 20.548 1.512 22 3.333 22h16.334C21.488 22 23 20.548 23 18.714a1 1 0 1 0-2 0c0 .691-.577 1.286-1.333 1.286H3.333C2.577 20 2 19.405 2 18.714V8.666l8.442 5.066a3 3 0 0 0 3.118-.02l1.965-1.21a1 1 0 1 0-1.05-1.703l-1.964 1.211a1 1 0 0 1-1.04.007L2.515 6.643a1 1 0 0 0-.262-.11M15.8 8.6a1 1 0 0 0-.2-1.4L14 6h4a4 4 0 0 1 4 4v.2a3.8 3.8 0 0 1-3.8 3.8 1 1 0 1 0 0 2 5.8 5.8 0 0 0 5.8-5.8V10a6 6 0 0 0-6-6h-4l1.6-1.2a1 1 0 1 0-1.2-1.6l-3.99 2.993a1 1 0 0 0 0 1.614L14.4 8.8a1 1 0 0 0 1.4-.2"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="icon-mail-recall_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconMailRecall;
