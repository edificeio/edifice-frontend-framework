import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconUnreadMail = ({
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
    <g
      fill="currentColor"
      fillRule="evenodd"
      clipPath="url(#icon-unread-mail_svg__a)"
      clipRule="evenodd"
    >
      <path d="M7.975 4.5a5.1 5.1 0 0 0-.204-2h12.785A3.437 3.437 0 0 1 24 5.948V18.07c0 1.9-1.548 3.429-3.444 3.429H3.444A3.437 3.437 0 0 1 0 18.071V8.001c.581.436 1.261.749 2 .899v9.171c0 .783.64 1.429 1.444 1.429h17.112c.803 0 1.444-.646 1.444-1.429V7.79l-9.448 6.257a1 1 0 0 1-1.104 0L3.744 8.945a5 5 0 0 0 2.228-.924L12 12.014l9.916-6.567c-.2-.55-.73-.947-1.36-.947z" />
      <path d="M3 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
    </g>
    <defs>
      <clipPath id="icon-unread-mail_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconUnreadMail;
