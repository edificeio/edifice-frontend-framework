import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconAssistancetic = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 60 60"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="#ECBE30"
      d="M0 8a8 8 0 0 1 8-8h44a8 8 0 0 1 8 8v44a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"
    />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M30 22.667c1.013 0 1.833.82 1.833 1.833v9.167a1.833 1.833 0 0 1-3.666 0V24.5c0-1.012.82-1.833 1.833-1.833M28.167 40.083c0-1.012.82-1.833 1.833-1.833h.018a1.833 1.833 0 0 1 0 3.667H30a1.833 1.833 0 0 1-1.833-1.834"
      clipRule="evenodd"
    />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M26.787 11.87c1.393-2.532 5.033-2.532 6.426 0L50.279 42.9c1.344 2.443-.424 5.433-3.213 5.433H12.934c-2.789 0-4.557-2.99-3.213-5.433zm20.28 32.796L30 13.638l-17.066 31.03z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconAssistancetic;
