import { WorkspaceElement, WorkspaceVisibility } from '@edifice.io/client';
import { createRef, useContext } from 'react';
import { render, screen, waitFor } from '~/setup';
import MediaLibrary, { MediaLibraryRef } from './MediaLibrary';

const { useHasWorkflow, usePublicConf, transferDocuments } = vi.hoisted(() => ({
  useHasWorkflow: vi.fn(),
  usePublicConf: vi.fn(),
  transferDocuments: vi.fn(),
}));

vi.mock('@edifice.io/client', () => ({
  odeServices: { workspace: () => ({ transferDocuments }) },
}));

// Only the hooks the library itself uses are replaced: the real Modal and
// Button pulled in by this spec rely on other hooks of the same barrel.
vi.mock('../../../hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../hooks')>()),
  useHasWorkflow,
  useHttpErrorToast: vi.fn(),
  usePublicConf,
}));

/**
 * Tabs is replaced by a flat list of buttons: the tab ids are what this spec
 * asserts on, and the real component's labels are ambiguous (two tabs share the
 * `iframe` id).
 */
vi.mock('../../../components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../components')>();
  const { useState } = await import('react');

  const Tabs = ({
    items,
    defaultId,
    onChange,
    children,
  }: {
    items: { id: string; content: React.ReactNode }[];
    defaultId: string;
    onChange: (item: unknown) => void;
    children: (current: unknown) => React.ReactNode;
  }) => {
    const [current, setCurrent] = useState(
      items.find((item) => item.id === defaultId) ?? items[0],
    );

    return (
      <div>
        <span data-testid="tab-ids">
          {items.map((item) => item.id).join(',')}
        </span>
        <span data-testid="default-tab">{defaultId}</span>
        {items.map((item, index) => (
          <button
            key={`${item.id}-${index}`}
            onClick={() => {
              setCurrent(item);
              onChange(item);
            }}
          >
            {`goto-${item.id}-${index}`}
          </button>
        ))}
        {children(current)}
      </div>
    );
  };
  Tabs.List = () => <span data-testid="tabs-list" />;
  Tabs.Panel = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tab-panel">{children}</div>
  );

  return { ...actual, Tabs };
});

// Each inner tab is replaced by a probe driving the MediaLibrary context.
vi.mock('./innertabs', async () => {
  const { MediaLibraryContext } = await import('./MediaLibraryContext');

  const Probe = ({ name }: { name: string }) => {
    const context = useContext(MediaLibraryContext);

    return (
      <div data-testid={`inner-${name}`}>
        <button
          onClick={() => {
            context?.setResult?.([{ _id: 'doc-1' } as WorkspaceElement]);
            context?.setResultCounter?.(1);
          }}
        >
          set-result
        </button>
        <button
          onClick={() => {
            context?.setResult?.('a string result');
            context?.setResultCounter?.(3);
          }}
        >
          set-multiple-result
        </button>
        <button
          onClick={() =>
            context?.setPreSuccess?.(
              () => () => Promise.resolve('from pre-success'),
            )
          }
        >
          set-pre-success
        </button>
        <button
          onClick={() =>
            context?.setPreSuccess?.(
              () => () => Promise.reject(new Error('pre-success failed')),
            )
          }
        >
          set-pre-success-error
        </button>
        <button
          onClick={() =>
            context?.setCancellable?.([{ _id: 'upload-1' } as WorkspaceElement])
          }
        >
          set-cancellable
        </button>
        <button onClick={() => context?.switchType?.('embedder')}>
          switch-type
        </button>
      </div>
    );
  };

  return {
    InnerTabs: {
      Workspace: () => <Probe name="workspace" />,
      Upload: () => <Probe name="upload" />,
      Audio: () => <Probe name="audio" />,
      Video: () => <Probe name="video" />,
      ExternalLink: () => <Probe name="external" />,
      InternalLink: () => <Probe name="internal" />,
      Iframe: () => <Probe name="iframe" />,
      VideoEmbedder: () => <Probe name="video-embedder" />,
      Nextcloud: () => <Probe name="nextcloud" />,
    },
  };
});

const WORKSPACE_CREATE =
  'org.entcore.workspace.controllers.WorkspaceController|addDocument';
const VIDEO_CAPTURE =
  'com.opendigitaleducation.video.controllers.VideoController|capture';
const NEXTCLOUD_VIEW =
  'fr.openent.nextcloud.controller.NextcloudController|view';

function setup({
  visibility = 'protected' as 'protected' | 'public' | 'external',
  workflows = { [WORKSPACE_CREATE]: true, [VIDEO_CAPTURE]: true },
  folderServices = [] as string[],
}: {
  visibility?: 'protected' | 'public' | 'external';
  workflows?: Record<string, boolean>;
  folderServices?: string[];
} = {}) {
  useHasWorkflow.mockImplementation((workflow: string) => workflows[workflow]);
  usePublicConf.mockReturnValue({
    data: { 'folder-service': folderServices },
  });

  const onSuccess = vi.fn();
  const onCancel = vi.fn();
  const onTabChange = vi.fn();
  const ref = createRef<MediaLibraryRef>();

  return {
    ...render(
      <MediaLibrary
        ref={ref}
        appCode="blog"
        // A couple of tests deliberately pass 'external' (not a real
        // WorkspaceVisibility) to exercise the component's defensive
        // ['protected', 'public'].includes(visibility) branch.
        visibility={visibility as WorkspaceVisibility}
        multiple
        onSuccess={onSuccess}
        onCancel={onCancel}
        onTabChange={onTabChange}
      />,
    ),
    ref,
    onSuccess,
    onCancel,
    onTabChange,
  };
}

const tabIds = () => screen.getByTestId('tab-ids').textContent!.split(',');
const addButton = () => screen.getByRole('button', { name: /^add/ });

describe('MediaLibrary', () => {
  it('renders nothing until it is shown', () => {
    setup();

    expect(screen.queryByTestId('tab-ids')).not.toBeInTheDocument();
  });

  it('opens on the requested type and exposes it on the ref', async () => {
    const { ref } = setup();

    await waitFor(() => ref.current?.show('image'));

    expect(await screen.findByText('Add an image')).toBeInTheDocument();
    await waitFor(() => expect(ref.current?.type).toBe('image'));
  });

  it('closes on demand', async () => {
    const { ref } = setup();
    await waitFor(() => ref.current?.show('image'));
    await screen.findByTestId('tab-ids');

    await waitFor(() => ref.current?.hide());

    expect(screen.queryByTestId('tab-ids')).not.toBeInTheDocument();
  });

  describe('tab filtering', () => {
    it('offers the workspace and the device for an image', async () => {
      const { ref } = setup();

      await waitFor(() => ref.current?.show('image'));

      await waitFor(() => expect(tabIds()).toEqual(['upload', 'workspace']));
    });

    it('offers the recorder for an audio', async () => {
      const { ref } = setup();

      await waitFor(() => ref.current?.show('audio'));

      await waitFor(() => expect(tabIds()).toContain('audio-capture'));
    });

    it('offers both linkers for a hyperlink', async () => {
      const { ref } = setup();

      await waitFor(() => ref.current?.show('hyperlink'));

      await waitFor(() =>
        expect(tabIds()).toEqual(['internal-link', 'external-link']),
      );
    });

    it('offers the iframe tab for an embedder', async () => {
      const { ref } = setup();

      await waitFor(() => ref.current?.show('embedder'));

      await waitFor(() => expect(tabIds()).toEqual(['iframe']));
    });

    it('offers the capture and the embedder for a video', async () => {
      const { ref } = setup();

      await waitFor(() => ref.current?.show('video'));

      await waitFor(() => expect(tabIds()).toContain('video-capture'));
      expect(tabIds()).toContain('iframe');
    });

    it('hides the upload and the recorder without the workspace workflow', async () => {
      const { ref } = setup({
        workflows: { [WORKSPACE_CREATE]: false, [VIDEO_CAPTURE]: true },
      });

      await waitFor(() => ref.current?.show('audio'));

      await waitFor(() => expect(tabIds()).not.toContain('upload'));
      expect(tabIds()).not.toContain('audio-capture');
    });

    it('offers the nextcloud tab when the folder-service config and workflow are both enabled', async () => {
      const { ref } = setup({
        workflows: {
          [WORKSPACE_CREATE]: true,
          [VIDEO_CAPTURE]: true,
          [NEXTCLOUD_VIEW]: true,
        },
        folderServices: ['nextcloud'],
      });

      await waitFor(() => ref.current?.show('image'));

      await waitFor(() => expect(tabIds()).toContain('nextcloud'));
    });

    it('hides the nextcloud tab without the folder-service config, even with the workflow', async () => {
      const { ref } = setup({
        workflows: {
          [WORKSPACE_CREATE]: true,
          [VIDEO_CAPTURE]: true,
          [NEXTCLOUD_VIEW]: true,
        },
        folderServices: [],
      });

      await waitFor(() => ref.current?.show('image'));

      await waitFor(() => expect(tabIds()).not.toContain('nextcloud'));
    });

    it('hides the nextcloud tab without the workflow, even with the folder-service config', async () => {
      const { ref } = setup({
        workflows: {
          [WORKSPACE_CREATE]: true,
          [VIDEO_CAPTURE]: true,
          [NEXTCLOUD_VIEW]: false,
        },
        folderServices: ['nextcloud'],
      });

      await waitFor(() => ref.current?.show('image'));

      await waitFor(() => expect(tabIds()).not.toContain('nextcloud'));
    });

    it('hides the video capture without its workflow', async () => {
      const { ref } = setup({
        workflows: { [WORKSPACE_CREATE]: true, [VIDEO_CAPTURE]: false },
      });

      await waitFor(() => ref.current?.show('video'));

      await waitFor(() => expect(tabIds()).not.toContain('video-capture'));
    });

    it('shows the tab list only when several tabs remain', async () => {
      const { ref } = setup();

      await waitFor(() => ref.current?.show('embedder'));

      await waitFor(() =>
        expect(screen.queryByTestId('tabs-list')).not.toBeInTheDocument(),
      );

      await waitFor(() => ref.current?.show('image'));

      await waitFor(() =>
        expect(screen.getByTestId('tabs-list')).toBeInTheDocument(),
      );
    });
  });

  describe('default tab', () => {
    it('opens an image on the workspace', async () => {
      const { ref } = setup();

      await waitFor(() => ref.current?.show('image'));

      await waitFor(() =>
        expect(screen.getByTestId('default-tab')).toHaveTextContent(
          'workspace',
        ),
      );
    });

    it('opens an audio on the recorder', async () => {
      const { ref } = setup();

      await waitFor(() => ref.current?.show('audio'));

      await waitFor(() =>
        expect(screen.getByTestId('default-tab')).toHaveTextContent(
          'audio-capture',
        ),
      );
    });

    it('opens a prefilled external link on the external tab', async () => {
      const { ref } = setup();

      await waitFor(() =>
        ref.current?.showLink({ link: 'https://ent.fr' } as never),
      );

      await waitFor(() =>
        expect(screen.getByTestId('default-tab')).toHaveTextContent(
          'external-link',
        ),
      );
    });

    // `mediaLibraryTypes.hyperlink.defaultTab` is 'linker', an id no tab carries,
    // so the index falls back to the first visible tab.
    it('falls back to the first tab for an internal link', async () => {
      const { ref } = setup();

      await waitFor(() =>
        ref.current?.showLink({ resourceId: 'res-1' } as never),
      );

      await waitFor(() =>
        expect(screen.getByTestId('default-tab')).toHaveTextContent(
          'internal-link',
        ),
      );
    });
  });

  describe('validating', () => {
    it('keeps the add button disabled until a tab produces a result', async () => {
      const { ref } = setup();
      await waitFor(() => ref.current?.show('image'));
      await screen.findByTestId('tab-panel');

      expect(addButton()).toBeDisabled();
    });

    it('reports the result of the visible tab', async () => {
      const { ref, user, onSuccess } = setup({ visibility: 'external' });
      await waitFor(() => ref.current?.show('image'));

      await user.click(
        await screen.findByRole('button', { name: 'set-result' }),
      );
      await user.click(addButton());

      await waitFor(() =>
        expect(onSuccess).toHaveBeenCalledWith([
          expect.objectContaining({ _id: 'doc-1' }),
        ]),
      );
    });

    it('transfers the documents to the target folder first', async () => {
      transferDocuments.mockResolvedValue([{ _id: 'copied' }]);
      const { ref, user, onSuccess } = setup({ visibility: 'protected' });
      await waitFor(() => ref.current?.show('image'));

      await user.click(
        await screen.findByRole('button', { name: 'set-result' }),
      );
      await user.click(addButton());

      await waitFor(() =>
        expect(transferDocuments).toHaveBeenCalledWith(
          expect.any(Array),
          'blog',
          'protected',
        ),
      );
      expect(onSuccess).toHaveBeenCalledWith([{ _id: 'copied' }]);
    });

    it('leaves a non-array result untouched', async () => {
      const { ref, user, onSuccess } = setup();
      await waitFor(() => ref.current?.show('image'));

      await user.click(
        await screen.findByRole('button', { name: 'set-multiple-result' }),
      );
      await user.click(addButton());

      await waitFor(() =>
        expect(onSuccess).toHaveBeenCalledWith('a string result'),
      );
      expect(transferDocuments).not.toHaveBeenCalled();
    });

    it('runs the pre-success action first, and reports its result', async () => {
      const { ref, user, onSuccess } = setup({ visibility: 'external' });
      await waitFor(() => ref.current?.show('image'));

      await user.click(
        await screen.findByRole('button', { name: 'set-result' }),
      );
      await user.click(screen.getByRole('button', { name: 'set-pre-success' }));
      await user.click(addButton());

      await waitFor(() =>
        expect(onSuccess).toHaveBeenCalledWith('from pre-success'),
      );
    });

    it('keeps the selection and does not call onSuccess when the pre-success action rejects', async () => {
      const { ref, user, onSuccess } = setup({ visibility: 'external' });
      await waitFor(() => ref.current?.show('image'));

      await user.click(
        await screen.findByRole('button', { name: 'set-result' }),
      );
      await user.click(
        screen.getByRole('button', { name: 'set-pre-success-error' }),
      );
      await user.click(addButton());

      // Once the pre-success action rejects, onSuccess is never called and
      // the button becomes usable again (not stuck disabled).
      await waitFor(() => expect(addButton()).not.toBeDisabled());
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('counts the selection on the add button', async () => {
      const { ref, user } = setup();
      await waitFor(() => ref.current?.show('image'));

      await user.click(
        await screen.findByRole('button', { name: 'set-multiple-result' }),
      );

      expect(
        screen.getByRole('button', { name: /addMultiple/ }),
      ).toBeInTheDocument();
    });
  });

  describe('cancelling', () => {
    it('reports the uploads to clean up', async () => {
      const { ref, user, onCancel } = setup();
      await waitFor(() => ref.current?.show('image'));

      await user.click(
        await screen.findByRole('button', { name: 'set-cancellable' }),
      );
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancel).toHaveBeenCalledWith([
        expect.objectContaining({ _id: 'upload-1' }),
      ]);
    });

    it('reports an empty list when nothing was uploaded', async () => {
      const { ref, user, onCancel } = setup();
      await waitFor(() => ref.current?.show('image'));
      await screen.findByTestId('tab-panel');

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancel).toHaveBeenCalledWith([]);
    });
  });

  describe('switching tab', () => {
    it('notifies the caller and resets the pending result', async () => {
      const { ref, user, onTabChange } = setup();
      await waitFor(() => ref.current?.show('image'));

      await user.click(
        await screen.findByRole('button', { name: 'set-result' }),
      );
      await user.click(
        screen.getByRole('button', { name: 'goto-workspace-1' }),
      );

      expect(onTabChange).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'workspace' }),
        [],
      );
      expect(addButton()).toBeDisabled();
    });
  });

  describe('switching type from a tab', () => {
    it('reopens the library on the requested type', async () => {
      const { ref, user } = setup();
      await waitFor(() => ref.current?.show('video'));

      await user.click(
        await screen.findByRole('button', { name: 'switch-type' }),
      );

      await waitFor(() => expect(tabIds()).toEqual(['iframe']));
    });
  });
});
