import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconCollect = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 20 20"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M14.988 1.667c.852 0 1.619.519 1.935 1.31l1.352 3.38q.008.02.013.04.006.015.01.03l.012.043.015.08.005.039.003.06.001.018v9.382a2.26 2.26 0 0 1-.693 1.625c-.44.425-1.03.659-1.64.659h-12c-.61 0-1.2-.234-1.64-.66a2.26 2.26 0 0 1-.693-1.624v-9.4l.003-.06.005-.04.015-.08.008-.03.006-.02a1 1 0 0 1 .028-.077L3.08 2.977a2.08 2.08 0 0 1 1.934-1.31zM3.334 16.049c0 .154.063.31.186.428.123.119.296.19.481.19h12a.7.7 0 0 0 .481-.19.6.6 0 0 0 .186-.428V7.5H3.334zm8.334-6.882a.833.833 0 0 1 0 1.666H8.334a.833.833 0 0 1 0-1.666zM5.014 3.333a.42.42 0 0 0-.386.263l-.896 2.237h12.539l-.896-2.237a.42.42 0 0 0-.387-.263z"
    />
  </svg>
);
export default SvgIconCollect;
