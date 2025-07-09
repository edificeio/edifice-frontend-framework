import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconPoll = ({
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
      d="M36.082 44H14.918q-3.3 0-5.583-2.332Q7.05 39.338 7 36.093V14.907q0-3.295 2.335-5.576T14.918 7h13.196q1.116 0 1.878.811.76.81.812 1.825.05 1.013-.812 1.875-.863.861-1.878.811H14.918q-1.066 0-1.878.76t-.761 1.825v21.186q0 1.065.76 1.825.762.76 1.879.76h21.164q1.066 0 1.827-.76a2.68 2.68 0 0 0 .813-1.825v-7.957q0-1.065.812-1.825t1.877-.811 1.828.81q.76.863.761 1.826v7.957q0 3.294-2.335 5.575T36.082 44m-7.511-11.05q-1.472 0-2.487-1.013l-7.004-6.995q-1.015-1.115-1.015-2.534 0-1.42 1.015-2.483 1.014-1.065 2.436-1.014a3.8 3.8 0 0 1 2.487 1.014l3.806 3.75 9.136-14.394q.71-1.267 2.132-1.673 1.42-.405 2.69.254 1.269.658 1.675 2.128.405 1.47-.355 2.687l-11.42 18.449q-.914 1.825-3.096 1.825"
    />
  </svg>
);
export default SvgIconPoll;
