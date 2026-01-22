import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconExercizerAi = ({
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
      d="M6.5 5a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5v-8a1 1 0 1 1 2 0v8a2.5 2.5 0 0 1-2.5 2.5h-12A2.5 2.5 0 0 1 4 20.5v-15A2.5 2.5 0 0 1 6.5 3h5a1 1 0 1 1 0 2z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M8 9a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1M8 13a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1M8 17a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      d="m18.584 10.611.308-.707a5.45 5.45 0 0 1 2.774-2.811l.95-.422a.662.662 0 0 0 0-1.202l-.898-.4a5.46 5.46 0 0 1-2.812-2.906l-.317-.762a.631.631 0 0 0-1.177 0l-.316.763a5.46 5.46 0 0 1-2.814 2.905l-.896.399a.662.662 0 0 0 0 1.203l.948.423a5.45 5.45 0 0 1 2.775 2.81l.308.707a.633.633 0 0 0 1.167 0"
    />
  </svg>
);
export default SvgIconExercizerAi;
