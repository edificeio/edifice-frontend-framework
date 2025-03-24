import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconNabook = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 500 500"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <rect width={500} height={500} fill="#120D37" rx={30} />
    <path
      fill="#066"
      d="m363.4 100.712 18.319 264.583-100.438 21.778-71.561-134.076 9.084 144.502-87.235 10.711-26.773-275.746 96.357-16.554 84.212 131.341-13.084-132.203z"
    />
    <path
      fill="#0FC"
      d="m362.279 87.72 18.318 264.583-100.438 21.777-71.561-134.075 9.084 144.501-87.235 10.711-26.773-275.745 96.357-16.554 84.212 131.341-13.084-132.203z"
    />
  </svg>
);
export default SvgIconNabook;
