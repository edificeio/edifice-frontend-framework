import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgIconForms = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    aria-hidden="true"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g fill="currentColor" clipPath="url(#icon-forms_svg__a)">
      <path d="M13.615 5.36v-.008zM18.35 2.4H8.356c-.954 0-1.73.776-1.73 1.73v13.914c0 .954.776 1.73 1.73 1.73h9.994c.953 0 1.73-.776 1.73-1.73V4.13c0-.954-.776-1.73-1.73-1.73m-.508 2.95v.01zm-5.48 9.98-1.63 1.631a.577.577 0 0 1-.815 0l-.815-.815a.577.577 0 0 1 .815-.816l.408.408 1.223-1.223a.577.577 0 0 1 .815.816Zm0-4.613-1.63 1.631a.577.577 0 0 1-.815 0l-.815-.815a.577.577 0 0 1 .815-.815l.408.408 1.223-1.223a.577.577 0 0 1 .815.815Zm0-4.612-1.63 1.63a.577.577 0 0 1-.815 0l-.815-.815a.577.577 0 0 1 .815-.815l.408.408 1.223-1.223a.577.577 0 0 1 .815.815Zm1.253-.746v-.008zm3.87 10.991h-3.074a.576.576 0 1 1 0-1.152h3.075a.576.576 0 1 1 0 1.152Zm.004-4.628h-3.075a.576.576 0 1 1 0-1.153h3.075a.576.576 0 1 1 0 1.153m.19-4.601h-3.076a.576.576 0 0 1 0-1.153h3.075a.577.577 0 0 1 0 1.153Z" />
      <path d="M5.473 18.044V4.805a1.73 1.73 0 0 0-1.153 1.63V20.35c0 .954.776 1.73 1.73 1.73h9.994c.751 0 1.392-.482 1.63-1.153H8.356a2.886 2.886 0 0 1-2.883-2.883" />
    </g>
    <defs>
      <clipPath id="icon-forms_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconForms;
