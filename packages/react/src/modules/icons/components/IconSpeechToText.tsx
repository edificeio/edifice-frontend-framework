import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconSpeechToText = ({
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
      d="M9.18 17.657H6.25c-.622 0-1.178.357-1.42.887l-1.253 2.73c-.197.428-.007.942.462 1.146.13.054.26.08.38.08a.93.93 0 0 0 .844-.526l1.178-2.567h2.237c1.305 0 2.34-1.025 2.34-2.25v-3.57l.475-.026c1.528-.08 2.72-1.304 2.72-2.769 0-.785-.348-1.538-.962-2.068a10.37 10.37 0 0 1-3.202-4.932L9.563 2.14c-.135-.455-.64-.744-1.146-.605a.87.87 0 0 0-.628 1.078l.486 1.652a12.1 12.1 0 0 0 3.738 5.757l.003.003c.216.189.352.464.352.767a1.03 1.03 0 0 1-1.033 1.023h-.848c-.737 0-1.308.575-1.308 1.249zM15.419 17.833a.847.847 0 0 0 0 1.227c.179.173.413.261.657.261a.94.94 0 0 0 .657-.261 3.53 3.53 0 0 0 0-5.117.956.956 0 0 0-1.315 0 .843.843 0 0 0 .002 1.227c.365.354.566.827.566 1.331 0 .508-.207.978-.565 1.33zM18.972 21.379h.002c.143.082.302.12.463.12a.94.94 0 0 0 .803-.444 8.87 8.87 0 0 0 0-9.112.947.947 0 0 0-1.269-.323.855.855 0 0 0-.333 1.188 7.18 7.18 0 0 1 0 7.383.853.853 0 0 0 .334 1.188"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconSpeechToText;
