import { Meta, StoryObj } from '@storybook/react';

import { useRef } from 'react';

import { Button } from '../../../components';
import MediaLibrary, {
  MediaLibraryProps,
  MediaLibraryRef,
  MediaLibraryResult,
  MediaLibraryType,
} from './MediaLibrary';

const meta: Meta<typeof MediaLibrary> = {
  title: 'Modules/Multimedia/MediaLibrary',
  component: MediaLibrary,
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            height: '40rem',
            display: 'grid',
            placeItems: 'center',
            marginBottom: '10em',
          }}
          className="position-relative"
        >
          <Story />
        </div>
      );
    },
  ],
};
export default meta;

type Story = StoryObj<typeof MediaLibrary>;

const code = (
  type: string,
) => `const mediaLibraryRef = useRef<MediaLibraryRef>(null);
return (
  <>
    <Button
      onClick={() => {
        mediaLibraryRef.current?.show('${type}');
      }}
    >
      Open Media Library
    </Button>
    <MediaLibrary
      {...args}
      ref={mediaLibraryRef} // pass the ref
      onCancel={() => mediaLibraryRef.current?.hide()} // handle the cancel event
      onSuccess={(result: MediaLibraryResult) => {}} // handle the result
    />
  </>
)`;

const renderMediaLibrary = (
  args: MediaLibraryProps,
  type: MediaLibraryType,
) => {
  const mediaLibraryRef = useRef<MediaLibraryRef>(null);
  return (
    <>
      <Button
        onClick={() => {
          mediaLibraryRef.current?.show(type);
        }}
      >
        Open Media Library
      </Button>
      <MediaLibrary
        {...args}
        ref={mediaLibraryRef}
        onCancel={() => mediaLibraryRef.current?.hide()}
        onSuccess={(result: MediaLibraryResult) => {
          const text = Array.isArray(result)
            ? `${result.length} elements selected`
            : 'a link is ready';
          alert(`Success 👍 : ${text}`);
        }}
      />
    </>
  );
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: Story = {
  render: (args) => renderMediaLibrary(args, 'audio'),
  parameters: {
    docs: {
      source: {
        code: code('audio'),
      },
    },
  },
};

export const Audio: Story = {
  render: (args) => renderMediaLibrary(args, 'audio'),
  parameters: {
    docs: {
      description: {
        story: 'Use to choose or capture an audio file.',
      },
      source: {
        code: code('audio'),
      },
    },
  },
};
export const Video: Story = {
  render: (args) => renderMediaLibrary(args, 'video'),
  parameters: {
    docs: {
      description: {
        story: 'Use to choose, embed or capture a video.',
      },
      source: {
        code: code('video'),
      },
    },
  },
};

export const Image: Story = {
  render: (args) => renderMediaLibrary(args, 'image'),
  parameters: {
    docs: {
      description: {
        story: 'Use to choose an image.',
      },
      source: {
        code: code('image'),
      },
    },
  },
};

export const Attachment: Story = {
  render: (args) => renderMediaLibrary(args, 'attachment'),
  parameters: {
    docs: {
      description: {
        story: 'Use to choose and attach a media file.',
      },
      source: {
        code: code('attachment'),
      },
    },
  },
};

export const Embedder: Story = {
  render: (args) => renderMediaLibrary(args, 'embedder'),
  parameters: {
    docs: {
      description: {
        story: 'Use to embed an external.',
      },
      source: {
        code: code('embedder'),
      },
    },
  },
};

export const Linker: Story = {
  render: (args) => renderMediaLibrary(args, 'hyperlink'),
  parameters: {
    docs: {
      description: {
        story: 'Use to link an internal resource, or an external website.',
      },
      source: {
        code: code('hyperlink'),
      },
    },
  },
};

/**
 * Studio story showcasing both audio and video capture capabilities
 */
export const Studio: Story = {
  render: (args) => renderMediaLibrary(args, 'studio'),
  parameters: {
    docs: {
      description: {
        story:
          'Use to record audio or video content in a single interface. Perfect for creating multimedia content directly within the app.',
      },
      source: {
        code: code('studio'),
      },
    },
  },
};
