import { Meta, StoryObj } from '@storybook/react';
import EditorPreview from './components/Editor/EditorPreview';

const defaultContent =
  '<img class="custom-image" alt="testImage" src="https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=" width="350" height="NaN"><p><strong><span>​Le voici ! Le jardin partagé du périscolaire ! Des groupes d&apos;enfants provenant de 11 écoles de la ville participent à créer et entretenir à tour de rôle un jardin où se mêlent fruits, légumes, fleurs et aromates. </span></strong></p><p><span>​</span></p><p><span>​Comment planter des graines ou des jeunes pousses ? Que lui faut-il pour grandir ? Comment va évoluer mon potager ? Autant de questions que se posent les enfants et qui rejoignent leur enseignement en classe sur le cycle de vie des plantes. Par exemple, </span><a target="_blank" rel="noopener noreferrer nofollow" href="/timelinegenerator#/view/c8fe320a-85a7-4c02-9951-d7ea443b5af8"><strong><span>voici la Frise Chronologique</span></strong></a><span> </span><span style="font-size: 14px">réalisée</span> par Mr Loison à l&apos;école Arthur Rimbaud.</p><p><span>​</span></p><p><span>​En complément du blog du périscolaire, ce beau projet fait l&apos;objet d&apos;un Cahier multimédia à lui tout seul ! Pour découvrir et suivre nos belles aventures, feuilletez le </span><a target="_blank" rel="noopener noreferrer nofollow" href="/scrapbook#/view-scrapbook/f682ec87-4e86-4b75-8ca2-d9e6f4a7b88d"><strong><span>en cliquant ici</span></strong></a><span>. </span></p><p><span>​</span></p><p><span>​ ​</span></p><img class="custom-image" src="https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=" width="350" height="NaN"><p><span>     ​</span></p><img class="custom-image" src="https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=" width="350" height="NaN"><img class="custom-image" src="https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=" width="350" height="NaN"><p><span>  </span><br></p>';

const meta: Meta<typeof EditorPreview> = {
  title: 'Modules/Editor/EditorPreview',
  component: EditorPreview,
  argTypes: {
    content: {
      control: 'text',
      description: 'HTML content to render inside the preview.',
    },
    variant: {
      control: {
        type: 'select',
        options: ['outline', 'ghost'],
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'EditorPreview component to render a read-only preview of rich content. ' +
          'It extracts and displays text and media (images, videos, etc.) from the provided HTML content. ' +
          'It can show media thumbnails for images, providing a visual preview of the content. ' +
          'This component is useful for displaying a summary or preview of rich content in a compact format.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EditorPreview>;

export const OutlinePreviewVariant: Story = {
  args: {
    variant: 'outline',
    content: defaultContent,
  },
  decorators: [(Story) => <Story />],
  name: 'Outline Variant',
};

export const GhostPreviewVariant: Story = {
  args: {
    variant: 'ghost',
    content: defaultContent,
  },
  name: 'Ghost Variant',
};

export const ClickablePreviewVariant: Story = {
  args: {
    content: defaultContent,
    onDetailClick: () => alert('Detail clicked'),
    onMediaClick: () => alert('Media clicked'),
  },
  name: 'Clickable preview',
};
