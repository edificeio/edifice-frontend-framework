import {
  mockMessageAlert,
  mockMessageDefault,
  mockMessageInfo,
  mockMessageSuccess,
  mockMessageWarning,
} from '@edifice.io/config';
import type { Meta, StoryObj } from '@storybook/react-vite';
import MessageFlash from './MessageFlash';

const meta = {
  title: 'Modules/Homepage/MessageFlash',
  component: MessageFlash,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "The `MessageFlash` component renders a single flash message pushed by the platform (an `IFlashMessageModel` from `@edifice.io/client`) on the homepage. It picks the content matching the user's current language, falls back to French, then to the first non-empty translation available. Long messages are truncated to two lines with a toggle to expand them, and the message can be dismissed through the `onCloseMessage` callback — persisting that dismissal is the caller's responsibility. The visual style (info, warning, alert…) follows the message model itself, not a prop.",
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MessageFlash>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: mockMessageDefault,
    onCloseMessage: (message) => {
      console.log('Message closed:', message);
    },
  },
};

export const Alert: Story = {
  args: {
    message: mockMessageAlert,
  },
};

export const Warning: Story = {
  args: {
    message: mockMessageWarning,
  },
};

export const Info: Story = {
  args: {
    message: mockMessageInfo,
  },
};

export const Success: Story = {
  args: {
    message: mockMessageSuccess,
  },
};

export const WithLinks: Story = {
  args: {
    message: {
      ...mockMessageInfo,
      id: 'with-links',
      contents: {
        en: 'Registration is open on <a href="https://www.parcoursup.gouv.fr">Parcoursup</a>. See also the <a href="/blog">school blog</a>.',
        fr: 'Les inscriptions sont ouvertes sur <a href="https://www.parcoursup.gouv.fr">Parcoursup</a>. Consultez aussi le <a href="/blog">blog de l’établissement</a>.',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Every link in the content, external or internal, opens in a new tab (`target="_blank"` with `rel="noopener noreferrer"`), whatever `target` it was written with.',
      },
    },
  },
};

export const WithLinksInLongContent: Story = {
  args: {
    message: {
      ...mockMessageInfo,
      id: 'with-links-long',
      contents: {
        en: 'Dear students, a technical issue affected the Parcoursup website and all registrations have been postponed. Our school is not responsible for this situation, which comes directly from the academy. We will keep you informed as soon as possible. In the meantime, follow the official updates on <a href="https://www.parcoursup.gouv.fr">Parcoursup</a> and on the <a href="/blog" target="_self">school blog</a>.',
        fr: 'Chers étudiants, un problème technique a affecté le site de Parcoursup et toutes les inscriptions ont été reportées. Notre établissement n’est pas responsable de cette situation, qui provient directement de l’académie. Nous vous tiendrons informés dès que possible. En attendant, suivez les informations officielles sur <a href="https://www.parcoursup.gouv.fr">Parcoursup</a> et sur le <a href="/blog" target="_self">blog de l’établissement</a>.',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Links placed after the two-line truncation become visible once the message is expanded, and also open in a new tab.',
      },
    },
  },
};
