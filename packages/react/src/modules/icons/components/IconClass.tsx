import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconClass = ({
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
      fillRule="evenodd"
      d="M2.074 17.258c.707-.837 1.705-1.349 2.79-1.349h5.727c1.085 0 2.083.512 2.79 1.35.701.831 1.073 1.928 1.073 3.044V22a1 1 0 1 1-2 0v-1.697c0-.684-.23-1.314-.603-1.755-.367-.436-.826-.639-1.26-.639H4.864c-.434 0-.893.203-1.261.64-.372.44-.603 1.07-.603 1.754V22a1 1 0 1 1-2 0v-1.697c0-1.116.372-2.213 1.074-3.045M7.728 8.5a2.182 2.182 0 1 0 0 4.364 2.182 2.182 0 0 0 0-4.364m-4.182 2.182a4.182 4.182 0 1 1 8.364 0 4.182 4.182 0 0 1-8.364 0"
      clipRule="evenodd"
    />
    <path
      fill="#383838"
      fillRule="evenodd"
      d="M0 5a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-5a1 1 0 1 1 0-2h5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v10a1 1 0 1 1-2 0z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconClass;
