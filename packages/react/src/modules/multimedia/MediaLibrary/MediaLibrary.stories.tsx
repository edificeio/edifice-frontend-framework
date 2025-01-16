import { Meta, StoryObj } from '@storybook/react';

import { useRef } from 'react';

import { Button } from '../../../components';
import MediaLibrary, {
  MediaLibraryRef,
  MediaLibraryResult,
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

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: Story = {
  render: (args) => {
    const mediaLibraryRef = useRef<MediaLibraryRef>(null);
    return (
      <>
        <Button
          onClick={() => {
            mediaLibraryRef.current?.show('audio');
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
  },
};
export const Audio: Story = {
  render: (args) => {
    const mediaLibraryRef = useRef<MediaLibraryRef>(null);
    return (
      <>
        <Button
          onClick={() => {
            mediaLibraryRef.current?.show('audio');
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
  },
  parameters: {
    docs: {
      description: {
        story: 'Use to choose or capture an audio file.',
      },
    },
  },
};
export const Video: Story = {
  render: (args) => {
    const mediaLibraryRef = useRef<MediaLibraryRef>(null);
    return (
      <>
        <Button
          onClick={() => {
            mediaLibraryRef.current?.show('video');
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
  },
  parameters: {
    docs: {
      description: {
        story: 'Use to choose, embed or capture a video.',
      },
    },
  },
};

export const Image: Story = {
  render: (args) => {
    const mediaLibraryRef = useRef<MediaLibraryRef>(null);
    return (
      <>
        <Button
          onClick={() => {
            mediaLibraryRef.current?.show('image');
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
  },
  parameters: {
    docs: {
      description: {
        story: 'Use to choose an image.',
      },
    },
  },
};

export const Attachment: Story = {
  render: (args) => {
    const mediaLibraryRef = useRef<MediaLibraryRef>(null);
    return (
      <>
        <Button
          onClick={() => {
            mediaLibraryRef.current?.show('attachment');
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
  },
  parameters: {
    docs: {
      description: {
        story: 'Use to choose and attach a media file.',
      },
    },
  },
};

export const Embedder: Story = {
  render: (args) => {
    const mediaLibraryRef = useRef<MediaLibraryRef>(null);
    return (
      <>
        <Button
          onClick={() => {
            mediaLibraryRef.current?.show('embedder');
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
  },
  parameters: {
    docs: {
      description: {
        story: 'Use to embed an external.',
      },
    },
  },
};

export const Linker: Story = {
  render: (args) => {
    const mediaLibraryRef = useRef<MediaLibraryRef>(null);
    return (
      <>
        <Button
          onClick={() => {
            mediaLibraryRef.current?.show('hyperlink');
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
  },
  parameters: {
    docs: {
      description: {
        story: 'Use to link an internal resource, or an external website.',
      },
    },
  },
};
