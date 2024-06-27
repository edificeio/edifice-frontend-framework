import { See } from "@edifice-ui/icons";
import { Button } from "../Button";

export interface ViewsCounterProps {
  viewsCounter: number;
  onClick?: () => void;
}

const ViewsCounter = ({ viewsCounter, onClick }: ViewsCounterProps) => {
  return (
    <Button
      rightIcon={<See />}
      variant="ghost"
      type="button"
      className="text-gray-700 d-flex"
      onClick={onClick}
    >
      {viewsCounter}
    </Button>
  );
};

ViewsCounter.displayName = "ViewsCounter";

export default ViewsCounter;