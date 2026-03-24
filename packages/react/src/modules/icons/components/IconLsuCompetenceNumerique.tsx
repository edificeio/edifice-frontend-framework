import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconLsuCompetenceNumerique = ({
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
    <path
      fill="currentColor"
      d="M23.595 11.842a1.24 1.24 0 0 0-.765-.947l-3.45-1.382V4.597c0-1.282-1.061-2.321-2.363-2.321H2.753C1.448 2.276.39 3.319.39 4.597v8.884c0 1.283 1.061 2.322 2.363 2.322H8.52v4.082H3.799v2.211h11.269v-2.21H10.77v-4.083h3.769l.405 1.706c.101.424.412.755.832.892q.198.061.394.062c.292 0 .581-.103.81-.295l.154-.129 1.912-3.35 3.99-1.598.139-.114c.337-.28.495-.704.424-1.135zM2.753 13.588a.11.11 0 0 1-.113-.11V4.594c0-.063.053-.11.113-.11h14.26c.064 0 .113.05.113.11V8.61l-2.501-1.002a1.27 1.27 0 0 0-1.286.202c-.36.299-.514.767-.409 1.22l1.08 4.562H2.753zm16.627-1.422-1.912.766-.92 1.607-.224-.95-.765-3.221 1.571.63 2.25.902.334.133z"
    />
  </svg>
);
export default SvgIconLsuCompetenceNumerique;
