import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconTextHighlight = ({
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
      fill="#46AFE6"
      d="M1.2 21.8a2 2 0 0 1 2-2h3.4V24H3.2a2 2 0 0 1-2-2z"
    />
    <path fill="#A348C0" d="M6.6 19.8H12V24H6.6z" />
    <path fill="#FF3A55" d="M12 19.8h5.4V24H12z" />
    <path
      fill="#FF8D2E"
      d="M17.4 19.8h3.4a2 2 0 0 1 2 2v.2a2 2 0 0 1-2 2h-3.4z"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M17.245.78A3.005 3.005 0 0 0 13 .986L6.71 7.874a4 4 0 0 0-1.032 3.056l-3.03 6.114a1 1 0 0 0 .895 1.444l5.673.006a1 1 0 0 0 .522-.146l2.442-1.492a4 4 0 0 0 2.954-1.314l6.29-6.888a3.005 3.005 0 0 0-.192-4.245zm-5.398 14.047-.05-.081-.087.053a2 2 0 0 1-.884-.466L8.318 12.05a2 2 0 0 1-.548-.837l.043-.087-.08-.04A2 2 0 0 1 8.19 9.22l6.29-6.888a1 1 0 0 1 1.414-.069l3.987 3.63c.408.371.437 1.005.064 1.415l-6.29 6.887a2 2 0 0 1-1.808.632m-5.113-1.524q.111.12.233.23l2.508 2.283q.117.106.24.202l-.78.476-3.78-.004z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconTextHighlight;
