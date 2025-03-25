import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconInfoRectangle = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 20 16"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M2.87 2.167c-.718 0-1.203.531-1.203 1.071v9.524c0 .54.485 1.071 1.203 1.071h14.26c.718 0 1.203-.531 1.203-1.071V3.238c0-.54-.485-1.071-1.203-1.071zM0 3.238C0 1.674 1.339.5 2.87.5h14.26C18.66.5 20 1.674 20 3.238v9.524c0 1.564-1.339 2.738-2.87 2.738H2.87C1.34 15.5 0 14.326 0 12.762z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M10.008 12.167a.833.833 0 0 1-.833-.834V7.167a.833.833 0 1 1 1.667 0v4.166c0 .46-.373.834-.834.834M10.842 4.25c0 .46-.373.833-.834.833H10a.833.833 0 1 1 0-1.666h.008c.46 0 .834.373.834.833"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconInfoRectangle;
