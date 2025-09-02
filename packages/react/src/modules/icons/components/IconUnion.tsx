import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconUnion = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 20 20"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M10.177 12.503C12.875 12.58 15 14.39 15 16.78c0 1.017-.948 1.553-1.724 1.553h-6.55c-.78 0-1.724-.54-1.724-1.553v-.031L5 16.7c0-2.532 2.516-4.275 5.177-4.197m-.048 1.666c-2.06-.06-3.433 1.235-3.462 2.49a.3.3 0 0 0 .06.008h6.55q.03 0 .052-.007c-.071-1.22-1.222-2.434-3.2-2.491"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      d="M3.884 9.17a4 4 0 0 1 1.446.318.833.833 0 0 1-.58 1.559l-.08-.03-.19-.071a2.4 2.4 0 0 0-.651-.11c-1.172-.04-2.041.755-2.15 1.664h2.488a.833.833 0 0 1 0 1.667h-2.71c-.743 0-1.457-.57-1.457-1.409v-.065C0 10.64 1.819 9.101 3.884 9.17M16.384 9.17C18.38 9.235 20 10.815 20 12.757c0 .842-.718 1.409-1.457 1.409h-2.71a.833.833 0 0 1 0-1.667h2.478c-.132-.873-.92-1.63-1.982-1.665a2.3 2.3 0 0 0-.995.188.834.834 0 0 1-.668-1.527 3.95 3.95 0 0 1 1.718-.327"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M10 4.167a3.333 3.333 0 1 1 0 6.667 3.333 3.333 0 0 1 0-6.667m0 1.667a1.667 1.667 0 1 0 0 3.333 1.667 1.667 0 0 0 0-3.333M3.75 1.667a2.917 2.917 0 1 1 0 5.833 2.917 2.917 0 0 1 0-5.833m0 1.667a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M16.25 1.667a2.917 2.917 0 1 1 0 5.833 2.917 2.917 0 0 1 0-5.833m0 1.667a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconUnion;
