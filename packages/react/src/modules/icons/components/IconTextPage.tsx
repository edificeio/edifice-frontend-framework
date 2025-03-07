import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconTextPage = ({
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
      d="M6.286 3c-.35 0-.68.135-.92.368-.238.231-.366.54-.366.854v15.556c0 .315.128.623.367.854.239.233.569.368.919.368h11.428c.35 0 .68-.135.92-.368.238-.231.366-.54.366-.854V8h-3a2 2 0 0 1-2-2V3zM16 6h1.986L16 4.08zm5 13.778V6.556a1 1 0 0 0-.305-.72L15.98 1.281A1 1 0 0 0 15.286 1h-9a3.32 3.32 0 0 0-2.314.934A3.2 3.2 0 0 0 3 4.222v15.556c0 .864.353 1.686.972 2.288S5.423 23 6.286 23h11.428c.863 0 1.695-.333 2.314-.934.619-.602.972-1.424.972-2.288M8 6a1 1 0 0 0 0 2h3a1 1 0 1 0 0-2zm-1 6a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1m5 4a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconTextPage;
