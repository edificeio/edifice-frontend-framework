import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconTextUnderline = ({
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
    <rect width={14} height={2} x={5} y={20.5} fill="currentColor" rx={1} />
    <path
      fill="currentColor"
      d="M12.056 18q-2.077 0-3.684-.786-1.585-.787-2.479-2.18Q5 13.618 5 11.821V3.966q0-.427.268-.696Q5.537 3 5.96 3q.425 0 .692.27.268.27.268.696v7.855q0 1.28.648 2.27.647.988 1.808 1.55 1.185.562 2.68.562 1.473 0 2.59-.562 1.139-.563 1.786-1.55.648-.99.648-2.27V3.966q0-.427.268-.696A.98.98 0 0 1 18.04 3q.447 0 .692.27.268.27.268.696v7.855q0 1.798-.893 3.213-.893 1.393-2.456 2.18-1.563.786-3.595.786"
    />
  </svg>
);
export default SvgIconTextUnderline;
