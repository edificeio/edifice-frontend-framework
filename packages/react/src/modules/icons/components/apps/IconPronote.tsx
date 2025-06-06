import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconPronote = ({
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
      d="M5.24 2.43c-.91 0-1.15.07-1.3.39-.1.24-.19 2-.19 4.28 0 3.5.05 3.87.31 3.97.32.07 1.16-.03 1.64-.17.14-.05.21-.48.21-1.2V8.57l.68-.22c1-.29 1.7-1.23 1.83-2.4.1-.75.14-.34.3 1.94.13 1.59.27 2.98.32 3.1.15.27 1.37.3 1.97.03.27-.12.46-.36.46-.53 0-.24.07-.22.36.1.63.72 2.34.4 2.34-.39 0-.24-.24-.87-.53-1.4l-.53-.96.36-.62c.46-.87.46-2.43 0-3.3-.6-1.13-1.16-1.4-2.77-1.34-1.58.05-2 .29-2.18 1.3l-.12.6L8 3.8c-.55-.93-1.42-1.37-2.76-1.37m11.93.27c-.1 0-.2 0-.29.02-1.66.46-2.5 2-2.64 4.74-.08 1.58-.05 1.9.29 2.47.19.39.62.82.93.97 1.45.72 3.18.02 3.88-1.52.57-1.3.57-4.23 0-5.27a2.91 2.91 0 0 0-2.17-1.41m-5.8 2.6c.3 0 .68.47.53.67-.26.3-.8.12-.8-.27 0-.24.13-.4.27-.4m-5.4 0c.21.02.48.23.48.5 0 .4-.51.38-.65 0-.05-.2-.05-.39 0-.43.04-.08.12-.08.16-.08zm11 .21c.06 0 .08 0 .13.02.31.05.4.22.45.87.03.43 0 1.1-.04 1.5-.1.45-.22.66-.46.66-.53 0-.6-.3-.46-1.78.1-1.05.15-1.27.39-1.27zM5.85 11.74c-.1 0-.21.02-.36.05-.82.19-1.03.62-.91 1.78.07.52.07.96.02.96s-.33-.56-.65-1.23c-.53-1.18-.55-1.23-1.25-1.23-1.3 0-1.4.39-1.08 4.4.41 4.82.31 4.38.96 4.38.32 0 .77-.07.99-.12.4-.14.43-.21.36-1.37-.1-1.32-.07-1.32.8.36.43.82.55.94 1.1.94.91 0 1.18-.2 1.18-.8v-.55l.48.7c.26.36.65.75.84.84.22.1.77.2 1.25.2a2.74 2.74 0 0 0 2.67-1.78c.34-.8.36-1.11.27-2.65-.15-2-.46-2.76-1.38-3.46-1.6-1.25-3.82.29-4.1 2.84-.13.98-.15.86-.32-1.45s-.27-2.84-.87-2.81m7.34.1-.24.52a3.8 3.8 0 0 0-.27 1.4c-.02.8.03.86.53.96l.53.12v2.74c0 1.52.02 2.84.05 2.91.07.27 1.61.17 1.8-.1.1-.14.24-1.39.34-2.8l.14-2.56.53-.07c.8-.1.99-.38.99-1.44 0-.55-.1-1.08-.22-1.18a8.3 8.3 0 0 0-2.2-.36zm7.48.86c-.77 0-1.64.05-1.95.12-.94.2-.99.53-.77 4.62.12 2.04.24 3.77.29 3.87.1.14 2.43.05 3.63-.17l.6-.1-.07-1.17-.05-1.16-1.03-.07c-1.18-.07-1.35-.34-.32-.53.7-.14.72-.17.72-.94 0-1.17-.14-1.42-.81-1.42-1 0-.7-.38.33-.45.9-.05.94-.1.99-.65a4.6 4.6 0 0 0-.05-1.28l-.12-.67h-1.4zM9.62 15.42c.1-.03.24.04.36.14.2.2.24.6.22 1.59-.05 1.32-.24 1.68-.65 1.22-.27-.3-.3-2.74-.03-2.93.03-.02.05-.02.1-.02"
    />
  </svg>
);
export default SvgIconPronote;
