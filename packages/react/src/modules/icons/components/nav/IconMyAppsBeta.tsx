import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconMyAppsBeta = ({
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
    <g fill="currentColor">
      <path d="M23 1v10.182H12.818V1zm-8.182 8.182H21V3h-6.182zM23 12.818V23H12.818V12.818zM14.818 21H21v-6.182h-6.182zM11.182 12.818V23H1V12.818zM3 21h6.182v-6.182H3zM2.049 1l.141.003q.181.005.492.03c.41.034.98.108 1.63.26 1.287.301 2.963.931 4.304 2.272 1.341 1.342 1.972 3.018 2.274 4.304.152.65.224 1.22.26 1.631a9 9 0 0 1 .032.633v.061l-.013.988H1V1.014L1.986 1 2 2l-.014-1zM3 9.182h6.1a10 10 0 0 0-.158-.857c-.255-1.088-.76-2.366-1.74-3.346C6.223 4 4.945 3.495 3.856 3.24A10 10 0 0 0 3 3.081z" />
    </g>
  </svg>
);
export default SvgIconMyAppsBeta;
