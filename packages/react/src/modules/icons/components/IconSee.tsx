import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconSee = ({
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
      d="M2.14 12a18.68 18.68 0 0 0 2.464 3.316C6.397 17.226 8.9 19 12 19s5.605-1.774 7.395-3.684A18.7 18.7 0 0 0 21.86 12a18.681 18.681 0 0 0-2.464-3.316C17.606 6.774 15.101 5 12 5S6.396 6.774 4.605 8.684A18.7 18.7 0 0 0 2.14 12M23 12l.894-.448-.002-.003-.003-.007-.011-.022a11 11 0 0 0-.192-.354 20.675 20.675 0 0 0-2.831-3.85C18.895 5.226 15.899 3 12 3S5.104 5.226 3.145 7.316a20.7 20.7 0 0 0-2.831 3.85 12 12 0 0 0-.192.354l-.011.022-.003.007-.002.002s0 .002.894.449l-.894-.447a1 1 0 0 0 0 .894L1 12l-.894.447.002.004.003.007.011.022a8 8 0 0 0 .192.354 20.67 20.67 0 0 0 2.831 3.85C5.105 18.774 8.1 21 12 21s6.895-2.226 8.855-4.316a20.7 20.7 0 0 0 2.831-3.85 12 12 0 0 0 .192-.354l.011-.022.003-.007.002-.002s0-.002-.894-.449m0 0 .894.447c.141-.281.14-.613 0-.895z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconSee;
