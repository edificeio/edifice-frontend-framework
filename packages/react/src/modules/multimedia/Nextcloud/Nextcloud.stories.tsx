import { useState } from 'react';

import { NextcloudDocumentResponse } from '@edifice.io/client';
import { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { fn } from 'storybook/test';

import Nextcloud from './Nextcloud';

/**
 * Build a raw document DTO. The backend prefixes every path with the user's
 * webdav root, names entries through `displayname`, and omits `contentType`
 * on folders — the client normalizes all three.
 */
const raw = (
  userId: string,
  path: string,
  contentType?: string,
): NextcloudDocumentResponse => ({
  path: `/remote.php/dav/files/${userId}${path}`,
  displayname: path.split('/').filter(Boolean).pop()!,
  ownerDisplayName: 'Jean Dupont',
  isFolder: !contentType,
  contentType,
  lastModified: '2026-08-20T10:00:00Z',
});

/** Folder contents, keyed by the path the component asks for. */
const TREE: Record<string, [path: string, contentType?: string][]> = {
  '/': [
    ['/Documents/'],
    ['/Photos/'],
    ['/budget.xlsx', 'application/vnd.ms-excel'],
    ['/photo-vacances.jpg', 'image/jpeg'],
  ],
  '/Documents/': [
    ['/Documents/rapport.pdf', 'application/pdf'],
    ['/Documents/presentation.pptx', 'application/vnd.ms-powerpoint'],
  ],
  '/Photos/': [
    ['/Photos/plage.jpg', 'image/jpeg'],
    ['/Photos/montagne.png', 'image/png'],
  ],
};

/** A 1-file-wide placeholder, enough for `useThumbnail` to resolve. */
const THUMBNAIL =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"><rect width="16" height="10" fill="#4bafd5"/></svg>';

const handlers = (connected: boolean) => [
  http.get('/nextcloud/user/:userId/oauth2/status', () =>
    HttpResponse.json({ connected }),
  ),
  // Image cards preview themselves through the download endpoint. Without this
  // handler `onUnhandledRequest: 'bypass'` sends them to the real dev server.
  http.get('/nextcloud/files/user/:userId/file/:name/download', () =>
    HttpResponse.text(THUMBNAIL, {
      headers: { 'Content-Type': 'image/svg+xml' },
    }),
  ),
  http.get('/nextcloud/files/user/:userId', ({ request, params }) => {
    const userId = params.userId as string;
    const path = new URL(request.url).searchParams.get('path') ?? '/';
    return HttpResponse.json({
      data: [
        // The backend echoes the queried folder itself; the client filters it out.
        ...(path === '/' ? [] : [raw(userId, path)]),
        ...(TREE[path] ?? []).map(([p, contentType]) =>
          raw(userId, p, contentType),
        ),
      ],
    });
  }),
];

const CONNECTED = { msw: { handlers: { nextcloud: handlers(true) } } };
const DISCONNECTED = { msw: { handlers: { nextcloud: handlers(false) } } };

const meta: Meta<typeof Nextcloud> = {
  title: 'Modules/Multimedia/Nextcloud',
  component: Nextcloud,
  parameters: {
    docs: {
      description: {
        component:
          "The `Nextcloud` component browses the files a user keeps on their synchronized Nextcloud drive, and is mounted by the `MediaLibrary` as its Nextcloud tab. It first checks the user's OAuth2 status: without an active connection it shows a call to action opening the login popup, and reconnects itself when that popup posts back. Once connected it renders the drive as a folder tree plus a searchable, sortable file grid — folders are fetched lazily as they are opened, and `roles` narrows the grid to a media type so the same component can serve an image picker as well as an attachment picker. Selection is reported through `onSelect`, which always receives the full list of selected documents.",
      },
    },
  },
  args: {
    multiple: false,
    onSelect: fn(),
  },
  decorators: [
    (Story) => {
      const [queryClient] = useState(
        () =>
          new QueryClient({
            // Mirror `preview.tsx`: TanStack defaults to 3 retries with
            // exponential backoff, turning any failed mock into ~7s of waiting.
            defaultOptions: {
              queries: { retry: false, refetchOnWindowFocus: false },
            },
          }),
      );
      return (
        <QueryClientProvider client={queryClient}>
          <div style={{ height: '32rem' }} className="d-flex">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};
export default meta;

type Story = StoryObj<typeof Nextcloud>;

export const Base: Story = {
  parameters: {
    ...CONNECTED,
    docs: {
      description: {
        story:
          'Browse the drive and pick a single file. Opening a folder in the tree loads its content on demand.',
      },
    },
  },
};

export const MultipleSelection: Story = {
  args: { multiple: true },
  parameters: {
    ...CONNECTED,
    docs: {
      description: {
        story:
          'Use to attach several files at once. Clicking a selected card removes it from the selection.',
      },
    },
  },
};

export const FilteredByRole: Story = {
  args: { roles: 'img' },
  parameters: {
    ...CONNECTED,
    docs: {
      description: {
        story:
          'Use `roles` to restrict the grid to a media type — here images only. Folders stay browsable.',
      },
    },
  },
};

export const NotConnected: Story = {
  parameters: {
    ...DISCONNECTED,
    docs: {
      // The MSW addon resets handlers globally, and autodocs mounts every story
      // at once. The stories above share one handler array so they can't fight,
      // but this one contradicts them — it needs its own iframe and worker.
      story: { inline: false, height: '540px' },
      description: {
        story:
          'Shown until the user links their Nextcloud account. The button opens the OAuth2 popup, and the component refreshes once it reports back.',
      },
    },
  },
};
