import { Meta, StoryObj } from '@storybook/react';
import AppIcon, { AppIconProps } from './AppIcon';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof AppIcon> = {
  title: 'Components/AppIcon',
  component: AppIcon,
  parameters: {
    docs: {
      description: {
        component:
          "AppIcon is a component that displays an application's icon image. It supports different sizes and variants (square, rounded, circle) and can control how the icon image fits within its container (contain or ratio). This component is commonly used throughout the application to provide consistent icon display.",
      },
    },
  },
  args: {
    size: '40',
  },
  argTypes: {
    app: {
      control: { type: 'select' },
      options: [
        'blog',
        'conversation',
        'collaborative-wall',
        'wiki',
        'scrapbook',
        'placeholder',
        'mindmap',
        'workspace',
      ],
      mapping: {
        'blog': { icon: 'blog', displayName: 'Blog' },

        'collaborative-wall': {
          icon: 'collaborative-wall',
          displayName: 'Collaborative Wall',
        },
        'conversation': { icon: 'conversation', displayName: 'Conversation' },
        'mindmap': { icon: 'mindmap', displayName: 'Mindmap' },
        'placeholder': { icon: 'placeholder', displayName: 'Placeholder' },
        'scrap-book': { icon: 'scrapbook', displayName: 'Scrapbook' },
        'wiki': { icon: 'wiki', displayName: 'Wiki' },
        'workspace': { icon: 'workspace', displayName: 'Workspace' },
      },
    },
    variant: {
      options: ['square', 'rounded', 'circle'],
      control: { type: 'inline-radio' },
    },
    iconFit: {
      options: ['contain', 'ratio'],
      control: { type: 'inline-radio' },
    },
    size: {
      options: ['24', '40', '48', '80', '160'],
      control: { type: 'inline-radio' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppIcon>;

export const Base: Story = {};

export const AppIconSizes: Story = {
  render: (args: AppIconProps) => {
    return (
      <div className="d-flex align-items-center gap-8">
        <AppIcon app={args.app} size="24" />
        <AppIcon app={args.app} size="40" />
        <AppIcon app={args.app} size="48" />
        <AppIcon app={args.app} size="80" />
        <AppIcon app={args.app} size="160" />
      </div>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          'App icon can take different size with the `size` prop attribute.',
      },
    },
  },
};

export const AppIconAsImage: Story = {
  args: {
    app: {
      address: '/form',
      icon: 'https://ent.l-educdenormandie.fr/formulaire/public/img/logo.svg',
      name: 'Formulaire',
      scope: [],
      display: false,
      displayName: '',
      isExternal: false,
    },
  },

  parameters: {
    docs: {
      description: {
        story:
          'If the `icon` property is a `url`, AppIcon displays the image instead of an svg icon.',
      },
    },
  },
};

export const AppIconImageSizes: Story = {
  render: (args: AppIconProps) => {
    return (
      <div className="d-flex align-items-center gap-8">
        <AppIcon app={args.app} size="24" />
        <AppIcon app={args.app} size="40" />
        <AppIcon app={args.app} size="48" />
        <AppIcon app={args.app} size="80" />
        <AppIcon app={args.app} size="160" />
      </div>
    );
  },

  args: {
    app: {
      address: '/form',
      icon: 'https://ent.l-educdenormandie.fr/formulaire/public/img/logo.svg',
      name: 'Formulaire',
      scope: [],
      display: false,
      displayName: '',
      isExternal: false,
    },
  },

  parameters: {
    docs: {
      description: {
        story:
          'Like the default AppIcon, the `size` prop attribute works on image too.',
      },
    },
  },
};

export const AppIconWithRatio: Story = {
  args: {
    app: {
      icon: 'blog',
      address: '',
      display: false,
      displayName: '',
      isExternal: false,
      name: 'Blog',
      scope: [],
    },
    iconFit: 'ratio',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Using the `iconFit` attribute with the `ratio` value will give a `backgroundColor` and some `padding` to the AppIcon. Default value is `contain`',
      },
    },
  },
};

export const AppIconRatioSizes: Story = {
  render: (args: AppIconProps) => {
    return (
      <div className="d-flex align-items-center gap-8">
        <AppIcon app={args.app} size="24" variant="square" iconFit="ratio" />
        <AppIcon app={args.app} size="40" variant="square" iconFit="ratio" />
        <AppIcon app={args.app} size="48" variant="square" iconFit="ratio" />
        <AppIcon app={args.app} size="80" variant="square" iconFit="ratio" />
        <AppIcon app={args.app} size="160" variant="square" iconFit="ratio" />
      </div>
    );
  },

  args: {
    iconFit: 'ratio',
    variant: 'rounded',
  },
};

export const AppIconCircle: Story = {
  args: {
    app: {
      icon: 'blog',
      address: '',
      display: false,
      displayName: '',
      isExternal: false,
      name: 'Blog',
      scope: [],
    },
    iconFit: 'ratio',
    variant: 'circle',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Using the `variant` attribute with the `circle` value will change the shape of AppIcon. Default value is `square`',
      },
    },
  },
};

export const AppIconCircleSizes: Story = {
  render: (args: AppIconProps) => {
    return (
      <div className="d-flex align-items-center gap-8">
        <AppIcon app={args.app} size="24" iconFit="ratio" variant="circle" />
        <AppIcon app={args.app} size="40" iconFit="ratio" variant="circle" />
        <AppIcon app={args.app} size="48" iconFit="ratio" variant="circle" />
        <AppIcon app={args.app} size="80" iconFit="ratio" variant="circle" />
        <AppIcon app={args.app} size="160" iconFit="ratio" variant="circle" />
      </div>
    );
  },
};

export const AppIconRounded: Story = {
  args: {
    app: {
      icon: 'blog',
      address: '',
      display: false,
      displayName: '',
      isExternal: false,
      name: 'Blog',
      scope: [],
    },
    iconFit: 'ratio',
    variant: 'rounded',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Using the `variant` attribute with the `rounded` value will change the shape of AppIcon. Default value is `square`',
      },
    },
  },
};

export const AppIconRoundedSizes: Story = {
  render: (args: AppIconProps) => {
    return (
      <div className="d-flex align-items-center gap-8">
        <AppIcon app={args.app} size="24" iconFit="ratio" variant="rounded" />
        <AppIcon app={args.app} size="40" iconFit="ratio" variant="rounded" />
        <AppIcon app={args.app} size="48" iconFit="ratio" variant="rounded" />
        <AppIcon app={args.app} size="80" iconFit="ratio" variant="rounded" />
        <AppIcon app={args.app} size="160" iconFit="ratio" variant="rounded" />
      </div>
    );
  },

  args: {
    app: {
      icon: 'blog',
      address: '',
      display: false,
      displayName: '',
      isExternal: false,
      name: 'Blog',
      scope: [],
    },
  },
};
