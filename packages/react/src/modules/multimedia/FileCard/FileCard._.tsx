import { Meta, StoryObj } from '@storybook/react';

import FileCard from './FileCard';

const meta: Meta<typeof FileCard> = {
  title: 'Components/Card/File Card',
  component: FileCard,
  args: {
    isSelectable: false,
    isClickable: true,
    isSelected: false,
    doc: {
      _id: '1',
      name: "File's name",
      eType: 'file',
      eParent: '',
      _isShared: false,
      _shared: [],
      children: null!,
      created: null as any,
      owner: null as any,
      ownerName: 'Tom mate',
    },
  },
  decorators: [(Story) => <div style={{ width: '16rem' }}>{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof FileCard>;

export const Base: Story = {
  render: (args) => {
    return <FileCard {...args} />;
  },
};

export const AudioFile: Story = {
  render: (args) => {
    return <FileCard {...args} />;
  },
  args: {
    ...Base.args,
    doc: {
      _id: '1',
      name: "File's name",
      eType: 'file',
      eParent: '',
      _isShared: false,
      _shared: [],
      children: null!,
      created: null as any,
      owner: null as any,
      ownerName: 'Tom mate',
      metadata: {
        'content-type': 'audio/mp3',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Formats supported: mp3, wav, ...',
      },
    },
  },
};

export const ImageFile: Story = {
  render: (args) => {
    return <FileCard {...args} />;
  },
  args: {
    ...Base.args,
    doc: {
      _id: '1',
      name: "File's name",
      eType: 'file',
      eParent: '',
      _isShared: false,
      _shared: [],
      children: null!,
      created: null as any,
      owner: null as any,
      ownerName: 'Tom mate',
      metadata: {
        'content-type': 'image/png',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Formats supported: png, jpg, svg, tiff, ...',
      },
    },
  },
};

export const VideoFile: Story = {
  render: (args) => {
    return <FileCard {...args} />;
  },
  args: {
    ...Base.args,
    doc: {
      _id: '1',
      name: "File's name",
      eType: 'file',
      eParent: '',
      _isShared: false,
      _shared: [],
      children: null!,
      created: null as any,
      owner: null as any,
      ownerName: 'Tom mate',
      metadata: {
        'content-type': 'video/mp4',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Formats supported: mp4, avi, mov, webm ...',
      },
    },
  },
};

export const TextFile: Story = {
  render: (args) => {
    return <FileCard {...args} />;
  },
  args: {
    ...Base.args,
    doc: {
      _id: '1',
      name: "File's name",
      eType: 'file',
      eParent: '',
      _isShared: false,
      _shared: [],
      children: null!,
      created: null as any,
      owner: null as any,
      ownerName: 'Tom mate',
      metadata: {
        'content-type': 'text/plain',
      },
    },
  },
};

export const DocFile: Story = {
  render: (args) => {
    return <FileCard {...args} />;
  },
  args: {
    ...Base.args,
    doc: {
      _id: '1',
      name: "File's name",
      eType: 'file',
      eParent: '',
      _isShared: false,
      _shared: [],
      children: null!,
      created: null as any,
      owner: null as any,
      ownerName: 'Tom mate',
      metadata: {
        'content-type': 'application/msword',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Formats supported: dot, docx, dotx, docm, dotm, odt, ott, oth, odm',
      },
    },
  },
};
export const PptFile: Story = {
  render: (args) => {
    return <FileCard {...args} />;
  },
  args: {
    ...Base.args,
    doc: {
      _id: '1',
      name: "File's name",
      eType: 'file',
      eParent: '',
      _isShared: false,
      _shared: [],
      children: null!,
      created: null as any,
      owner: null as any,
      ownerName: 'Tom mate',
      metadata: {
        'content-type': 'application/vnd.ms-powerpoint',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Formats supported: ppt, pot, pps, ppa, pptx, potx, ppsx, ppam, pptm, potm, ppsm, odp, otp',
      },
    },
  },
};

export const PdfFile: Story = {
  render: (args) => {
    return <FileCard {...args} />;
  },
  args: {
    ...Base.args,
    doc: {
      _id: '1',
      name: "File's name",
      eType: 'file',
      eParent: '',
      _isShared: false,
      _shared: [],
      children: null!,
      created: null as any,
      owner: null as any,
      ownerName: 'Tom mate',
      metadata: {
        'content-type': 'application/pdf',
      },
    },
  },
};

export const ZipFile: Story = {
  render: (args) => {
    return <FileCard {...args} />;
  },
  args: {
    ...Base.args,
    doc: {
      _id: '1',
      name: "File's name",
      eType: 'file',
      eParent: '',
      _isShared: false,
      _shared: [],
      children: null!,
      created: null as any,
      owner: null as any,
      ownerName: 'Tom mate',
      metadata: {
        'content-type': 'application/zip',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Formats supported: zip, rar, tar, 7z',
      },
    },
  },
};

export const CsvFile: Story = {
  render: (args) => {
    return <FileCard {...args} />;
  },
  args: {
    ...Base.args,
    doc: {
      _id: '1',
      name: "File's name",
      eType: 'file',
      eParent: '',
      _isShared: false,
      _shared: [],
      children: null!,
      created: null as any,
      owner: null as any,
      ownerName: 'Tom mate',
      metadata: {
        'content-type': 'text/csv',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Formats supported: csv',
      },
    },
  },
};

export const XlsFile: Story = {
  render: (args) => {
    return <FileCard {...args} />;
  },
  args: {
    ...Base.args,
    doc: {
      _id: '1',
      name: "File's name",
      eType: 'file',
      eParent: '',
      _isShared: false,
      _shared: [],
      children: null!,
      created: null as any,
      owner: null as any,
      ownerName: 'Tom mate',
      metadata: {
        'content-type': 'application/vnd.ms-excel',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Formats supported: xls, xlt, xla, xlsx, xltx, xlsm, xltm, xlam, xlsb, ods, ots',
      },
    },
  },
};

export const MdFile: Story = {
  render: (args) => {
    return <FileCard {...args} />;
  },
  args: {
    ...Base.args,
    doc: {
      _id: '1',
      name: "File's name",
      eType: 'file',
      eParent: '',
      _isShared: false,
      _shared: [],
      children: null!,
      created: null as any,
      owner: null as any,
      ownerName: 'Tom mate',
      metadata: {
        'content-type': 'text/markdown',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Formats supported: md',
      },
    },
  },
};
