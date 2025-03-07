import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconSquareRoot = ({
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
      fillRule="evenodd"
      d="M10.375 2a1 1 0 0 0-.983.816L6.678 17.293 4.56 11.649A1 1 0 0 0 3.625 11H2.5a1 1 0 1 0 0 2h.432l3.132 8.351a1 1 0 0 0 1.919-.167L11.205 4h10.42a1 1 0 1 0 0-2zm9.496 12.043c-.58.58-1.132 1.309-1.62 2.015.199.521.358.977.494 1.365l.005.014c.176.506.299.857.416 1.122.057.129.103.214.14.27l.032.045.037.001H20.5a1 1 0 1 1 0 2h-1.125c-.468 0-.924-.125-1.315-.457-.35-.297-.564-.692-.722-1.048-.152-.342-.298-.763-.456-1.215l-.026-.074-.012-.035c-.327.417-.68.829-1.051 1.2-.81.81-1.903 1.629-3.168 1.629a1 1 0 1 1 0-2c.422 0 1.017-.306 1.754-1.043.583-.583 1.137-1.315 1.627-2.025a51 51 0 0 1-.484-1.326l-.012-.032c-.178-.505-.302-.857-.421-1.124a2 2 0 0 0-.143-.276l-.034-.048-.037-.001H13.75a1 1 0 1 1 0-2h1.125c.47 0 .925.125 1.317.459.35.298.564.694.724 1.052.152.343.301.764.462 1.22l.03.085.002.007c.326-.415.677-.824 1.047-1.194.81-.81 1.903-1.629 3.168-1.629a1 1 0 1 1 0 2c-.422 0-1.017.306-1.754 1.043"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconSquareRoot;
