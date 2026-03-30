import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconLsuFrancais = ({
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
      d="M17.599.37H1.417V20.13c0 1.916 1.587 3.474 3.537 3.474H22.53v-2.21h-2.974V18.86h2.974v-1.105h.067V5.283C22.598 2.574 20.356.37 17.6.37m0 2.212c1.515 0 2.749 1.212 2.749 2.7v11.372H4.954c-.454 0-.889.088-1.287.243V2.582zm-.293 18.814H4.954a1.277 1.277 0 0 1-1.287-1.264c0-.696.578-1.264 1.287-1.264h12.352V21.4z"
    />
    <path
      fill="currentColor"
      d="M17.67 4.815H7.174v2.21H17.67zM17.67 9.679H7.174v2.21H17.67z"
    />
  </svg>
);
export default SvgIconLsuFrancais;
