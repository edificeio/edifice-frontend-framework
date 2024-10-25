import useScrollToTop from "./useScrollToTop";
import { Meta, StoryObj } from "@storybook/react";
import docs from "./useScrollToTop.mdx";
import Button from "../../components/Button/Button";

const meta: Meta<typeof useScrollToTop> = {
  title: "Hooks/useScrollToTop",
  parameters: {
    docs: { page: docs },
  },
};

export default meta;
type Story = StoryObj<typeof useScrollToTop>;

export const Example: Story = {
  render: (args) => {
    const scrollTotop = useScrollToTop();
    return (
      <>
        <Button color="primary" variant="filled" onClick={scrollTotop}>
          Go to Top
        </Button>
        <div style={{ height: 300 }}></div>
      </>
    );
  },
};
