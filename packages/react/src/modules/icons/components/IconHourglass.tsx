import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconHourglass = ({
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
      d="m13.138 11.993 4.358-7.721a.1.1 0 0 0 .004-.034.14.14 0 0 0-.03-.069.4.4 0 0 0-.137-.108A.6.6 0 0 0 17.05 4H6.939a.6.6 0 0 0-.258.056.4.4 0 0 0-.147.11.15.15 0 0 0-.033.072q-.003.014.003.035l4.358 7.72a1 1 0 0 1 0 1.014l-4.358 7.721a.1.1 0 0 0-.004.034.14.14 0 0 0 .03.069.4.4 0 0 0 .137.108.6.6 0 0 0 .283.061h10.111a.6.6 0 0 0 .258-.056.4.4 0 0 0 .147-.11.15.15 0 0 0 .033-.072q.003-.014-.003-.035l-4.358-7.72a1 1 0 0 1 0-1.014m-4.286.507L4.735 5.207 4.7 5.14A2.1 2.1 0 0 1 4.515 4c.046-.391.202-.755.439-1.06.235-.304.542-.54.884-.699s.716-.24 1.09-.242H17.09l.084.001c.366.016.729.108 1.058.274s.624.405.847.708a2.093 2.093 0 0 1 .186 2.224L15.148 12.5l4.117 7.293.035.067c.166.354.232.747.185 1.139a2.14 2.14 0 0 1-.439 1.06c-.235.304-.542.54-.884.699a2.6 2.6 0 0 1-1.09.242H6.91l-.084-.001a2.6 2.6 0 0 1-1.058-.274 2.4 2.4 0 0 1-.847-.708 2.094 2.094 0 0 1-.186-2.224z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconHourglass;
