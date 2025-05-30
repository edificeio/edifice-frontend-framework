import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconImageSizeMedium = ({
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
      d="M1.667.5C.747.5 0 1.246 0 2.167v.294a.833.833 0 1 0 1.667 0v-.294H3.75A.833.833 0 0 0 3.75.5zM7.5.5a.833.833 0 1 0 0 1.667h4.583a.833.833 0 1 0 0-1.667zm8.75 0a.833.833 0 0 0 0 1.667h2.083v1.911a.833.833 0 0 0 1.667 0V2.167C20 1.247 19.254.5 18.333.5zM20 6.824a.833.833 0 1 0-1.667 0v2.352a.833.833 0 0 0 1.667 0zm0 5.098a.833.833 0 1 0-1.667 0v1.911h-1.25a.833.833 0 0 0 0 1.667h1.25c.92 0 1.667-.746 1.667-1.667zM0 5.867C0 4.947.746 4.2 1.667 4.2h11.666c.92 0 1.667.746 1.667 1.667v7.966c0 .92-.746 1.667-1.667 1.667H1.667C.747 15.5 0 14.754 0 13.833zm13.333 0v4.304l-2.812-2.454a.833.833 0 0 0-1.162.064l-5.558 6.052H1.667V5.867zm0 7.966h-7.27l3.974-4.326 3.296 2.877z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconImageSizeMedium;
