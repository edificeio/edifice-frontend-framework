import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconParcoursSecours = ({
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
      fill="#383838"
      d="M21.132 7.766a.616.616 0 0 0-.616-.616H3.859a.616.616 0 0 0-.616.616v13.237c0 .34.275.617.616.617h16.657c.34 0 .616-.276.616-.617zm2 13.237a2.616 2.616 0 0 1-2.616 2.617H3.859a2.616 2.616 0 0 1-2.616-2.617V7.766A2.616 2.616 0 0 1 3.859 5.15h16.657a2.616 2.616 0 0 1 2.616 2.616z"
    />
    <path
      fill="#383838"
      d="M12.746.548c2.883.047 5.465 1.936 6.39 4.716a1 1 0 0 1-1.897.632c-.659-1.98-2.497-3.314-4.526-3.348h-.197c-2.021.05-3.827 1.387-4.48 3.348a1 1 0 0 1-1.898-.632C7.053 2.514 9.591.62 12.466.549zM11.184 18.026V10.74a1 1 0 1 1 2 0v7.286a1 1 0 1 1-2 0"
    />
    <path
      fill="#383838"
      d="m15.829 13.381.102.005a1 1 0 0 1 0 1.99l-.102.005H8.542a1 1 0 1 1 0-2z"
    />
  </svg>
);
export default SvgIconParcoursSecours;
