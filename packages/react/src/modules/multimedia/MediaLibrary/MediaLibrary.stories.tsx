import { Meta, StoryObj } from "@storybook/react";

import { WorkspaceElement } from "@edifice.io/ts-client";
import { useRef } from "react";

import { Button } from "../../../components";
import { MockedDataProvider } from "../../../providers/MockedDataProvider";
import MediaLibrary, {
  MediaLibraryProps,
  MediaLibraryRef,
  MediaLibraryResult,
  MediaLibraryType,
} from "./MediaLibrary";

const mockedDocuments: WorkspaceElement[] = [
  {
    _id: "folder1",
    name: "level 1 arborescence tree",
    eType: "folder",
    eParent: "",
    _isShared: false,
    _shared: [],
    children: null!,
    created: null as any,
    owner: null as any,
    ownerName: "Tom Mate",
  },
  {
    _id: "folder2",
    name: "level 1 arborescence tree",
    eType: "folder",
    eParent: "",
    _isShared: false,
    _shared: [],
    children: null!,
    created: null as any,
    owner: null as any,
  },
  {
    _id: "file1",
    name: "mp3 audio file",
    eType: "file",
    eParent: "",
    _isShared: false,
    _shared: [],
    children: null!,
    created: null as any,
    owner: null as any,
    metadata: {
      "content-type": "audio/mp3",
    },
  },
  {
    _id: "file2",
    name: "mp4 video file",
    eType: "file",
    eParent: "",
    _isShared: false,
    _shared: [],
    children: null!,
    created: null as any,
    owner: null as any,
    metadata: {
      "content-type": "video/mp4",
    },
  },
  {
    _id: "file4",
    name: "File 4",
    eType: "file",
    eParent: "",
    _isShared: false,
    _shared: [],
    children: null!,
    created: null as any,
    owner: null as any,
    metadata: {
      "content-type": "audio/ogg",
    },
  },
  {
    _id: "file3",
    name: "File 3",
    eType: "file",
    eParent: "",
    _isShared: false,
    _shared: [],
    children: null!,
    created: null as any,
    owner: null as any,
    metadata: {
      "content-type": "text/plain",
    },
  },
];

const meta: Meta<typeof MediaLibrary> = {
  title: "Modules/Multimedia/MediaLibrary",
  component: MediaLibrary,
  args: {
    type: null,
  } as MediaLibraryProps & { type: MediaLibraryType | null },
  argTypes: {
    type: {
      options: [
        "audio",
        "video",
        "image",
        "attachment",
        "embedder",
        "hyperlink",
      ],
      control: { type: "select" },
    },
  },
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            height: "40rem",
            display: "grid",
            placeItems: "center",
            marginBottom: "10em",
          }}
          className="position-relative"
        >
          <Story />
        </div>
      );
    },
  ],
  render: (args: MediaLibraryProps) => {
    const mediaLibraryRef = useRef<MediaLibraryRef>(null);

    args.onCancel = () => mediaLibraryRef.current?.hide();
    args.onSuccess = (result: MediaLibraryResult) => {
      const text = Array.isArray(result)
        ? `${result.length} elements selected`
        : "a link is ready";
      alert(`Success 👍 : ${text}`);
    };

    return (
      <MockedDataProvider
        mocks={{
          workflows: [
            "org.entcore.workspace.controllers.WorkspaceController|listDocuments",
            "org.entcore.workspace.controllers.WorkspaceController|listFolders",
            "org.entcore.workspace.controllers.WorkspaceController|addDocument",
          ],
          workspaceDocuments: mockedDocuments,
        }}
      >
        <Button
          onClick={() => {
            mediaLibraryRef.current?.show(args.type);
          }}
        >
          Open Media Library
        </Button>

        {<MediaLibrary ref={mediaLibraryRef} {...args} />}
      </MockedDataProvider>
    );
  },
};

export default meta;

type Story = StoryObj<typeof MediaLibrary>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: Story = {
  args: {
    type: "audio",
  },
  parameters: {
    docs: {
      description: {
        story: "Use to choose or capture an audio file.",
      },
    },
  },
};
export const Audio: Story = {
  args: {
    type: "audio",
  },
  parameters: {
    docs: {
      description: {
        story: "Use to choose or capture an audio file.",
      },
    },
  },
};
export const Video: Story = {
  args: {
    type: "video",
  },
  parameters: {
    docs: {
      description: {
        story: "Use to choose, embed or capture a video.",
      },
    },
  },
};

export const Image: Story = {
  args: {
    type: "image",
  },
  parameters: {
    docs: {
      description: {
        story: "Use to choose an image.",
      },
    },
  },
};

export const Attachment: Story = {
  args: {
    type: "attachment",
  },
  parameters: {
    docs: {
      description: {
        story: "Use to choose and attach a media file.",
      },
    },
  },
};

export const Embedder: Story = {
  args: {
    type: "embedder",
  },
  parameters: {
    docs: {
      description: {
        story: "Use to embed an external.",
      },
    },
  },
};

export const Linker: Story = {
  args: {
    type: "hyperlink",
  },
  parameters: {
    docs: {
      description: {
        story: "Use to link an internal resource, or an external website.",
      },
    },
  },
};
