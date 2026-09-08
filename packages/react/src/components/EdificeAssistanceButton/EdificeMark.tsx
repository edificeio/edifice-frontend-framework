import { useId, type SVGProps } from 'react';

/** Compact "Edifice" icon mark, used in the collapsed (scrolled) state of {@link EdificeAssistanceButton}. */
const EdificeMark = (props: SVGProps<SVGSVGElement>) => {
  const clipId = `edifice-mark-clip-${useId()}`;

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <g clipPath={`url(#${clipId})`}>
        <path d="M12.3607 0H5.63574V1.98663H12.3607V0Z" fill="white" />
        <path
          d="M8.99998 1.94877C4.5758 1.94877 0.99 5.55054 0.99 9.99441H17.01C17.01 5.55054 13.4242 1.94877 8.99998 1.94877Z"
          fill="#C8D3FE"
        />
        <path
          d="M12.6785 12.1763C12.497 12.4797 12.2767 12.7621 12.0205 13.0164C11.2121 13.8215 10.1394 14.265 8.99997 14.265C7.86153 14.265 6.78888 13.8215 5.97941 13.0164C5.17094 12.2113 4.72034 11.1389 4.70938 9.99638V9.99338H0.99C0.99 9.99338 0.99 9.99438 0.99 9.99538C0.99 10.0074 0.99 10.0194 0.99 10.0314C1.03087 14.4393 4.60072 18 8.99897 18C12.6555 18 15.7389 15.5387 16.6989 12.1753H12.6775L12.6785 12.1763Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default EdificeMark;
