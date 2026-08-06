import { forwardRef } from 'react';

import { IFolder, IResource } from '@edifice.io/client';

import { render, screen, waitFor } from '~/setup';
import ImagePicker from '../../multimedia/ImagePicker/ImagePicker';
import { ResourceModal } from './ResourceModal';

const {
  searchResource,
  createResourceApi,
  updateResourceApi,
  sessionHasWorkflowRight,
  sessionHasWorkflowRights,
} = vi.hoisted(() => ({
  searchResource: vi.fn(),
  createResourceApi: vi.fn(),
  updateResourceApi: vi.fn(),
  sessionHasWorkflowRight: vi.fn(),
  sessionHasWorkflowRights: vi.fn(),
}));

vi.mock('@edifice.io/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@edifice.io/client')>();
  return {
    ...actual,
    odeServices: {
      resource: () => ({
        searchResource,
        create: createResourceApi,
        update: updateResourceApi,
      }),
      rights: () => ({
        sessionHasWorkflowRight,
        sessionHasWorkflowRights,
      }),
    },
  };
});

// ImagePicker and MediaLibrary have their own dedicated specs and deep
// dependencies of their own; stub them out so this spec only exercises
// ResourceModal's own branch logic.
vi.mock('../../multimedia/ImagePicker/ImagePicker', () => ({
  default: vi.fn(() => <div data-testid="mock-image-picker" />),
}));

vi.mock('../../multimedia', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../multimedia')>();
  return {
    ...actual,
    // ResourceModal forwards a ref to MediaLibrary; use forwardRef here too
    // to avoid a "function components cannot be given refs" console warning.
    MediaLibrary: forwardRef(() => <div data-testid="mock-media-library" />),
  };
});

// Build a minimal IResource; only the fields read by ResourceModal matter here.
const buildResource = (overrides: Partial<IResource> = {}): IResource =>
  ({
    assetId: 'asset-1',
    name: 'My resource',
    description: 'My description',
    public: false,
    slug: 'my-resource',
    allowReplies: true,
    thumbnail: '/workspace/document/thumb-1',
    trashed: false,
    ...overrides,
  }) as IResource;

const noop = () => undefined;

describe('ResourceModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create mode', () => {
    it('renders the create header/button and empty default fields', () => {
      // useResource warns when called with an empty id (create mode); silence it.
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      render(
        <ResourceModal
          mode="create"
          isOpen
          currentFolder={{ id: 'default' }}
          onCancel={noop}
          onSuccess={noop}
        />,
      );

      expect(
        screen.getByText('explorer.resource.editModal.header.create'),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'explorer.create' }),
      ).toBeInTheDocument();

      const titleInput = screen.getByLabelText(/^title/) as HTMLInputElement;
      const descriptionInput = screen.getByLabelText(
        /^description/,
      ) as HTMLTextAreaElement;
      expect(titleInput.value).toBe('');
      expect(descriptionInput.value).toBe('');

      // No resourceId is provided in create mode, so the resource is never fetched.
      expect(searchResource).not.toHaveBeenCalled();

      consoleWarn.mockRestore();
    });

    it('does not render the allow-replies checkbox for a non-blog app', () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      render(
        <ResourceModal
          mode="create"
          isOpen
          currentFolder={{ id: 'default' }}
          onCancel={noop}
          onSuccess={noop}
        />,
      );

      expect(
        screen.queryByText('explorer.resource.editModal.comments.allowReplies'),
      ).not.toBeInTheDocument();

      consoleWarn.mockRestore();
    });

    it('calls onCancel when the cancel button is clicked', async () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      const onCancel = vi.fn();

      const { user } = render(
        <ResourceModal
          mode="create"
          isOpen
          currentFolder={{ id: 'default' }}
          onCancel={onCancel}
          onSuccess={noop}
        />,
      );

      await user.click(screen.getByRole('button', { name: 'explorer.cancel' }));

      expect(onCancel).toHaveBeenCalledTimes(1);

      consoleWarn.mockRestore();
    });

    it('renders a plain ReactNode passed as children', () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      render(
        <ResourceModal
          mode="create"
          isOpen
          currentFolder={{ id: 'default' }}
          onCancel={noop}
          onSuccess={noop}
        >
          <div data-testid="extra-content">Extra content</div>
        </ResourceModal>,
      );

      expect(screen.getByTestId('extra-content')).toBeInTheDocument();

      consoleWarn.mockRestore();
    });

    it('invokes a function passed as children with resource/isUpdating/form helpers', () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      const childrenSpy = vi.fn(() => null);

      render(
        <ResourceModal
          mode="create"
          isOpen
          currentFolder={{ id: 'default' }}
          onCancel={noop}
          onSuccess={noop}
        >
          {childrenSpy}
        </ResourceModal>,
      );

      expect(childrenSpy).toHaveBeenCalledWith(
        null,
        false,
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
      );

      consoleWarn.mockRestore();
    });
  });

  describe('update mode', () => {
    it('shows a loading screen until the resource resolves, then renders edit/save text and populated fields', async () => {
      const resource = buildResource();
      searchResource.mockResolvedValue(resource);

      render(
        <ResourceModal
          mode="update"
          isOpen
          resourceId="resource-1"
          onCancel={noop}
          onSuccess={noop}
        />,
      );

      // The resource fetch is still pending right after mount: only the
      // loading screen is rendered, no form/dialog yet.
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.getByAltText('loading')).toBeInTheDocument();

      await waitFor(() =>
        expect(screen.getByRole('dialog')).toBeInTheDocument(),
      );

      expect(
        screen.getByText('explorer.resource.editModal.header.edit'),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'save' })).toBeInTheDocument();

      const titleInput = screen.getByLabelText(/^title/) as HTMLInputElement;
      const descriptionInput = screen.getByLabelText(
        /^description/,
      ) as HTMLTextAreaElement;
      expect(titleInput.value).toBe(resource.name);
      expect(descriptionInput.value).toBe(resource.description);
    });

    it('invokes a function passed as children with the resolved resource', async () => {
      const resource = buildResource();
      searchResource.mockResolvedValue(resource);
      const childrenSpy = vi.fn(() => null);

      render(
        <ResourceModal
          mode="update"
          isOpen
          resourceId="resource-1"
          onCancel={noop}
          onSuccess={noop}
        >
          {childrenSpy}
        </ResourceModal>,
      );

      await waitFor(() =>
        expect(childrenSpy).toHaveBeenCalledWith(
          resource,
          true,
          expect.any(Function),
          expect.any(Function),
          expect.any(Function),
        ),
      );
    });
  });

  describe('custom translations', () => {
    it('overrides the header text', () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      render(
        <ResourceModal
          mode="create"
          isOpen
          currentFolder={{ id: 'default' }}
          onCancel={noop}
          onSuccess={noop}
          translations={{ header: { create: 'Créer une ressource' } }}
        />,
      );

      expect(screen.getByText('Créer une ressource')).toBeInTheDocument();
      expect(
        screen.queryByText('explorer.resource.editModal.header.create'),
      ).not.toBeInTheDocument();

      consoleWarn.mockRestore();
    });

    it('overrides the cancel button label', () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      render(
        <ResourceModal
          mode="create"
          isOpen
          currentFolder={{ id: 'default' }}
          onCancel={noop}
          onSuccess={noop}
          translations={{ cancel: 'Annuler tout' }}
        />,
      );

      expect(
        screen.getByRole('button', { name: 'Annuler tout' }),
      ).toBeInTheDocument();

      consoleWarn.mockRestore();
    });

    it('overrides the imagepicker add-button label passed down to ImagePicker', () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      render(
        <ResourceModal
          mode="create"
          isOpen
          currentFolder={{ id: 'default' }}
          onCancel={noop}
          onSuccess={noop}
          translations={{ imagepicker: { add: 'Ajouter une image' } }}
        />,
      );

      const lastCallProps = vi.mocked(ImagePicker).mock.calls.at(-1)?.[0] as {
        addButtonLabel: string;
      };
      expect(lastCallProps.addButtonLabel).toBe('Ajouter une image');

      consoleWarn.mockRestore();
    });
  });

  describe('allow-replies checkbox (blog + optionalCommentReplies workflow)', () => {
    it('renders the checkbox when app is blog and the workflow right is true', async () => {
      sessionHasWorkflowRight.mockResolvedValue(true);
      const resource = buildResource({ allowReplies: false });
      searchResource.mockResolvedValue(resource);

      render(
        <ResourceModal
          mode="update"
          isOpen
          appCode="blog"
          resourceId="resource-1"
          onCancel={noop}
          onSuccess={noop}
        />,
      );

      const checkbox = await screen.findByRole('checkbox', {
        name: 'explorer.resource.editModal.comments.allowReplies',
      });
      // defaultChecked reflects resource.allowReplies in update mode.
      expect(checkbox).not.toBeChecked();
    });

    it('does not render the checkbox when the workflow right is false', async () => {
      sessionHasWorkflowRight.mockResolvedValue(false);
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      render(
        <ResourceModal
          mode="create"
          isOpen
          appCode="blog"
          currentFolder={{ id: 'default' }}
          onCancel={noop}
          onSuccess={noop}
        />,
      );

      await waitFor(() => expect(sessionHasWorkflowRight).toHaveBeenCalled());

      expect(
        screen.queryByRole('checkbox', {
          name: 'explorer.resource.editModal.comments.allowReplies',
        }),
      ).not.toBeInTheDocument();

      consoleWarn.mockRestore();
    });

    it('does not render the checkbox for a non-blog app even if the workflow right is true', async () => {
      sessionHasWorkflowRight.mockResolvedValue(true);
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      render(
        <ResourceModal
          mode="create"
          isOpen
          currentFolder={{ id: 'default' }}
          onCancel={noop}
          onSuccess={noop}
        />,
      );

      await waitFor(() => expect(sessionHasWorkflowRight).toHaveBeenCalled());

      expect(
        screen.queryByRole('checkbox', {
          name: 'explorer.resource.editModal.comments.allowReplies',
        }),
      ).not.toBeInTheDocument();

      consoleWarn.mockRestore();
    });
  });

  describe('onSubmit — create path', () => {
    const fillTitleAndSubmit = async (
      user: ReturnType<typeof render>['user'],
      title: string,
    ) => {
      const titleInput = screen.getByLabelText(/^title/);
      await user.clear(titleInput);
      await user.type(titleInput, title);
      const submitButton = await screen.findByRole('button', {
        name: 'explorer.create',
      });
      await waitFor(() => expect(submitButton).toBeEnabled());
      await user.click(submitButton);
    };

    it('calls odeServices.resource(application).create directly when no createResource mutation is provided', async () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      const onSuccess = vi.fn();
      createResourceApi.mockResolvedValue({
        entId: 'new-id',
        thumbnail: undefined,
      });

      const { user } = render(
        <ResourceModal
          mode="create"
          isOpen
          currentFolder={{ id: 'default' }}
          onCancel={noop}
          onSuccess={onSuccess}
        />,
      );

      await fillTitleAndSubmit(user, 'New Resource');

      await waitFor(() => expect(createResourceApi).toHaveBeenCalled());
      expect(createResourceApi).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Resource',
          description: '',
          public: false,
          slug: '',
          allowReplies: true,
          folder: undefined,
          application: 'wiki',
        }),
      );
      expect(onSuccess).toHaveBeenCalledWith(
        { entId: 'new-id', thumbnail: undefined },
        expect.objectContaining({ name: 'New Resource' }),
      );

      consoleWarn.mockRestore();
    });

    it('calls createResource.mutateAsync when provided, instead of the direct API call', async () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      const onSuccess = vi.fn();
      const mutateAsync = vi
        .fn()
        .mockResolvedValue({ entId: 'mutated-id', thumbnail: undefined });

      const { user } = render(
        <ResourceModal
          mode="create"
          isOpen
          currentFolder={{ id: 'default' }}
          onCancel={noop}
          onSuccess={onSuccess}
          createResource={{ mutateAsync } as any}
        />,
      );

      await fillTitleAndSubmit(user, 'New Resource');

      await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
      expect(createResourceApi).not.toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith(
        { entId: 'mutated-id', thumbnail: undefined },
        expect.objectContaining({ name: 'New Resource' }),
      );

      consoleWarn.mockRestore();
    });

    it('resolves folder as undefined when currentFolder is undefined', async () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      createResourceApi.mockResolvedValue({
        entId: 'new-id',
        thumbnail: undefined,
      });

      const { user } = render(
        <ResourceModal
          mode="create"
          isOpen
          currentFolder={undefined as unknown as Partial<IFolder>}
          onCancel={noop}
          onSuccess={noop}
        />,
      );

      await fillTitleAndSubmit(user, 'New Resource');

      await waitFor(() => expect(createResourceApi).toHaveBeenCalled());
      expect(createResourceApi).toHaveBeenCalledWith(
        expect.objectContaining({ folder: undefined }),
      );

      consoleWarn.mockRestore();
    });

    it('resolves folder as undefined when currentFolder.id is "default"', async () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      createResourceApi.mockResolvedValue({
        entId: 'new-id',
        thumbnail: undefined,
      });

      const { user } = render(
        <ResourceModal
          mode="create"
          isOpen
          currentFolder={{ id: 'default' }}
          onCancel={noop}
          onSuccess={noop}
        />,
      );

      await fillTitleAndSubmit(user, 'New Resource');

      await waitFor(() => expect(createResourceApi).toHaveBeenCalled());
      expect(createResourceApi).toHaveBeenCalledWith(
        expect.objectContaining({ folder: undefined }),
      );

      consoleWarn.mockRestore();
    });

    it('resolves folder as a parsed integer when currentFolder.id is a real folder id', async () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      createResourceApi.mockResolvedValue({
        entId: 'new-id',
        thumbnail: undefined,
      });

      const { user } = render(
        <ResourceModal
          mode="create"
          isOpen
          currentFolder={{ id: '42' }}
          onCancel={noop}
          onSuccess={noop}
        />,
      );

      await fillTitleAndSubmit(user, 'New Resource');

      await waitFor(() => expect(createResourceApi).toHaveBeenCalled());
      expect(createResourceApi).toHaveBeenCalledWith(
        expect.objectContaining({ folder: 42 }),
      );

      consoleWarn.mockRestore();
    });

    it('catches a thrown error, logs it, and does not call onSuccess', async () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      const onSuccess = vi.fn();
      const boom = new Error('boom');
      createResourceApi.mockRejectedValue(boom);

      const { user } = render(
        <ResourceModal
          mode="create"
          isOpen
          currentFolder={{ id: 'default' }}
          onCancel={noop}
          onSuccess={onSuccess}
        />,
      );

      await fillTitleAndSubmit(user, 'New Resource');

      await waitFor(() => expect(consoleError).toHaveBeenCalledWith(boom));
      expect(onSuccess).not.toHaveBeenCalled();

      consoleWarn.mockRestore();
      consoleError.mockRestore();
    });
  });

  describe('onSubmit — update path', () => {
    const pokeTitleAndSubmit = async (
      user: ReturnType<typeof render>['user'],
    ) => {
      // Trigger an onChange without altering the (already valid) prefilled
      // value, so react-hook-form validates and enables the submit button.
      const titleInput = screen.getByLabelText(/^title/);
      await user.type(titleInput, 'x');
      await user.type(titleInput, '{backspace}');
      const submitButton = await screen.findByRole('button', {
        name: 'save',
      });
      await waitFor(() => expect(submitButton).toBeEnabled());
      await user.click(submitButton);
    };

    it('calls odeServices.resource(application).update directly when no updateResource mutation is provided', async () => {
      const resource = buildResource();
      searchResource.mockResolvedValue(resource);
      updateResourceApi.mockResolvedValue({
        entId: resource.assetId,
        thumbnail: resource.thumbnail,
      });
      const onSuccess = vi.fn();

      const { user } = render(
        <ResourceModal
          mode="update"
          isOpen
          resourceId="resource-1"
          onCancel={noop}
          onSuccess={onSuccess}
        />,
      );

      await waitFor(() =>
        expect(screen.getByRole('dialog')).toBeInTheDocument(),
      );

      await pokeTitleAndSubmit(user);

      await waitFor(() => expect(updateResourceApi).toHaveBeenCalled());
      expect(updateResourceApi).toHaveBeenCalledWith(
        expect.objectContaining({
          name: resource.name,
          description: resource.description,
          entId: resource.assetId,
          trashed: resource.trashed,
        }),
      );
      expect(onSuccess).toHaveBeenCalledWith(
        { entId: resource.assetId, thumbnail: resource.thumbnail },
        expect.objectContaining({ entId: resource.assetId }),
      );
    });

    it('calls updateResource.mutateAsync when provided, instead of the direct API call', async () => {
      const resource = buildResource();
      searchResource.mockResolvedValue(resource);
      const mutateAsync = vi.fn().mockResolvedValue({
        entId: resource.assetId,
        thumbnail: resource.thumbnail,
      });
      const onSuccess = vi.fn();

      const { user } = render(
        <ResourceModal
          mode="update"
          isOpen
          resourceId="resource-1"
          onCancel={noop}
          onSuccess={onSuccess}
          updateResource={{ mutateAsync } as any}
        />,
      );

      await waitFor(() =>
        expect(screen.getByRole('dialog')).toBeInTheDocument(),
      );

      await pokeTitleAndSubmit(user);

      await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
      expect(updateResourceApi).not.toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith(
        { entId: resource.assetId, thumbnail: resource.thumbnail },
        expect.objectContaining({ entId: resource.assetId }),
      );
    });

    it('catches a thrown error, logs it, and does not call onSuccess', async () => {
      const resource = buildResource();
      searchResource.mockResolvedValue(resource);
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      const onSuccess = vi.fn();
      const boom = new Error('boom');
      updateResourceApi.mockRejectedValue(boom);

      const { user } = render(
        <ResourceModal
          mode="update"
          isOpen
          resourceId="resource-1"
          onCancel={noop}
          onSuccess={onSuccess}
        />,
      );

      await waitFor(() =>
        expect(screen.getByRole('dialog')).toBeInTheDocument(),
      );

      await pokeTitleAndSubmit(user);

      await waitFor(() => expect(consoleError).toHaveBeenCalledWith(boom));
      expect(onSuccess).not.toHaveBeenCalled();

      consoleError.mockRestore();
    });
  });
});
