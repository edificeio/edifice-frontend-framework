import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconExercizer = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 31 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="m8.59 22.44 5.14-2.58v-4.23L8.6 17.84v4.6zm-.87-6.1 5.43-2.32-5.43-2.33-5.41 2.33zm14.62 6.1 5.15-2.58v-4.23l-5.15 2.21zm-.87-6.1 5.42-2.32-5.41-2.33-5.44 2.33zm-6-3.93 5.14-2.21V6.62l-5.15 2.2v3.6zm-.87-5.1 5.9-2.51-5.9-2.56-5.92 2.55zm14.6 6.95v5.6q0 .49-.25.9t-.7.62l-6 3q-.34.2-.78.2t-.77-.2l-6-3q-.08-.02-.1-.05-.03.03-.1.05l-6.01 3q-.34.2-.77.2t-.75-.2l-6-3q-.47-.22-.7-.62t-.27-.9v-5.6q0-.5.29-.93t.77-.63l5.82-2.5V4.84q0-.53.29-.97t.74-.62L13.92.68q.32-.15.68-.15t.67.15l6.01 2.57q.48.22.77.62t.29.96v5.37l5.82 2.5q.48.2.77.63t.26.93z" />
  </svg>
);
export default SvgIconExercizer;
