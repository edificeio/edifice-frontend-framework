import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconBulle = ({
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
    <g clipPath="url(#icon-bulle_svg__a)">
      <path fill="#fff" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M24 10.683c-.013 1.957-.587 3.847-1.622 5.341-1.165 1.722-2.668 3.056-4.368 3.88-1.91.963-3.958 1.444-6.023 1.413a14 14 0 0 1-2.996-.335c-1.44 1.225-3.044 2.133-4.74 2.683q-.64.192-1.466.335H2.72a.55.55 0 0 1-.366-.184.6.6 0 0 1-.13-.2.7.7 0 0 1-.047-.247.2.2 0 0 1 0-.111.4.4 0 0 1 0-.152.4.4 0 0 0 0-.112v-.112l.059-.112.118-.111.091-.112.066-.072.392-.527.464-.599q.212-.29.366-.63a7 7 0 0 1 .426-.799c.164-.278.278-.597.333-.934-1.304-.898-2.423-2.149-3.27-3.656-.858-1.49-1.285-3.285-1.214-5.104s.636-3.557 1.607-4.94C2.78 3.58 4.275 2.252 5.964 1.422 7.872.46 9.92-.025 11.987.001c2.065-.024 4.113.46 6.023 1.421 1.699.827 3.2 2.161 4.368 3.88 1.04 1.507 1.614 3.411 1.622 5.381"
      />
    </g>
    <defs>
      <clipPath id="icon-bulle_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconBulle;
