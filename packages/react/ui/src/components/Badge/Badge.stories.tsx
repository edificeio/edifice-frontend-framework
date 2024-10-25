import { Meta, StoryObj } from "@storybook/react";

import Badge, { BadgeProps } from "./Badge";
import { Hourglass } from "@edifice-ui/icons";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Badge> = {
  title: "Components/Badges/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: [
        "notification / warning",
        "notification / danger",
        "notification / info",
        "notification / warning / text",
        "notification / danger / text",
        "notification / info / text",
        "profile / student",
        "profile / teacher",
        "profile / relative",
        "profile / personnel",
      ],
      mapping: {
        "notification / warning": { type: "notification", level: "warning" },
        "notification / danger": { type: "notification", level: "danger" },
        "notification / info": { type: "notification", level: "info" },
        "notification / warning / text": {
          type: "notification",
          level: "warning",
          color: "text",
        },
        "notification / danger / text": {
          type: "notification",
          level: "danger",
          color: "text",
        },
        "notification / info / text": {
          type: "notification",
          level: "info",
          color: "text",
        },
        "profile / student": { type: "profile", profile: "student" },
        "profile / teacher": { type: "profile", profile: "teacher" },
        "profile / relative": { type: "profile", profile: "relative" },
        "profile / personnel": { type: "profile", profile: "personnel" },
      },
    },
  },
  args: {
    children: "999+",
    variant: { type: "notification", level: "warning" },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Base: Story = {
  args: {
    children: "999+",
    variant: { type: "notification", level: "danger" },
  },
};

export const VisibilityOption: Story = {
  args: {
    variant: { type: "notification", level: "warning" },
    visibility: "always",
    children: undefined,
  },
  render: (args: BadgeProps) => {
    return (
      <p>
        This badge is always visible. <Badge {...args}></Badge>
      </p>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'An empty badge is hidden by default. Set its `visibility` to `"always"` to show it anyway.',
      },
    },
  },
};

export const NotificationTextInfoBadge: Story = {
  args: {
    variant: { type: "notification", level: "info", color: "text" },
  },

  render: (args: BadgeProps) => {
    return (
      <p>
        Titre du billet <Badge {...args}>Brouillon</Badge>
      </p>
    );
  },
};

export const StudentProfileBadge: Story = {
  args: {
    variant: { type: "profile", profile: "student" },
  },

  render: (args: BadgeProps) => {
    return (
      <p>
        Hello, i am a <Badge {...args}>student</Badge> badge.
      </p>
    );
  },
};

export const TeacherProfileBadge: Story = {
  args: {
    variant: { type: "profile", profile: "teacher" },
  },

  render: (args: BadgeProps) => {
    return (
      <p>
        Hello, i am a <Badge {...args}>teacher</Badge> badge.
      </p>
    );
  },
};

export const RelativeProfileBadge: Story = {
  args: {
    variant: { type: "profile", profile: "relative" },
  },

  render: (args: BadgeProps) => {
    return (
      <p>
        Hello, i am a <Badge {...args}>relative</Badge> badge.
      </p>
    );
  },
};

export const PersonnelProfileBadge: Story = {
  args: {
    variant: { type: "profile", profile: "personnel" },
  },

  render: (args: BadgeProps) => {
    return (
      <p>
        Hello, i am a <Badge {...args}>personnel</Badge> badge.
      </p>
    );
  },
};

export const BadgeWithIcon: Story = {
  args: {
    variant: { type: "link" },
  },

  render: (args: BadgeProps) => {
    return (
      <Badge {...args}>
        <Hourglass width="20" height="20" className="me-8" />
        An history of time
      </Badge>
    );
  },
};
