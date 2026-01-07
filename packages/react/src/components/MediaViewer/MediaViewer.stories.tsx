import { Meta, StoryObj } from '@storybook/react';
import MediaViewer from './MediaViewer';
import { Button } from '../Button';
import { useState } from 'react';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof MediaViewer> = {
  title: 'Components/MediaViewer',
  component: MediaViewer,
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            height: '90rem',
          }}
          className="position-relative"
        >
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    docs: {
      description: {
        component:
          'MediaViewer is a modal component that allows users to preview and interact with various types of media, including images, videos, audio files, attachments, and hyperlinks.',
      },
    },
  },
} as Meta<typeof MediaViewer>;

export default meta;
type Story = StoryObj<typeof MediaViewer>;

const renderMediaViewer = (args: any) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setVisible(true);
        }}
      >
        Open Media Viewer
      </Button>
      {visible && <MediaViewer onClose={() => setVisible(false)} {...args} />}
    </>
  );
};

export const Base: Story = {
  render: (args) => renderMediaViewer(args),
  args: {
    media: [
      {
        name: 'Sample Media 1',
        url: 'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
        type: 'image',
      },
      {
        name: 'Sample Media 2',
        url: 'https://media.istockphoto.com/id/1140675444/fr/vid%C3%A9o/jeune-surfeur-d%C3%A9chirant-le-virage-noueux.mp4?s=mp4-640x640-is&k=20&c=gBihVWkndcBi8PdvYG20MyBSiQTma54j0Ii19hfzWAI=',
        type: 'video',
      },
      {
        name: 'Sample Media 3',
        url: 'https://media.istockphoto.com/id/2163882645/fr/photo/ancienne-cl%C3%B4ture-de-ferme-dans-un-enclos-de-ferme-en-hiver.jpg?s=2048x2048&w=is&k=20&c=6wa7mnPe0JXGoEqcLGsBC3kjG9puutGn4AC59ExqVvE=',
        type: 'audio',
      },
      {
        name: 'Sample Media 4',
        url: 'https://media.istockphoto.com/id/2152573706/fr/photo/%C3%A9chelle-rouge-sur-fond-bleu.jpg?s=2048x2048&w=is&k=20&c=wY3ehasVqp9QpixyULgtOyuc0KSLcXCgzWZ15_NomQY=',
        type: 'attachment',
      },
    ],
  },
};

export const ImageViewer: Story = {
  render: (args) => renderMediaViewer(args),
  args: {
    media: [
      {
        name: 'Sample Media 1',
        url: 'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
        type: 'image',
      },
      {
        name: 'Sample Media 2',
        url: 'https://media.istockphoto.com/id/2168393347/fr/photo/voiture-voyageant-%C3%A0-travers-la-for%C3%AAt-dhiver-laponie-finlandaise-finlande.jpg?s=2048x2048&w=is&k=20&c=29c_aKBTRfGlYxMnvCfiyMVLNtG_UAPs5GxJF57qhKo=',
        type: 'image',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the MediaViewer with only images. Allows users to preview multiple images in a modal.',
      },
    },
  },
};

export const VideoViewer: Story = {
  render: (args) => renderMediaViewer(args),
  args: {
    media: [
      {
        name: 'Sample Media 1',
        url: 'https://media.istockphoto.com/id/1140675444/fr/vid%C3%A9o/jeune-surfeur-d%C3%A9chirant-le-virage-noueux.mp4?s=mp4-640x640-is&k=20&c=gBihVWkndcBi8PdvYG20MyBSiQTma54j0Ii19hfzWAI=',
        type: 'video',
      },
      {
        name: 'Sample Media 2',
        url: 'https://media.istockphoto.com/id/2152844460/fr/vid%C3%A9o/vue-a%C3%A9rienne-magnifique-arc-en-ciel-apr%C3%A8s-un-orage-sur-la-for%C3%AAt.mp4?s=mp4-640x640-is&k=20&c=CpJlUUingaI5gVpqoAk6KWc-ocIIuQH0iFWkg1Pf5_Q=',
        type: 'video',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the MediaViewer with only videos. Users can play and preview video files in a modal.',
      },
    },
  },
};

export const AudioViewer: Story = {
  render: (args) => renderMediaViewer(args),
  args: {
    media: [
      {
        name: 'Sample Media 1',
        url: 'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
        type: 'audio',
      },
      {
        name: 'Sample Media 2',
        url: 'https://media.istockphoto.com/id/2168393347/fr/photo/voiture-voyageant-%C3%A0-travers-la-for%C3%AAt-dhiver-laponie-finlandaise-finlande.jpg?s=2048x2048&w=is&k=20&c=29c_aKBTRfGlYxMnvCfiyMVLNtG_UAPs5GxJF57qhKo=',
        type: 'audio',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the MediaViewer with only audio files. Users can listen to audio tracks in a modal interface.',
      },
    },
  },
};

export const LinkViewer: Story = {
  render: (args) => renderMediaViewer(args),
  args: {
    media: [
      {
        name: 'Sample Media 1',
        url: 'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
        type: 'attachment',
      },
      {
        name: 'Sample Media 2',
        url: 'https://media.istockphoto.com/id/2168393347/fr/photo/voiture-voyageant-%C3%A0-travers-la-for%C3%AAt-dhiver-laponie-finlandaise-finlande.jpg?s=2048x2048&w=is&k=20&c=29c_aKBTRfGlYxMnvCfiyMVLNtG_UAPs5GxJF57qhKo=',
        type: 'hyperlink',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the MediaViewer with attachments and hyperlinks. Useful for previewing files and external links.',
      },
    },
  },
};
