import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconCervoprint = ({
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
      d="m2.6 1.73-.05 16.89h6.68l2.46-4.33a45 45 0 0 0 2.55-4.86c.04-.38-.08-.67-.39-.99-.26-.24-2.6-1.68-5.2-3.17S3.64 2.36 3.28 2.14l-.67-.4zm4.01.05 2.77 2.05a61 61 0 0 0 2.86 2.06c.02 0 .02-.02.05-.1l.02.06c.39.3.77.62 1.18.89l-.12-.03.43.34 2.12 1.54c2.23 1.66 2.23 1.8-.05 4.93l-2.72 3.75-.98 1.37 8.73.02-.12-2.79a248 248 0 0 1-.12-8.44l.02-5.62h-7.02L6.6 1.78zM2.62 19.12a1.47 1.47 0 0 0-1.08.39c-.15.12-.24.28-.31.48-.08.16-.1.38-.1.62s.02.48.1.65c.07.2.19.36.3.48.15.12.3.22.47.27.19.04.38.1.6.1.12 0 .24-.03.33-.03a4 4 0 0 0 .7-.24v-.46h-.02c-.15.15-.32.22-.48.29s-.34.1-.53.1c-.15 0-.3-.03-.41-.08s-.24-.12-.34-.21a.7.7 0 0 1-.21-.34c-.08-.14-.1-.34-.1-.53s.02-.36.07-.5q.105-.225.24-.36a.93.93 0 0 1 .72-.3c.2 0 .39.03.53.08.17.07.34.17.5.29h.03v-.43c-.2-.1-.36-.17-.53-.22a4 4 0 0 0-.48-.05m15.08.02v.39h.43v-.39zm-4.23.03v2.88h.38v-1.08h.41c.22 0 .4-.02.55-.07s.27-.12.36-.22a1 1 0 0 0 .2-.29.9.9 0 0 0 .07-.36.74.74 0 0 0-.1-.4.7.7 0 0 0-.26-.27c-.1-.07-.22-.12-.34-.14s-.29-.05-.46-.05zm8.05.1v.62h-.26v.31h.26v1.13c0 .27.05.46.17.58s.29.17.53.17h.21c.1-.03.17-.05.24-.05v-.34h-.02c-.02.03-.07.03-.14.05-.05.02-.12.02-.2.02-.1 0-.19 0-.24-.02s-.1-.07-.12-.12a.4.4 0 0 1-.04-.17c0-.07-.03-.17-.03-.26v-.99h.8v-.31h-.8v-.63h-.36zm-7.67.23h.41c.12 0 .24 0 .31.03.1.02.17.05.22.1.1.02.14.1.17.16a.6.6 0 0 1 .07.27c0 .07-.02.14-.05.21s-.07.15-.14.2c-.05.07-.15.12-.24.14s-.24.02-.39.02h-.36zm-8.73.34c-.31 0-.6.1-.8.3s-.3.5-.3.83c0 .36.12.65.33.85.2.19.5.28.87.28.14 0 .29-.02.43-.07.12-.02.27-.07.39-.12v-.38H6c-.05.04-.17.1-.31.16-.17.05-.31.08-.48.08-.12 0-.22 0-.32-.03l-.26-.14c-.07-.07-.12-.15-.17-.24s-.07-.22-.07-.36h1.68v-.2c0-.3-.07-.55-.24-.72s-.4-.24-.72-.24zm6.66 0c-.31 0-.57.1-.77.3-.19.2-.29.47-.29.83 0 .34.1.63.3.82.19.22.45.31.76.31s.58-.1.77-.3c.2-.2.3-.49.3-.83 0-.36-.1-.62-.3-.84-.19-.2-.45-.29-.77-.29m8.23 0a1 1 0 0 0-.39.07c-.14.05-.26.12-.38.22v-.24h-.39v2.16h.39v-1.6c.12-.08.21-.15.33-.2s.22-.07.34-.07c.1 0 .17 0 .24.05.07.02.12.04.14.12.03.04.05.1.08.19l.02.29v1.22h.39v-1.41c0-.27-.08-.46-.22-.6-.12-.15-.31-.2-.55-.2m-13.35.05v2.16h.39v-1.53l.3-.2a1 1 0 0 1 .37-.07h.2c.04.03.09.03.16.03v-.37l-.12-.02h-.14c-.07 0-.24.02-.37.07-.12.05-.24.12-.4.24v-.31zm1.54 0 .91 2.16h.39l.91-2.16h-.38l-.7 1.7-.72-1.7h-.4zm7.74 0v2.16h.39v-1.53c.1-.08.21-.15.31-.2a1 1 0 0 1 .34-.07h.19c.07.03.12.03.17.03h.02v-.37l-.14-.02h-.15c-.12 0-.21.02-.33.07s-.27.12-.41.24v-.31zm1.78 0v2.16h.39V19.9h-.39zm-12.62.24c.21 0 .36.05.45.14a.6.6 0 0 1 .17.46H4.4c.02-.17.1-.31.22-.43s.28-.17.48-.17m6.68.02c.2 0 .36.05.48.2s.17.33.17.62c0 .27-.05.48-.17.6a.6.6 0 0 1-.48.22.57.57 0 0 1-.48-.22c-.12-.12-.17-.34-.17-.6 0-.29.05-.48.17-.62s.27-.2.48-.2"
    />
  </svg>
);
export default SvgIconCervoprint;
