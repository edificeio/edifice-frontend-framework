import { Meta, StoryObj } from "@storybook/react";
import useHover from "./useHover";
import docs from "./useHover.mdx";
import Button from "../../components/Button/Button";

const meta: Meta<typeof useHover> = {
  title: "Hooks/useHover",
  parameters: {
    docs: { page: docs },
  },
};

export default meta;
type Story = StoryObj<typeof useHover>;

export const Example: Story = {
  render: (args) => {
    const [ref, isHovered] = useHover<HTMLButtonElement>();
    return (
      <>
        <Button ref={ref}>Hover Me!</Button>
        <div>{isHovered ? "😀" : "😭"}</div>
      </>
    );
  },
};
