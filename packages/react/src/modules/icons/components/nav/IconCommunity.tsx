import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconCommunity = ({
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
      d="M19.935 17.51q1.088 0 1.868.792.78.794.78 1.898 0 1.106-.78 1.898-.78.793-1.844.793t-1.869-.793a2.52 2.52 0 0 1-.78-1.922q0-.432.19-.936l-3.997-2.931q-1.16 1.2-2.79 1.2-1.633 0-2.791-1.176-1.16-1.177-1.183-2.86 0-.215.071-.624l-3.168-1.057a1.25 1.25 0 0 1-.852.337q-.567 0-.946-.385a1.32 1.32 0 0 1-.378-.96q0-.578.378-.938.38-.36.946-.384.474 0 .804.312.33.313.45.745l3.192 1.08a3.8 3.8 0 0 1 1.443-1.56 3.84 3.84 0 0 1 2.033-.577q1.23 0 2.27.745l4.706-4.781q-.378-.72-.378-1.321 0-1.106.78-1.898.78-.793 1.869-.793t1.844.793q.758.792.78 1.898a2.42 2.42 0 0 1-.78 1.873q-.804.77-1.868.793-.616 0-1.3-.408l-4.707 4.805q.734 1.056.733 2.306 0 .888-.402 1.753l3.997 2.907q.78-.624 1.679-.624"
    />
  </svg>
);
export default SvgIconCommunity;
