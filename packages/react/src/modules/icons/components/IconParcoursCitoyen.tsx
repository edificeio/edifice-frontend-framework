import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconParcoursCitoyen = ({
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
      d="M10.681 20.838a6.15 6.15 0 0 1 6.149-6.148q.058 0 .114.007a6.15 6.15 0 0 1 6.035 6.145v.248a2.473 2.473 0 0 1-2.47 2.47H11.68a1 1 0 0 1-1-1zm2 .722h7.827c.258 0 .47-.212.471-.47v-.248a4.15 4.15 0 0 0-4.15-4.148l-.051-.003a4.15 4.15 0 0 0-4.097 4.147zM18.81 9.627a2.124 2.124 0 1 0-4.247-.001 2.124 2.124 0 0 0 4.248 0m2 0a4.123 4.123 0 1 1-8.245 0 4.123 4.123 0 0 1 8.246 0"
    />
    <path
      fill="#383838"
      d="M2.127 21.132a5.276 5.276 0 0 1 7.034-4.975 1 1 0 0 1-.666 1.886 3.276 3.276 0 0 0-4.367 3.089c0 .235.193.428.428.428h7.125a1 1 0 0 1 0 2H4.556a2.43 2.43 0 0 1-2.429-2.428M8.62 11.445a1.408 1.408 0 1 0-2.817.001 1.408 1.408 0 0 0 2.816-.001m2 0a3.409 3.409 0 1 1-6.818-.001 3.409 3.409 0 0 1 6.817 0M12.53 17.006V5.831a1 1 0 1 1 2 0v11.175l-.005.103a1 1 0 0 1-1.99 0z"
    />
    <path
      fill="#383838"
      d="M13.533.2a1 1 0 0 1 1 1v4.294a1 1 0 0 1-1 1H7.121a1 1 0 0 1-1-1V3.21C6.121 1.53 7.501.2 9.17.2zM8.121 4.494h4.412V2.2H9.17c-.597 0-1.048.469-1.048 1.01z"
    />
  </svg>
);
export default SvgIconParcoursCitoyen;
