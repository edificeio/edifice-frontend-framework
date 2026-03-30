import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconBulleError = ({
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
    <g clipPath="url(#icon-bulle-error_svg__a)">
      <path
        fill="currentColor"
        d="M11.986.001c2.066-.024 4.114.459 6.024 1.42 1.699.828 3.2 2.162 4.368 3.88 1.04 1.507 1.614 3.412 1.622 5.383-.014 1.956-.587 3.846-1.622 5.34-1.166 1.722-2.668 3.056-4.368 3.88-1.91.963-3.959 1.444-6.024 1.413a14 14 0 0 1-2.995-.335c-1.44 1.225-3.045 2.134-4.741 2.683-.425.128-.916.24-1.465.335H2.72a.55.55 0 0 1-.367-.184.6.6 0 0 1-.129-.199.7.7 0 0 1-.047-.248.2.2 0 0 1 0-.111.4.4 0 0 1 0-.152.4.4 0 0 0 0-.112v-.112l.06-.112.116-.112.092-.111.066-.072.392-.527.464-.598a3.6 3.6 0 0 0 .366-.631q.188-.419.425-.8c.165-.278.279-.596.334-.933-1.304-.898-2.423-2.149-3.27-3.656-.858-1.49-1.285-3.286-1.214-5.104.07-1.82.636-3.557 1.606-4.94 1.166-1.707 2.66-3.034 4.35-3.864C7.873.459 9.92-.025 11.986 0m3.903 7.11a.55.55 0 0 0-.778 0L12 10.223 8.889 7.11a.55.55 0 1 0-.778.778L11.223 11 8.11 14.111a.55.55 0 1 0 .778.778l3.11-3.112 3.112 3.112a.55.55 0 1 0 .778-.778L12.777 11l3.112-3.111a.55.55 0 0 0 0-.778"
      />
    </g>
    <defs>
      <clipPath id="icon-bulle-error_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconBulleError;
