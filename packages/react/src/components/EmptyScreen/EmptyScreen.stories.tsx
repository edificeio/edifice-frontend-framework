import { Meta, StoryObj } from '@storybook/react';

import EmptyScreen, { EmptyScreenProps } from './EmptyScreen';

import illuBlog from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-blog.svg';
import illuCollaborativeEditor from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-collaborativeeditor.svg';
import illuCollaborativeWall from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-collaborativewall.svg';
import illuExercizer from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-exercizer.svg';
import illuMessagerie from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-messagerie.svg';
import illuMindmap from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-mindmap.svg';
import illuScrapbook from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-scrapbook.svg';
import illuSearch from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-search.svg';
import illuTimelineGenerator from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-timelinegenerator.svg';
import illuTrash from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-trash.svg';
import illuHomeworks from '@edifice.io/bootstrap/dist/images/emptyscreen/illu-homeworks.svg';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof EmptyScreen> = {
  title: 'Components/EmptyScreen',
  component: EmptyScreen,
  argTypes: {
    imageSrc: {
      control: 'select',
      options: [
        'illu-blog',
        'illu-collaborativeeditor',
        'illu-collaborativewall',
        'illu-exercizer',
        'illu-messagerie',
        'illu-mindmap',
        'illu-scrapbook',
        'illu-search',
        'illu-timelinegenerator',
        'illu-trash',
        'illu-homeworks',
      ],
      mapping: {
        'illu-blog': illuBlog,
        'illu-collaborativeeditor': illuCollaborativeEditor,
        'illu-collaborativewall': illuCollaborativeWall,
        'illu-exercizer': illuExercizer,
        'illu-messagerie': illuMessagerie,
        'illu-mindmap': illuMindmap,
        'illu-scrapbook': illuScrapbook,
        'illu-search': illuSearch,
        'illu-timelinegenerator': illuTimelineGenerator,
        'illu-trash': illuTrash,
        'illu-homeworks': illuHomeworks,
      },
    },
  },
  args: {
    imageSrc: 'illu-blog',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `EmptyScreen` component is used to display a placeholder state when there is no content to show. It typically includes an illustration, a title, and descriptive text to provide context and guidance to users. This component is commonly used for empty states, zero results, or initial setup screens.',
      },
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;
type Story = StoryObj<typeof EmptyScreen>;

export const Template = (args: EmptyScreenProps) => {
  return (
    <div>
      <EmptyScreen {...args} imageSrc={args.imageSrc} />
    </div>
  );
};

export const Base: Story = {
  render: Template,

  args: {
    imageSrc: 'illu-blog',
    title: 'C’est un peu calme ici...',
    text: "Il n’y a pas encore de blog. Patience ! C'est ici que vous pourrez bientôt suivre et commenter toutes les activités de la classe.",
  },
};

export const Mindmap: Story = {
  render: Template,

  args: {
    imageSrc: 'illu-mindmap',
    title: 'Une carte pour faire grandir les idées !',
    text: 'Avec la carte mentale, les idées se transforment en schémas structurés. Fiches de lecture, prise de notes, présentations orales… on mémorise tout plus facilement.',
  },
};

export const Messagerie: Story = {
  render: Template,

  args: {
    imageSrc: 'illu-messagerie',
    title: 'Pas l’ombre d’un message pour le moment...',
    text: 'Avec la Messagerie, communiquez facilement avec la communauté de l’école. Vos messages prennent leur envol !',
  },
};

export const TimelineGenerator: Story = {
  render: Template,

  args: {
    imageSrc: 'illu-timelinegenerator',
    title: 'Pas de frise ? Ça défrise !',
    text: 'Ne perdez plus le fil des évènements. Sur une fresque, retrouvez des images, des sons ou des vidéos pour tout mémoriser plus facilement !',
  },
};

export const Search: Story = {
  render: Template,

  args: {
    imageSrc: 'illu-search',
    title: 'Désolé, il n’y a rien sous ce nom-là…',
    text: 'Aucune ressource ne correspond à votre recherche. Modifiez les critères et tentez à nouveau !',
  },
};

export const Trash: Story = {
  render: Template,

  args: {
    imageSrc: 'illu-trash',
    title: 'C’est vide par içi !',
    text: 'Aucune ressource dans la corbeille pour le moment.',
  },
};
