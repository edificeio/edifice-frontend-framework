import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconLogoEdificeFull = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 81 18"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g clipPath="url(#icon-logo-edifice-full_svg__a)">
      <path
        fill="#C8D3FE"
        d="M72.667 1.944c-4.424 0-8.01 3.602-8.01 8.045h16.02c0-4.443-3.586-8.045-8.01-8.045"
      />
      <path
        fill="#fff"
        d="M76.346 12.173a4.3 4.3 0 0 1-.659.84 4.25 4.25 0 0 1-3.02 1.249 4.26 4.26 0 0 1-3.02-1.249 4.3 4.3 0 0 1-1.27-3.02V9.99h-3.72v.038c.04 4.408 3.61 7.969 8.009 7.969 3.657 0 6.74-2.462 7.7-5.825h-4.022zM55.596 10.014a4.28 4.28 0 0 1 1.253-2.998 4.2 4.2 0 0 1 2.98-1.24h3.618V2.07h-3.67c-4.317.029-7.812 3.552-7.852 7.908v.077c.04 4.356 3.535 7.879 7.85 7.907h3.672v-3.707h-3.618a4.2 4.2 0 0 1-2.98-1.24 4.28 4.28 0 0 1-1.255-2.997v-.007z"
      />
      <path fill="#C8D3FE" d="M50.302 7.711h-3.56v10.252h3.56z" />
      <path fill="#fff" d="M50.302 2.07h-3.56v3.608h3.56z" />
      <path fill="#C8D3FE" d="M40.983 2.07h-3.56v15.893h3.56z" />
      <path
        fill="#fff"
        d="M44.529 2.07h-3.56v3.576h.222a3.345 3.345 0 0 0 3.337-3.353zM44.529 7.711h-3.56v3.576h.222a3.345 3.345 0 0 0 3.337-3.353z"
      />
      <path fill="#C8D3FE" d="M35.19 7.711h-3.56v10.252h3.56z" />
      <path
        fill="#fff"
        d="M35.19 2.07h-3.56v3.608h3.56zM29.636 10.017c0-4.39-3.542-7.947-7.911-7.947v15.893c4.369 0 7.91-3.558 7.91-7.946"
      />
      <path fill="#C8D3FE" d="M21.726 2.07h-3.56v15.893h3.56z" />
      <path fill="#fff" d="M11.677 0H4.952v1.987h6.725z" />
      <path
        fill="#C8D3FE"
        d="M8.316 1.949c-4.424 0-8.01 3.601-8.01 8.045h16.02c0-4.444-3.586-8.045-8.01-8.045"
      />
      <path
        fill="#fff"
        d="M11.995 12.176a4.3 4.3 0 0 1-.658.84 4.25 4.25 0 0 1-3.021 1.25 4.26 4.26 0 0 1-3.02-1.25 4.3 4.3 0 0 1-1.27-3.02v-.003H.305v.039C.346 14.439 3.916 18 8.315 18c3.657 0 6.74-2.461 7.7-5.825h-4.022z"
      />
    </g>
    <defs>
      <clipPath id="icon-logo-edifice-full_svg__a">
        <path fill="#fff" d="M0 0h81v18H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconLogoEdificeFull;
