import clsx from "clsx";

import { Heading } from "../Heading";

export interface EmptyScreenProps {
  /**
   * Image source
   */
  imageSrc: string;

  /**
   * Image alt
   */
  imageAlt?: string;

  /**
   * Title
   */
  title?: string;

  /**
   * Text to display
   */
  text?: string;

  /**
   * Optional class for styling purpose
   */
  className?: string;
}

const EmptyScreen = ({
  imageSrc,
  imageAlt = "",
  title,
  text,
  className,
}: EmptyScreenProps) => {
  const textClass = clsx("text", className);
  return (
    <div className="emptyscreen">
      {imageSrc && (
        <div className="emptyscreen-image mb-12">
          <img
            className="mx-auto"
            src={imageSrc}
            alt={imageAlt}
            width="250"
            height="250"
          />
        </div>
      )}

      {title && (
        <Heading level="h2" headingStyle="h2" className="text-secondary mb-8">
          {title}
        </Heading>
      )}
      {text && <div className={textClass}>{text}</div>}
    </div>
  );
};

EmptyScreen.displayName = "EmptyScreen";

export default EmptyScreen;
