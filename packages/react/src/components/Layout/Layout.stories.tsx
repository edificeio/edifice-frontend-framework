import { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';

import Layout from './Layout';

/**
 * Builds the `/theme` + `/assets/theme-conf.js` MSW handler pair for a given
 * `uiOverrides` payload. Keyed object form so Storybook deep-merges with the
 * global handlers (see `Header.stories.tsx`): the `theme` key bundles BOTH
 * routes as one array — the merge replaces the whole key, so both must be
 * repeated on every override (not just the one route being changed),
 * otherwise `/theme` falls through to a 404.
 */
function mockThemeConfWithUiOverrides(uiOverrides: Record<string, unknown>) {
  return {
    theme: [
      http.get('/theme', () =>
        HttpResponse.json({
          template: '/public/template/portal.html',
          logoutCallback: '',
          skin: '/assets/skins/default/',
          themeName: 'cg77',
          skinName: 'default',
        }),
      ),
      http.get('/assets/theme-conf.js', () =>
        HttpResponse.json({
          overriding: [
            {
              parent: 'theme-open-ent',
              child: 'cg77',
              skins: ['default', 'dyslexic'],
              help: '/help-2d',
              bootstrapVersion: 'ode-bootstrap-one',
              edumedia: {
                uri: 'https://www.edumedia-sciences.com',
                pattern: 'uai-token-hash-[[uai]]',
                ignoreSubjects: ['n-92', 'n-93'],
              },
              uiOverrides,
            },
          ],
        }),
      ),
    ],
  };
}

const meta: Meta<typeof Layout> = {
  title: 'Layout/Layout',
  component: Layout,
  args: {
    children: <div className="p-24">Page content</div>,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Legacy portal layout: renders the header, main content area, cookies banner and toaster. Which header it renders is driven by the `uiOverrides` mechanism from the platform theme-conf — see the `HeaderV2` story.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Layout>;

/**
 * Default legacy header (`components/Layout/components/Header`).
 */
export const Default: Story = {};

/**
 * `theme-conf.js` registers `uiOverrides: { 'layout.header': { variant: 'v2', theme: 'crna' } }`
 * on the matching platform entry: `Layout` switches to the new Header
 * (`modules/homepage/components/Header`) and mounts the Notifications overlay
 * behind the bell icon — click it to open the panel.
 */
export const HeaderV2: Story = {
  parameters: {
    msw: {
      handlers: mockThemeConfWithUiOverrides({
        'layout.header': { variant: 'v2', theme: 'crna' },
      }),
    },
    docs: {
      description: {
        story:
          'The Notifications panel uses the real `NotificationListContainer` (list content mocked via the global MSW handlers).',
      },
    },
  },
};

/**
 * `theme-conf.js` registers `uiOverrides: { 'edifice-in-product': true }`
 * on the matching platform entry: `Layout` switches from the legacy raw
 * Zendesk widget (no visible custom UI) to the new `HelpZone` badge — same
 * `useUiOverride` rollout mechanism as `HeaderV2` above. `useZendeskGuide`
 * itself is mocked globally (`help: zendeskGuideHandlers` in `preview.tsx`),
 * so both paths exercise the real hook.
 */
export const HelpZoneEdificeInProduct: Story = {
  parameters: {
    msw: {
      handlers: mockThemeConfWithUiOverrides({
        'edifice-in-product': true,
      }),
    },
  },
};
