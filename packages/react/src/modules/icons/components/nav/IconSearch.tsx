import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconSearch = ({
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
      d="M1.27 11.552a7.75 7.75 0 0 1 0-4.156Q1.84 5.33 3.42 3.792a7.9 7.9 0 0 1 2.716-1.777q1.53-.6 3.161-.6 1.605 0 3.136.6 1.53.6 2.716 1.777a7.9 7.9 0 0 1 1.902 2.86 7.8 7.8 0 0 1 .518 3.29 7.65 7.65 0 0 1-.889 3.171q.692.192 1.21.697l4.297 4.156q.864.84.864 2.042t-.864 2.042-2.099.841-2.099-.84l-4.272-4.18a2.42 2.42 0 0 1-.74-1.178 8.3 8.3 0 0 1-3.68.84q-1.63 0-3.16-.6a8.1 8.1 0 0 1-2.717-1.753 7.85 7.85 0 0 1-2.149-3.628m2.495-2.066q0 2.235 1.605 3.796 1.63 1.56 3.926 1.561 2.272 0 3.877-1.561 1.605-1.562 1.63-3.796t-1.63-3.796q-1.63-1.585-3.877-1.585-2.272 0-3.926 1.585-1.605 1.561-1.605 3.796"
    />
  </svg>
);
export default SvgIconSearch;
