import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconStarFavorite = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 25 22"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="#FFD422"
      stroke="#fff"
      strokeWidth={1.942}
      d="M12.633-.966a1.81 1.81 0 0 1 1.44.928l.06.115 2.413 5.12 5.38.819.13.024c.598.137 1.072.57 1.288 1.126l.043.121.033.123a1.88 1.88 0 0 1-.394 1.652l-.087.095-3.919 4 .928 5.657.016.125a1.87 1.87 0 0 1-.62 1.584l-.1.082c-.528.4-1.227.478-1.825.204l-.118-.06-4.801-2.643-4.8 2.644a1.78 1.78 0 0 1-1.943-.145 1.87 1.87 0 0 1-.705-1.791l.927-5.658L2.06 9.157a1.88 1.88 0 0 1-.447-1.87 1.82 1.82 0 0 1 1.46-1.271l5.38-.82L10.866.077l.06-.115c.313-.56.904-.933 1.573-.933z"
    />
    <path
      fill="#EEBF00"
      d="M22.458 7.575a.85.85 0 0 0-.679-.6l-5.89-.895L13.253.49a.84.84 0 0 0-.755-.49c-.056 0 0 16.999 0 16.999l5.27 2.9a.81.81 0 0 0 .885-.067.9.9 0 0 0 .335-.861l-1.006-6.143 4.262-4.35a.91.91 0 0 0 .213-.903"
    />
  </svg>
);
export default SvgIconStarFavorite;
