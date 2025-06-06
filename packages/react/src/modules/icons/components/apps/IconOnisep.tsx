import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconOnisep = ({
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
      d="M17.58 22.66a9.5 9.5 0 0 1-.15-2.12v-1.95l-1.37.07c-1.1.08-1.37.15-1.37.48 0 .85 1.1 1.2 2.1.68.36-.2.43-.2.36.04-.15.49-1.28.94-1.9.8-1.5-.39-2-2.33-.9-3.44.9-.89 2.27-.67 2.75.43l.3.72v-.86c.03-.82.47-1.18.83-.63.1.17.26.17.55 0 .67-.36 1.13-.26 1.73.34 1.42 1.42-.1 4.33-1.73 3.3-.26-.17-.36 0-.46.96-.1 1.08-.38 1.53-.74 1.17zm2.21-2.72c.53-.53.48-2.29-.07-2.6-.58-.29-.6-.29-1.03.12-.51.53-.49 2.28.04 2.6s.65.29 1.06-.12m-3.27-1.83c0-.34-.5-.99-.8-.99-.36 0-1.03.6-1.03.92 0 .12.41.21.92.21s.91-.07.91-.14M3.46 20.54c-.77-.31-1.08-.87-1.05-1.9.02-1.88 1.92-2.62 3.24-1.3.6.6.67.82.58 1.54a2.64 2.64 0 0 1-.55 1.23c-.49.48-1.6.7-2.22.43m1.57-.75c.45-.64.45-1.53 0-2.16-.44-.65-.87-.65-1.47-.02-.39.36-.46.64-.36 1.25.24 1.44 1.15 1.92 1.83.93m1.65.82c-.1-.1-.16-1-.16-2.07 0-1.51.07-1.87.36-1.87.17 0 .33.1.33.24s.12.14.44 0c.62-.36 1.3-.32 1.7.12.3.29.37.72.32 2-.1 1.82-.5 2.18-.6.47-.1-1.85-.22-2.16-.85-2.16-.72 0-1.03.74-.96 2.19.05.98-.19 1.44-.57 1.08zm3.35-.14c-.07-.2-.1-1.09-.05-2.02.05-1.4.14-1.69.48-1.76.36-.07.39.12.34 1.93-.05 1.32-.17 2.02-.36 2.06-.15.08-.34-.04-.41-.21m1.32.12c-.29-.1-.4-.75-.14-.75.04 0 .3.1.52.22.53.29 1.16.07 1.16-.36 0-.17-.34-.48-.75-.68-1.2-.62-1.37-1.15-.62-1.9.55-.55 1.54-.6 1.73-.12.2.5-.07.68-.48.34-.31-.24-.43-.24-.72.05-.32.34-.27.4.57.96.68.43.94.75.94 1.13 0 .91-1.22 1.52-2.2 1.1zM15.39 13a7.3 7.3 0 0 1-1.51-.91l-.49-.46-.29.82-.26.82-2.74-.15-.82-1.54-.82-1.56-.77 1.61-.8 1.64-2.76-.15L2.4 8.47A52 52 0 0 1 .58 3.03l-.08-.8h3.18L4.7 4.92c.55 1.47 1.06 2.67 1.13 2.67s.46-.68.87-1.47c.7-1.44.74-1.5 1.58-1.5 1.13 0 1.45.3 2.26 1.93l.68 1.35.57-1.59c.34-.86.82-2.14 1.09-2.86l.48-1.32 2.76.02c3.27 0 4.11.3 5.5 1.88A5.38 5.38 0 0 1 23.12 8a5.48 5.48 0 0 1-7.72 5zm3.73-3.15c1.7-1.6.74-4.66-1.47-4.66-2.48 0-3.37 3.75-1.18 4.97.77.46 2 .3 2.65-.3z"
    />
  </svg>
);
export default SvgIconOnisep;
