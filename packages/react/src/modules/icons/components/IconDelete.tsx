import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconDelete = ({
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
      d="M9.461 3.689a.96.96 0 0 1 .675-.28h3.819a.955.955 0 0 1 .954.955v.954H9.182v-.954c0-.254.1-.496.28-.675m7.357.675v.954h3.818a.955.955 0 0 1 0 1.91h-.954v12.408a2.864 2.864 0 0 1-2.864 2.864H7.273a2.864 2.864 0 0 1-2.864-2.864V7.227h-.954a.955.955 0 1 1 0-1.909h3.818v-.954A2.864 2.864 0 0 1 10.136 1.5h3.819a2.864 2.864 0 0 1 2.863 2.864m-10.5 2.863v12.41a.954.954 0 0 0 .955.954h9.545a.955.955 0 0 0 .955-.955V7.227zm3.818 2.864c.528 0 .955.427.955.955v5.727a.955.955 0 1 1-1.91 0v-5.727c0-.528.428-.955.955-.955m4.773 6.682v-5.727a.955.955 0 0 0-1.909 0v5.727a.955.955 0 1 0 1.91 0"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconDelete;
