import { Meta, StoryObj } from '@storybook/react';
import { RefAttributes } from 'react';
import { Dropdown, IconButton, IconButtonProps, Toolbar } from '..';
import {
  IconAlignLeft,
  IconBulletList,
  IconLandscape,
  IconLink,
  IconMic,
  IconPaperclip,
  IconRecordVideo,
  IconSmiley,
  IconTextBold,
  IconTextColor,
  IconTextHighlight,
  IconTextItalic,
  IconTextSize,
  IconTextTypo,
  IconTextUnderline,
} from '../../modules/icons/components';

const meta: Meta<typeof Toolbar> = {
  title: 'Modules/Editor/EditorToolbar',
  component: Toolbar,
  parameters: {
    docs: {
      description: {
        component:
          'EditorToolbar component allows you to create a customizable toolbar for a text editor with various items such as icons and dropdowns. Each item can have its own properties and actions, and the toolbar can be aligned in different ways.',
      },
    },
  },
  argTypes: {
    variant: {
      options: ['default', 'no-shadow'],
      control: { type: 'select' },
    },
    isBlock: { control: 'boolean' },
    align: {
      options: ['left', 'center', 'space', 'right'],
      control: { type: 'select' },
    },
  },
  args: {
    items: [
      {
        type: 'icon',
        props: {
          'icon': <IconLandscape />,
          'className': 'bg-green-200',
          'aria-label': 'Insérer une image',
          'onClick': () => {},
        },
        name: 'image',
      },
      {
        type: 'icon',
        props: {
          'icon': <IconRecordVideo />,
          'className': 'bg-purple-200',
          'aria-label': 'Insérer une vidéo',
          'onClick': () => {},
        },
        name: 'video',
      },
      {
        type: 'icon',
        props: {
          'icon': <IconMic />,
          'className': 'bg-red-200',
          'aria-label': 'Insérer une piste audio',
          'onClick': () => {},
        },
        name: 'audio',
      },
      {
        type: 'icon',
        props: {
          'icon': <IconPaperclip />,
          'className': 'bg-yellow-200',
          'aria-label': 'Insérer une pièce jointe',
          'onClick': () => {},
        },
        name: 'attachment',
      },
      {
        type: 'divider',
        name: 'div-1',
      },
      {
        type: 'dropdown',
        props: {
          children: (
            triggerProps: JSX.IntrinsicAttributes &
              Omit<IconButtonProps, 'ref'> &
              RefAttributes<HTMLButtonElement>,
          ) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                variant="ghost"
                color="tertiary"
                icon={<IconTextTypo />}
                aria-label={'Choix de la famille de typographie'}
                className=""
              />
            </>
          ),
        },
        name: 'text_typo',
        visibility: 'show',
      },
      {
        type: 'dropdown',
        props: {
          children: (
            triggerProps: JSX.IntrinsicAttributes &
              Omit<IconButtonProps, 'ref'> &
              RefAttributes<HTMLButtonElement>,
          ) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                variant="ghost"
                color="tertiary"
                icon={<IconTextSize />}
                aria-label={'Choix de la taille de typographie'}
              />
            </>
          ),
        },
        name: 'text_size',
        visibility: 'show',
      },
      {
        type: 'dropdown',
        props: {
          children: (
            triggerProps: JSX.IntrinsicAttributes &
              Omit<IconButtonProps, 'ref'> &
              RefAttributes<HTMLButtonElement>,
          ) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                variant="ghost"
                color="tertiary"
                icon={<IconTextColor />}
                aria-label={'Couleur de texte'}
                className=""
              />
            </>
          ),
        },
        name: 'color',
        visibility: 'show',
      },
      {
        type: 'dropdown',
        props: {
          children: (
            triggerProps: JSX.IntrinsicAttributes &
              Omit<IconButtonProps, 'ref'> &
              RefAttributes<HTMLButtonElement>,
          ) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                variant="ghost"
                color="tertiary"
                icon={<IconTextHighlight />}
                aria-label={'Couleur de fond'}
                className=""
              />
            </>
          ),
        },
        name: 'highlight',
        visibility: 'show',
      },
      {
        type: 'divider',
        name: 'div-2',
      },
      {
        type: 'icon',
        props: {
          'icon': <IconTextBold />,
          'aria-label': 'Ajout de gras',
          'className': '',
          'onClick': () => {},
        },
        name: 'bold',
        visibility: 'show',
      },
      {
        type: 'icon',
        props: {
          'icon': <IconTextItalic />,
          'aria-label': 'Incliner le text',
          'className': '',
          'onClick': () => {},
        },
        name: 'italic',
        visibility: 'show',
      },
      {
        type: 'icon',
        props: {
          'icon': <IconTextUnderline />,
          'aria-label': 'Souligner le texte',
          'className': '',
          'onClick': () => {},
        },
        name: 'underline',
        visibility: 'show',
      },
      {
        type: 'divider',
        name: 'div-3',
      },
      {
        type: 'dropdown',
        props: {
          children: (
            triggerProps: JSX.IntrinsicAttributes &
              Omit<IconButtonProps, 'ref'> &
              RefAttributes<HTMLButtonElement>,
          ) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                variant="ghost"
                color="tertiary"
                icon={<IconSmiley />}
                aria-label={'Emojis'}
              />
            </>
          ),
        },
        name: 'emoji',
        visibility: 'show',
      },
      {
        type: 'icon',
        props: {
          'icon': <IconLink />,
          'aria-label': "Ajout d'un lien",
          'className': '',
          'onClick': () => console.log('click'),
        },
        name: 'linker',
      },
      {
        type: 'divider',
        name: 'div-4',
      },
      {
        type: 'dropdown',
        props: {
          children: (
            triggerProps: JSX.IntrinsicAttributes &
              Omit<IconButtonProps, 'ref'> &
              RefAttributes<HTMLButtonElement>,
          ) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                variant="ghost"
                color="tertiary"
                icon={<IconBulletList />}
                aria-label={"Options d'affichage en liste"}
              />
            </>
          ),
        },
        name: 'list',
        visibility: 'show',
      },
      {
        type: 'dropdown',
        props: {
          children: (
            triggerProps: JSX.IntrinsicAttributes &
              Omit<IconButtonProps, 'ref'> &
              RefAttributes<HTMLButtonElement>,
          ) => (
            <>
              <IconButton
                {...triggerProps}
                type="button"
                variant="ghost"
                color="tertiary"
                icon={<IconAlignLeft />}
                aria-label={"Options d'alignement"}
              />
            </>
          ),
        },
        name: 'alignment',
        visibility: 'show',
      },
      {
        type: 'divider',
        name: 'div-5',
      },
      {
        type: 'dropdown',
        props: {
          children: () => (
            <>
              <Dropdown.Trigger
                variant="ghost"
                label={'Plus'}
                size="md"
                tabIndex={-1}
              />
            </>
          ),
        },
        name: 'plus',
        visibility: 'show',
      },
    ],
    variant: 'no-shadow',
  },
  decorators: [(Story) => <div style={{ height: '600px' }}>{Story()}</div>],
};

export default meta;

type Story = StoryObj<typeof Toolbar>;

export const Base: Story = {
  render: (args) => {
    return <Toolbar {...args} />;
  },
};
