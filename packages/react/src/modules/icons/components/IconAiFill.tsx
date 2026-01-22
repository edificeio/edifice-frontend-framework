import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconAiFill = ({
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
      d="m12.61 21.262.585-1.344a10.35 10.35 0 0 1 5.27-5.342l1.805-.802a1.258 1.258 0 0 0 0-2.283l-1.705-.76A10.38 10.38 0 0 1 13.22 5.21l-.601-1.448a1.201 1.201 0 0 0-2.237 0l-.601 1.45a10.37 10.37 0 0 1-5.346 5.52l-1.703.757a1.258 1.258 0 0 0 0 2.285l1.802.805a10.35 10.35 0 0 1 5.273 5.34l.584 1.343a1.201 1.201 0 0 0 2.218 0M19.35 7.767l.185-.424A3.27 3.27 0 0 1 21.2 5.656l.57-.254a.398.398 0 0 0 0-.72l-.539-.24a3.28 3.28 0 0 1-1.688-1.744l-.19-.457a.38.38 0 0 0-.706 0l-.19.458a3.28 3.28 0 0 1-1.688 1.743l-.538.239a.398.398 0 0 0 0 .721l.57.254c.746.335 1.34.936 1.665 1.687l.184.424a.38.38 0 0 0 .7 0"
    />
  </svg>
);
export default SvgIconAiFill;
