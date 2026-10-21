import { Meta, StoryObj } from '@storybook/react-vite';

import { ButtonBeta as Button } from '../../../../../components';
import useToggle from '../../../../../hooks/useToggle/useToggle';
import EdumalinModal from '../EdumalinModal';
import { EdumalinItem } from '../types';

const meta: Meta<typeof EdumalinModal> = {
  title: 'Modules/Homepage/Edumalin/Modal',
  component: EdumalinModal,
  args: {
    onClose: () => {},
    onEdumalinClick: () => alert('Accéder à Édumalin'),
    onActionClick: (url: string) => alert(`Ouvrir ${url}`),
  },
  parameters: {
    docs: {
      description: {
        component:
          "Détail d'un contenu Édumalin : titre et description complets, infos spécifiques aux webinaires et RDV, et boutons vers Édumalin.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EdumalinModal>;

// The modal never truncates: titles and descriptions are shown in full.
const announcement: EdumalinItem = {
  title:
    'Nouveau : le parcours « Apprendre à apprendre » est disponible pour toutes vos classes de collège',
  description:
    'Ce parcours guide les élèves pas à pas pour organiser leur travail personnel, mieux mémoriser leurs leçons et préparer leurs évaluations. Chaque séance dure une vingtaine de minutes et peut être menée en classe entière ou en autonomie. Un livret enseignant accompagne chaque étape avec des pistes de différenciation.',
  type: { name: 'Annonce' },
  buttonTitle: 'Découvrir le parcours',
  buttonLink: 'https://example.com/parcours',
};

const webinar: EdumalinItem = {
  title: 'Préparer le brevet sereinement',
  description:
    'Un webinaire d’une demi-heure pour découvrir comment accompagner vos élèves de 3e dans leurs révisions.',
  type: { name: 'Webinaire' },
  dateTime: '2027-01-18T14:00:00',
  duration: 30,
  buttonTitle: 'S’inscrire',
  buttonLink: 'https://example.com/webinaires/brevet',
};

const rdv: EdumalinItem = {
  title: 'Retrouvez-nous au salon Educatech Expo',
  description:
    'Notre équipe vous accueille sur son stand pour vous présenter les nouveautés de l’année.',
  type: { name: 'RDV' },
  googleMap: 'https://maps.app.goo.gl/XNV5D74URCxvhiff7',
  buttonTitle: 'S’inscrire',
  buttonLink: 'https://example.com/evenements/educatech',
};

// Closed by default: safe to embed in the auto-generated Docs page (an
// always-open ModalBeta locks page scroll — see the stories below).
export const Interactive: Story = {
  args: { item: announcement },
  render: (args) => {
    const [isOpen, toggle] = useToggle(false);

    return (
      <>
        <Button type="button" onClick={() => toggle(true)}>
          Ouvrir la modale
        </Button>
        {isOpen && <EdumalinModal {...args} onClose={() => toggle(false)} />}
      </>
    );
  },
};

// The stories below render the modal open, for full Chromatic coverage. They
// are excluded from the Docs page (`docs.disable`): visit them individually.

export const Default: Story = {
  args: { item: announcement },
  parameters: { docs: { disable: true } },
};

export const Webinar: Story = {
  args: { item: webinar },
  parameters: {
    docs: {
      disable: true,
      description: { story: 'Webinaire — date et durée en plus.' },
    },
  },
};

export const Rdv: Story = {
  args: { item: rdv },
  parameters: {
    docs: {
      disable: true,
      description: { story: 'RDV — lieu (lien Google Maps) en plus.' },
    },
  },
};

export const WithoutActionButton: Story = {
  args: {
    item: {
      title: 'Comment la métacognition a changé ma façon d’enseigner',
      description:
        'Une professeure de mathématiques raconte comment elle fait travailler la mémorisation à ses classes de 4e depuis la rentrée.',
      type: { name: 'Temoignage' },
    },
  },
  parameters: {
    docs: {
      disable: true,
      description: {
        story:
          "Sans lien fourni par Édumalin, seul le bouton « Accéder à Édumalin » s'affiche.",
      },
    },
  },
};
