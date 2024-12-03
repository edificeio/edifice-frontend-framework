import { StringUtils } from "@edifice.io/utilities";
import clsx from "clsx";
import { Button } from "../../components";
import { IconSee } from "../icons/components";

export interface ViewsCounterProps {
  viewsCounter: number;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const ViewsCounter = ({
  viewsCounter,
  onClick,
  className,
}: ViewsCounterProps) => {
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onClick?.();
  };

  className = clsx("text-gray-700 fw-normal py-4 px-8 btn-icon", className);

  return (
    <Button
      rightIcon={<IconSee />}
      variant="ghost"
      type="button"
      className={className}
      onClick={handleButtonClick}
      disabled={!viewsCounter}
    >
      {StringUtils.toCounter(viewsCounter)}
    </Button>
  );
};

ViewsCounter.displayName = "ViewsCounter";

export default ViewsCounter;
