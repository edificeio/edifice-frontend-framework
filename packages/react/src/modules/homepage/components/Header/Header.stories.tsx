import { IWebApp } from '@edifice.io/client';
import { Meta, StoryObj } from '@storybook/react-vite';
import { authHandlers, userbookHandlers, userInfo } from '@edifice.io/config';
import { http, HttpResponse } from 'msw';

import Header from './Header';

/**
 * 10 bookmarked apps (2 full rows of 5) with distinct, real icon codes —
 * realistic enough to catch icon/grid regressions that 2 fake "appN-icon"
 * placeholders (the default userInfo fixture) would hide.
 */
const tenApps: IWebApp[] = [
  { name: 'Blog', address: '/blog', icon: 'blog', displayName: 'Blog' },
  { name: 'Wiki', address: '/wiki', icon: 'wiki', displayName: 'Wiki' },
  { name: 'Pad', address: '/pad', icon: 'pad', displayName: 'Pad' },
  {
    name: 'CahierDeTexte',
    address: '/cahier-de-texte',
    icon: 'cahier-de-texte',
    displayName: 'Cahier de texte',
  },
  {
    name: 'Formulaire',
    address: '/formulaire',
    icon: 'forms',
    displayName: 'Formulaire',
  },
  {
    name: 'CollaborativeWall',
    address: '/collaborativewall',
    icon: 'collaborative-wall',
    displayName: 'Mur collaboratif',
  },
  {
    name: 'Exercizer',
    address: '/exercizer',
    icon: 'exercizer',
    displayName: 'Exercices',
  },
  { name: 'Pages', address: '/pages', icon: 'pages', displayName: 'Pages' },
  { name: 'Rack', address: '/rack', icon: 'rack', displayName: 'Casier' },
  {
    name: 'Scrapbook',
    address: '/scrapbook',
    icon: 'scrapbook',
    displayName: 'Cahier multimédia',
  },
].map((app) => ({
  ...app,
  display: true,
  isExternal: false,
  scope: [''],
}));

const meta: Meta<typeof Header> = {
  title: 'Modules/Homepage/Header',
  component: Header,
  args: {
    src: '/assets',
  },
  parameters: {
    docs: {
      description: {
        component:
          'Header is the main navigation header component for Edifice applications. It provides access to applications, messaging, search, user account, and other core platform features. The header adapts to different screen sizes and includes dropdown menus for mobile navigation. It integrates with user authentication, conversations, help systems, and theme management.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh' }}>
        <Story />
        {/* Add some content below to see the header in context */}
        <div style={{ padding: '2rem' }}>
          <h1>Sample Page Content</h1>
          <p>
            This content shows how the header looks in a real application
            context.
          </p>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

/**
 * Default header display with all features enabled.
 * This story demonstrates the header with default theme assets and all navigation features.
 */
export const Default: Story = {};

/**
 * Mobile responsive header demonstration.
 * Shows how the header adapts to mobile viewport sizes.
 */
export const Mobile: Story = {
  globals: {
    viewport: { value: 'mobile' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'On mobile devices, the header navigation collapses into a dropdown menu with touch-friendly interaction.',
      },
    },
  },
};

/**
 * Tablet responsive header demonstration.
 * Shows the header behavior on tablet-sized screens.
 */
export const Tablet: Story = {
  globals: {
    viewport: { value: 'tablet' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Header adapted for tablet viewports showing the intermediate responsive state.',
      },
    },
  },
};

/**
 * Header with 3 unread messages badge on the conversation icon.
 */
export const WithMessages: Story = {
  parameters: {
    msw: {
      // Use the keyed object form so Storybook deep-merges with the global
      // handlers instead of replacing them. An array here would drop the
      // global `auth` handler (/auth/oauth2/userinfo), which provides the
      // conversation workflow right that gates the messaging icon — without
      // it the icon (and thus the badge) never renders.
      handlers: {
        conversation: [
          http.get('/conversation/api/count/inbox', () =>
            HttpResponse.json({ count: 3 }),
          ),
        ],
      },
    },
  },
};

/**
 * Header with 10 favorite applications bookmarked (2 full rows of 5, the
 * grid's max) — hover the "Mes applis" icon to open the popover. The
 * `Default` story above already covers the empty state, since the global
 * `userbook` handler bookmarks no app.
 */
export const WithBookmarkedApps: Story = {
  parameters: {
    msw: {
      handlers: {
        // Storybook's parameter merge REPLACES the `auth`/`userbook` arrays
        // wholesale rather than merging their contents — an override here
        // must spread the original handlers (ours first, so it wins on the
        // shared path) or every other handler in that group, e.g.
        // `/userbook/api/person`, silently 404s and the whole session query
        // errors out.
        auth: [
          http.get('/auth/oauth2/userinfo', () =>
            HttpResponse.json({ ...userInfo, apps: tenApps }),
          ),
          ...authHandlers,
        ],
        userbook: [
          http.get('/userbook/preference/apps', () =>
            HttpResponse.json({
              preference: JSON.stringify({
                bookmarks: tenApps.map((app) => app.name),
                applications: [],
              }),
            }),
          ),
          ...userbookHandlers,
        ],
      },
    },
  },
};
