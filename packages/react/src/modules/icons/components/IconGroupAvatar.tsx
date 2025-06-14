import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconGroupAvatar = ({
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
      d="M18.467 13.128a.917.917 0 0 1 1.166-.566c1.034.358 1.89 1.143 2.475 2.155.586 1.014.891 2.233.892 3.467v2.458a.917.917 0 0 1-1.833 0v-2.457c0-.944-.236-1.842-.646-2.55-.41-.709-.948-1.154-1.488-1.34a.917.917 0 0 1-.566-1.167M14.921 2.661a.917.917 0 0 1 .95-.882 4.702 4.702 0 0 1 1.934 8.902.917.917 0 0 1-.822-1.64 2.868 2.868 0 0 0-1.18-5.43.917.917 0 0 1-.882-.95M2.38 15.778c.894-.982 2.127-1.552 3.432-1.552h7.792c1.306 0 2.538.57 3.433 1.552.892.98 1.38 2.29 1.38 3.642v2.14a.917.917 0 1 1-1.834 0v-2.14c0-.917-.332-1.782-.902-2.407-.567-.623-1.316-.954-2.077-.954H5.812c-.76 0-1.51.331-2.077.954-.569.625-.902 1.49-.902 2.407v2.14a.917.917 0 1 1-1.833 0v-2.14c0-1.351.488-2.663 1.38-3.642M9.708 4.142a3.208 3.208 0 1 0 0 6.417 3.208 3.208 0 0 0 0-6.417M4.667 7.351a5.042 5.042 0 1 1 10.083 0 5.042 5.042 0 0 1-10.083 0"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIconGroupAvatar;
