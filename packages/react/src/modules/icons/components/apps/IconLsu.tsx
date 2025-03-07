import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconLsu = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M6.76 12.33h10.23c.3 0 .54-.24.54-.54V7.03c0-.3-.24-.55-.54-.55H6.76c-.3 0-.54.24-.54.54v4.77c0 .3.24.54.54.54m.7-4.22c0-.3.24-.54.54-.54h7.74c.3 0 .54.24.54.54v2.54c0 .3-.24.55-.54.55H8a.54.54 0 0 1-.54-.55zm8.34 11.73c0 .28-.23.51-.52.51h-6.8a.52.52 0 1 1 .04-1.03h6.76c.29 0 .52.23.52.51zm0-2.5c0 .29-.23.52-.52.52H8.52a.51.51 0 0 1-.56-.52.52.52 0 0 1 .56-.5h6.76c.29 0 .52.22.52.5m0-2.49c0 .29-.23.52-.52.52H8.52a.51.51 0 0 1-.56-.52.52.52 0 0 1 .56-.51h6.76c.29 0 .52.23.52.51m3.71-11.43h-.97l.02-1.72a.54.54 0 0 0-.63-.54l-2.18.34V.34a.54.54 0 0 0-.71-.51L4.27 3.2c-.4.13-.68.5-.68.93v18.73c0 .53.43.97.97.97h14.95c.54 0 .98-.43.98-.97V4.4a.97.97 0 0 0-.98-.98m-2.25-1v.98H12.5zm-2.54-1.35v.76l-3.96.54zm4.38 21.55H4.75V4.7H19.1z"
    />
  </svg>
);
export default SvgIconLsu;
