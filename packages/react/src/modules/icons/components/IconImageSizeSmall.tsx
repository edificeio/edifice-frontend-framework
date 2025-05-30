import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconImageSizeSmall = ({
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
      d="M1.667.5C.747.5 0 1.246 0 2.167v1.911a.833.833 0 1 0 1.667 0V2.167H3.75A.833.833 0 0 0 3.75.5zM7.5.5a.833.833 0 1 0 0 1.667h4.583a.833.833 0 1 0 0-1.667zm8.75 0a.833.833 0 0 0 0 1.667h2.083v1.911a.833.833 0 0 0 1.667 0V2.167C20 1.247 19.254.5 18.333.5zM20 6.824a.833.833 0 1 0-1.667 0v2.352a.833.833 0 0 0 1.667 0zm0 5.098a.833.833 0 1 0-1.667 0v1.911H16.25a.833.833 0 0 0 0 1.667h2.083c.92 0 1.667-.746 1.667-1.667zM0 8c0-.92.746-1.667 1.667-1.667h8.714c.92 0 1.666.747 1.666 1.667v5.833c0 .92-.746 1.667-1.666 1.667H1.667C.747 15.5 0 14.754 0 13.833zm10.38 5.833H5.326l2.688-2.926 2.368 2.066zm0-5.833v2.76L8.498 9.118a.833.833 0 0 0-1.162.064l-4.273 4.652H1.667V8z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconImageSizeSmall;
