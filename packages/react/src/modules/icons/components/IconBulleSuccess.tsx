import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconBulleSuccess = ({
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
    <g clipPath="url(#icon-bulle-success_svg__a)">
      <path
        fill="currentColor"
        d="M11.986.001c2.066-.024 4.114.46 6.024 1.422 1.699.827 3.2 2.16 4.368 3.88 1.04 1.506 1.614 3.41 1.622 5.38-.013 1.957-.587 3.847-1.622 5.341-1.166 1.722-2.668 3.056-4.368 3.88-1.91.963-3.959 1.444-6.024 1.413a14 14 0 0 1-2.995-.335c-1.44 1.225-3.045 2.134-4.741 2.683-.425.128-.916.24-1.465.335H2.72a.55.55 0 0 1-.367-.184.6.6 0 0 1-.129-.199.7.7 0 0 1-.047-.248.2.2 0 0 1 0-.111.4.4 0 0 1 0-.152.4.4 0 0 0 0-.112v-.111l.06-.113.116-.11.092-.113.066-.071.392-.528.464-.598q.212-.29.366-.631.188-.42.425-.798c.165-.279.279-.598.334-.935-1.304-.898-2.422-2.149-3.27-3.656-.858-1.49-1.285-3.286-1.214-5.104.07-1.82.636-3.557 1.606-4.94 1.166-1.707 2.66-3.033 4.35-3.863C7.873.459 9.92-.025 11.986 0m4.319 7.103a.5.5 0 0 0-.702.091l-4.625 6.012-2.598-3.032a.5.5 0 0 0-.76.65l3 3.5a.502.502 0 0 0 .776-.02l5-6.5a.5.5 0 0 0-.091-.701"
      />
    </g>
    <defs>
      <clipPath id="icon-bulle-success_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconBulleSuccess;
