import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconOneMessaging = ({
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
      d="M5.051 12.366a456 456 0 0 1-2.746-1.822A6.5 6.5 0 0 1 .74 9.067q-.737-.94-.737-1.745a2.7 2.7 0 0 1 .141-.905c.098-.286.242-.542.424-.752Q1.12 5 2.15 5h19.7c.541-.016 1.071.195 1.507.6q.636.6.636 1.446 0 1.01-.657 1.93a6.2 6.2 0 0 1-1.632 1.567q-5.037 3.338-6.267 4.156l-.242.167-.323.222q-.436.303-.724.487-.288.183-.696.415a4 4 0 0 1-.77.345 2.2 2.2 0 0 1-.67.115h-.026a2.2 2.2 0 0 1-.67-.116 4 4 0 0 1-.77-.344q-.41-.23-.697-.415a30 30 0 0 1-.723-.487q-.433-.3-.565-.389-1.215-.817-3.51-2.334m10.943 3.962q2.276-1.578 6.667-4.416c.478-.306.927-.68 1.339-1.113v10.16q0 .845-.63 1.446c-.437.405-.97.614-1.512.594H2.149c-.545.02-1.08-.192-1.52-.601C.21 21.996 0 21.52 0 20.95V10.8c.416.437.871.81 1.356 1.113q4.848 3.148 6.656 4.416.768.537 1.243.837a7.7 7.7 0 0 0 1.265.614c.475.198.97.303 1.47.313h.026c.5-.01.995-.115 1.47-.313a7.7 7.7 0 0 0 1.265-.614q.48-.3 1.243-.837"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconOneMessaging;
