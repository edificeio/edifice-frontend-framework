import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconReadMail = ({
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
    <g
      fill="currentColor"
      fillRule="evenodd"
      clipPath="url(#icon-read-mail_svg__a)"
      clipRule="evenodd"
    >
      <path d="M1.143 8.986a1 1 0 0 1 1.372-.343l8.97 5.382a1 1 0 0 0 1.03 0l8.97-5.382a1 1 0 1 1 1.03 1.714l-8.971 5.383a3 3 0 0 1-3.088 0l-8.97-5.382a1 1 0 0 1-.343-1.373" />
      <path d="M12.466 2.4a.95.95 0 0 0-.932 0c-1.333.74-3.83 2.146-5.99 3.465-1.083.662-2.063 1.29-2.764 1.797a8 8 0 0 0-.78.62v11.003H0V8c0-.38.191-.664.272-.776.107-.148.238-.285.364-.404.254-.24.594-.506.973-.78.765-.552 1.797-1.212 2.892-1.881C6.697 2.817 9.224 1.395 10.563.65a2.95 2.95 0 0 1 2.874 0c1.34.744 3.866 2.166 6.062 3.508 1.095.669 2.127 1.33 2.892 1.882.38.273.719.54.973.78.126.118.257.255.364.403.08.112.272.395.272.776v11.285h-2V8.284l-.009-.008a8 8 0 0 0-.77-.613c-.702-.506-1.682-1.135-2.765-1.797-2.16-1.32-4.657-2.725-5.99-3.466M2.321 19.802c.253.192.647.34 1.123.34h17.112c.476 0 .87-.148 1.123-.34.252-.192.321-.384.321-.517h2c0 .892-.479 1.629-1.111 2.11-.632.479-1.46.747-2.333.747H3.444c-.873 0-1.701-.268-2.333-.748S0 20.178 0 19.285h2c0 .133.069.326.32.518" />
    </g>
    <defs>
      <clipPath id="icon-read-mail_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconReadMail;
