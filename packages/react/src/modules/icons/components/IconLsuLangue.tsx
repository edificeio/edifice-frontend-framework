import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconLsuLangue = ({
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
    <g fill="currentColor" clipPath="url(#icon-lsu-langue_svg__a)">
      <path d="M12.401.994h-.799C5.602.994.72 5.787.72 11.684v.633c0 5.895 4.879 10.69 10.879 10.69h11.677V11.682c0-5.896-4.878-10.69-10.878-10.69zm8.629 19.802h-9.428c-4.758 0-8.628-3.803-8.628-8.48v-.633c0-4.676 3.87-8.479 8.628-8.479h.8c4.758 0 8.628 3.803 8.628 8.48z" />
      <path d="M14.171 8.3c0-.611-.502-1.105-1.125-1.105-.622 0-1.125.494-1.125 1.105v.498H9.015c-.622 0-1.125.494-1.125 1.105 0 .612.503 1.106 1.125 1.106h2.269c-.072 1.22-.428 2.93-1.744 4.083a4.6 4.6 0 0 1-.986.655c-.555.273-.78.94-.499 1.485.199.387.593.608 1.005.608.169 0 .341-.036.506-.117a6.7 6.7 0 0 0 1.47-.98c.912-.797 1.497-1.75 1.875-2.705.566.91 1.335 1.802 2.348 2.299a1.133 1.133 0 0 0 1.511-.494 1.095 1.095 0 0 0-.503-1.481c-1.143-.564-1.957-2.332-2.313-3.353h3.375V8.798h-3.154V8.3z" />
    </g>
    <defs>
      <clipPath id="icon-lsu-langue_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconLsuLangue;
