import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconImageSizeLarge = ({
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
      d="M1.667.5C.747.5 0 1.246 0 2.167v11.579c0 .92.746 1.666 1.667 1.666h16.666c.92 0 1.667-.746 1.667-1.666V2.167C20 1.247 19.254.5 18.333.5zm16.666 8.586v-6.92H1.667v11.58H5.05l7.736-8.423a.833.833 0 0 1 1.162-.064zm-11.02 4.66h11.02v-2.448l-4.868-4.25z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconImageSizeLarge;
