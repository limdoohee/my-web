import type { Meta, StoryObj } from "@storybook/react";
import Carousel from "../app/component/ui/Carousel";

const meta = {
  title: "Example/Carousel",
  component: Carousel,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Progress: Story = {
  args: {
    pause: false,
  },
};
