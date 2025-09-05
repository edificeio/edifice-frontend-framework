import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconActualites = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 50 50"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M25 18.91h-8.54v8.52H25zm2.87 14.22V36H13.63v-2.87zm0-17.09v14.22H13.63V16zm14.2 17.09V36H30.68v-2.87zm0-5.7v2.83H30.68v-2.83zm0-5.69v2.87H30.68v-2.87zm0-5.7v2.87H30.68V16zM7.93 37.39V16H5.06v21.39a1.51 1.51 0 0 0 1.44 1.44 1.37 1.37 0 0 0 1-.44 1.35 1.35 0 0 0 .43-1m37 0V13.21H10.76v24.18a4.5 4.5 0 0 1-.24 1.44h33a1.4 1.4 0 0 0 1-.44 1.28 1.28 0 0 0 .38-1zm2.86-27v27a4.2 4.2 0 0 1-4.26 4.26H6.5a4.22 4.22 0 0 1-3-1.23 3.9 3.9 0 0 1-1.23-3V13.21h5.66v-2.86z"
    />
  </svg>
);
export default SvgIconActualites;
