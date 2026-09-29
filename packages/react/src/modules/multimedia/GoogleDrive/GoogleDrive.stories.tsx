import { useState } from 'react';

import { GoogleDriveDocumentResponse } from '@edifice.io/client';
import { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { fn } from 'storybook/test';

import GoogleDrive from './GoogleDrive';

const FOLDER_MIME = 'application/vnd.google-apps.folder';

/**
 * Build a raw document DTO. Google Drive addresses entries by opaque id, names
 * them through `name`, and marks folders with a dedicated mime type — the
 * client normalizes all three.
 */
const raw = (
  id: string,
  name: string,
  mimeType: string,
): GoogleDriveDocumentResponse => ({
  id,
  name,
  mimeType,
  ownerDisplayName: 'Jean Dupont',
  modifiedTime: '2026-08-20T10:00:00Z',
});

/** Folder contents, keyed by the folder id the component asks for. */
const TREE: Record<string, GoogleDriveDocumentResponse[]> = {
  'root': [
    raw('folder-docs', 'Documents', FOLDER_MIME),
    raw('folder-photos', 'Photos', FOLDER_MIME),
    raw('file-budget', 'budget.xlsx', 'application/vnd.ms-excel'),
    raw('file-vacances', 'photo-vacances.jpg', 'image/jpeg'),
    // A native Google document: it maps to no known role, so it falls back to
    // the generic icon.
    raw(
      'file-notes',
      'Notes de réunion',
      'application/vnd.google-apps.document',
    ),
  ],
  'folder-docs': [
    raw('file-rapport', 'rapport.pdf', 'application/pdf'),
    raw(
      'file-presentation',
      'presentation.pptx',
      'application/vnd.ms-powerpoint',
    ),
  ],
  'folder-photos': [
    raw('file-plage', 'plage.jpg', 'image/jpeg'),
    raw('file-montagne', 'montagne.png', 'image/png'),
  ],
};

/** A 1-file-wide placeholder, enough for `useThumbnail` to resolve. */
const THUMBNAIL =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"><rect width="16" height="10" fill="#4bafd5"/></svg>';

const handlers = [
  // Image cards preview themselves through the download endpoint. Without this
  // handler `onUnhandledRequest: 'bypass'` sends them to the real dev server.
  http.get('/googledrive/files/user/:userId/file/:fileId/download', () =>
    HttpResponse.text(THUMBNAIL, {
      headers: { 'Content-Type': 'image/svg+xml' },
    }),
  ),
  http.get('/googledrive/files/user/:userId', ({ request }) => {
    // The query param is named `path` but carries the parent folder id.
    const parentId = new URL(request.url).searchParams.get('path') ?? 'root';
    return HttpResponse.json({ data: TREE[parentId] ?? [] });
  }),
];

const MOCKED = { msw: { handlers: { googledrive: handlers } } };

const meta: Meta<typeof GoogleDrive> = {
  title: 'Modules/Multimedia/GoogleDrive',
  component: GoogleDrive,
  parameters: {
    docs: {
      description: {
        component:
          'The `GoogleDrive` component browses the files a user keeps on their Google Drive, and is mounted by the `MediaLibrary` as its Google Drive tab. Unlike the Nextcloud tab it needs no login step: the backend resolves the Drive credentials on its own, so the drive renders straight away as a folder tree plus a searchable, sortable file grid. Folders are fetched lazily as they are opened, and `roles` narrows the grid to a media type so the same component can serve an image picker as well as an attachment picker. Selection is reported through `onSelect`, which always receives the full list of selected documents. Google Drive addresses its entries by opaque id, so a selection is keyed by `id` rather than by path.',
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

type Story = StoryObj<typeof GoogleDrive>;

export const Base: Story = {
  parameters: {
    ...MOCKED,
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
    ...MOCKED,
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
    ...MOCKED,
    docs: {
      description: {
        story:
          'Use `roles` to restrict the grid to a media type — here images only. Folders stay browsable, and native Google documents are filtered out since they map to no media role.',
      },
    },
  },
};
