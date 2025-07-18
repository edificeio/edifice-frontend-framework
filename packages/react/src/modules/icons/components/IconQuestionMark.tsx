import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconQuestionMark = ({
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
      d="M9.579 5.429C9.172 5.964 9 6.706 9 7.44a1 1 0 0 1-2 0c0-.99.223-2.217.987-3.222.8-1.051 2.086-1.718 3.905-1.718 2.032 0 3.284 1.043 3.892 2.323.563 1.184.578 2.568.265 3.445-.409 1.148-1.191 2.056-1.81 2.773l-.27.317c-.7.83-1.077 1.427-1.077 2.157v1.806a1 1 0 1 1-2 0v-1.806c0-1.513.835-2.6 1.546-3.445q.16-.189.312-.366c.629-.737 1.141-1.337 1.415-2.107.128-.359.157-1.192-.187-1.915-.298-.627-.874-1.182-2.086-1.182-1.283 0-1.943.442-2.313.929"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      d="M13.762 19.888a1.612 1.612 0 1 1-3.223 0 1.612 1.612 0 0 1 3.223 0"
    />
  </svg>
);
export default SvgIconQuestionMark;
