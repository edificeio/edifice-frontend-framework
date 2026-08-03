import { App, ILinkedResource } from '@edifice.io/client';
import { render, screen, waitFor } from '~/setup';
import { InternalLinker } from './InternalLinker';

const { getWebApp, useResourceSearch, loadResources, useEdificeTheme } =
  vi.hoisted(() => ({
    getWebApp: vi.fn(),
    useResourceSearch: vi.fn(),
    loadResources: vi.fn(),
    useEdificeTheme: vi.fn(),
  }));

vi.mock('@edifice.io/client', () => ({
  odeServices: { session: () => ({ getWebApp }) },
}));

vi.mock('../../../../hooks/useResourceSearch', () => ({ useResourceSearch }));

vi.mock(
  '../../../../providers/EdificeThemeProvider/EdificeThemeProvider.hook',
  () => ({ useEdificeTheme }),
);

// The card only needs to be identifiable and clickable here.
vi.mock('../../LinkerCard/LinkerCard', () => ({
  default: ({
    doc,
    isSelected,
    onClick,
  }: {
    doc: ILinkedResource;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      data-testid={`card-${doc.assetId}`}
      data-selected={isSelected}
      onClick={onClick}
    >
      {doc.name}
    </button>
  ),
}));

function resource(partial: Partial<ILinkedResource> & { assetId: string }) {
  return {
    name: `Resource ${partial.assetId}`,
    path: `/blog/${partial.assetId}`,
    creatorName: 'Pascal',
    description: '',
    modifiedAt: '2026-01-01',
    application: 'blog',
    ...partial,
  } as unknown as ILinkedResource;
}

const applications = [
  { application: 'blog', displayName: 'Blog' },
  { application: 'wiki', displayName: 'Wiki' },
];

function setup(props: Partial<Parameters<typeof InternalLinker>[0]> = {}) {
  const onChange = vi.fn();
  const onSelect = vi.fn();

  useResourceSearch.mockReturnValue({
    resourceApplications: ['blog', 'wiki'],
    loadResources,
  });
  useEdificeTheme.mockReturnValue({ theme: { bootstrapVersion: 'one' } });

  return {
    ...render(
      <InternalLinker
        appCode={'blog' as App}
        multiple
        applicationList={applications}
        onChange={onChange}
        onSelect={onSelect}
        {...props}
      />,
    ),
    onChange,
    onSelect,
  };
}

// The docs i18n bundle translates these keys, so the assertions target the
// English labels rather than the keys.
const searchField = () => screen.getByPlaceholderText('Search');
const EMPTY_TEXT = /Select, at the top left, the application/;
const NOT_FOUND_TEXT = 'The resource you are looking for does not exist.';

describe('InternalLinker', () => {
  beforeEach(() => {
    getWebApp.mockResolvedValue({ displayName: 'Blog' });
    loadResources.mockResolvedValue([]);
  });

  describe('application selector', () => {
    it('lists the applications given by the caller, sorted by name', async () => {
      const { user } = setup({
        applicationList: [
          { application: 'wiki', displayName: 'Wiki' },
          { application: 'blog', displayName: 'Blog' },
        ],
        defaultAppCode: null,
      });

      await user.click(screen.getByRole('button', { name: /choose/i }));

      const items = screen.getAllByRole('menuitem');
      expect(items[0]).toHaveTextContent('Blog');
      expect(items[1]).toHaveTextContent('Wiki');
    });

    it('loads the applications from the platform when none is given', async () => {
      setup({ applicationList: undefined, defaultAppCode: null });

      await waitFor(() => expect(getWebApp).toHaveBeenCalledWith('blog'));
      expect(getWebApp).toHaveBeenCalledWith('wiki');
    });

    it('notifies the caller when an application is picked', async () => {
      const { user, onChange } = setup({ defaultAppCode: null });

      await user.click(screen.getByRole('button', { name: /choose/i }));
      await user.click(screen.getByRole('menuitem', { name: 'Wiki' }));

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ application: 'wiki' }),
      );
    });

    it('can be hidden altogether', () => {
      setup({ showApplicationSelector: false, defaultAppCode: null });

      expect(
        screen.queryByRole('button', { name: /choose/i }),
      ).not.toBeInTheDocument();
    });

    it('can be disabled', () => {
      setup({ disableApplicationSelector: true, defaultAppCode: null });

      expect(screen.getByRole('button', { name: /choose/i })).toBeDisabled();
    });

    it('preselects the only application available', async () => {
      setup({
        applicationList: [{ application: 'blog', displayName: 'Blog' }],
        defaultAppCode: null,
      });

      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: /Blog/ }),
        ).toBeInTheDocument(),
      );
    });

    it('preselects the application requested by the caller', async () => {
      setup({ defaultAppCode: 'wiki' as App });

      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: /Wiki/ }),
        ).toBeInTheDocument(),
      );
    });
  });

  describe('resource list', () => {
    it('shows an empty screen while no application is selected', () => {
      setup({ defaultAppCode: null });

      expect(screen.getByText(EMPTY_TEXT)).toBeInTheDocument();
      expect(searchField()).toBeDisabled();
    });

    it('lists the resources given by the caller, most recent first', async () => {
      setup({
        defaultAppCode: 'blog' as App,
        resourceList: [
          resource({ assetId: 'old', modifiedAt: '2025-01-01' }),
          resource({ assetId: 'recent', modifiedAt: '2026-06-01' }),
        ],
      });

      await waitFor(() =>
        expect(screen.getByTestId('card-recent')).toBeInTheDocument(),
      );
      const cards = screen.getAllByTestId(/^card-/);
      expect(cards[0]).toHaveAttribute('data-testid', 'card-recent');
    });

    it('loads the resources of the selected application otherwise', async () => {
      loadResources.mockResolvedValue([resource({ assetId: 'loaded' })]);

      setup({ defaultAppCode: 'blog' as App });

      await waitFor(() =>
        expect(screen.getByTestId('card-loaded')).toBeInTheDocument(),
      );
      expect(loadResources).toHaveBeenCalledWith(
        expect.objectContaining({ application: 'blog' }),
      );
    });

    it('shows the application empty screen when it holds nothing', async () => {
      setup({ defaultAppCode: 'blog' as App, resourceList: [] });

      await waitFor(() =>
        expect(screen.getByText(NOT_FOUND_TEXT)).toBeInTheDocument(),
      );
    });

    it('falls back to an empty list when the platform fails', async () => {
      loadResources.mockRejectedValue(new Error('search down'));

      setup({ defaultAppCode: 'blog' as App });

      await waitFor(() =>
        expect(screen.getByText(NOT_FOUND_TEXT)).toBeInTheDocument(),
      );
    });

    it('applies the caller resource filter', async () => {
      setup({
        defaultAppCode: 'blog' as App,
        resourceList: [
          resource({ assetId: 'kept' }),
          resource({ assetId: 'dropped' }),
        ],
        resourceFilter: (candidate) => candidate.assetId === 'kept',
      });

      await waitFor(() =>
        expect(screen.getByTestId('card-kept')).toBeInTheDocument(),
      );
      expect(screen.queryByTestId('card-dropped')).not.toBeInTheDocument();
    });
  });

  describe('searching', () => {
    it('filters the given resources by name', async () => {
      const { user } = setup({
        defaultAppCode: 'blog' as App,
        resourceList: [
          resource({ assetId: 'a', name: 'Recette de crêpes' }),
          resource({ assetId: 'b', name: 'Sortie scolaire' }),
        ],
      });
      await waitFor(() =>
        expect(screen.getByTestId('card-a')).toBeInTheDocument(),
      );

      await user.type(searchField(), 'crêpes');

      await waitFor(() =>
        expect(screen.queryByTestId('card-b')).not.toBeInTheDocument(),
      );
      expect(screen.getByTestId('card-a')).toBeInTheDocument();
    });

    it('also matches the author and the description', async () => {
      const { user } = setup({
        defaultAppCode: 'blog' as App,
        resourceList: [
          resource({ assetId: 'byAuthor', creatorName: 'Marie Dupont' }),
          resource({ assetId: 'byText', description: 'compte rendu' }),
          resource({ assetId: 'other', name: 'Autre' }),
        ],
      });

      await user.type(searchField(), 'marie');

      await waitFor(() =>
        expect(screen.queryByTestId('card-other')).not.toBeInTheDocument(),
      );
      expect(screen.getByTestId('card-byAuthor')).toBeInTheDocument();
    });

    it('hands the search over to the caller when it provides one', async () => {
      const onSearch = vi
        .fn()
        .mockResolvedValue([resource({ assetId: 'from-caller' })]);
      setup({ defaultAppCode: 'blog' as App, onSearch });

      await waitFor(() =>
        expect(screen.getByTestId('card-from-caller')).toBeInTheDocument(),
      );
      expect(onSearch).toHaveBeenCalled();
    });

    it('empties the list when the caller search fails', async () => {
      const onSearch = vi.fn().mockRejectedValue(new Error('nope'));
      setup({ defaultAppCode: 'blog' as App, onSearch });

      await waitFor(() =>
        expect(screen.getByText(NOT_FOUND_TEXT)).toBeInTheDocument(),
      );
    });
  });

  describe('selection', () => {
    it('selects a resource and reports it', async () => {
      const { user, onSelect } = setup({
        defaultAppCode: 'blog' as App,
        resourceList: [resource({ assetId: 'a' })],
      });
      await waitFor(() =>
        expect(screen.getByTestId('card-a')).toBeInTheDocument(),
      );

      await user.click(screen.getByTestId('card-a'));

      expect(screen.getByTestId('card-a')).toHaveAttribute(
        'data-selected',
        'true',
      );
      expect(onSelect).toHaveBeenLastCalledWith([
        expect.objectContaining({ assetId: 'a' }),
      ]);
    });

    it('deselects a resource clicked twice', async () => {
      const { user, onSelect } = setup({
        defaultAppCode: 'blog' as App,
        resourceList: [resource({ assetId: 'a' })],
      });
      await waitFor(() =>
        expect(screen.getByTestId('card-a')).toBeInTheDocument(),
      );

      await user.click(screen.getByTestId('card-a'));
      await user.click(screen.getByTestId('card-a'));

      expect(onSelect).toHaveBeenLastCalledWith([]);
    });

    it('accumulates the selection in multiple mode', async () => {
      const { user, onSelect } = setup({
        defaultAppCode: 'blog' as App,
        resourceList: [resource({ assetId: 'a' }), resource({ assetId: 'b' })],
      });
      await waitFor(() =>
        expect(screen.getByTestId('card-a')).toBeInTheDocument(),
      );

      await user.click(screen.getByTestId('card-a'));
      await user.click(screen.getByTestId('card-b'));

      expect(onSelect).toHaveBeenLastCalledWith([
        expect.objectContaining({ assetId: 'a' }),
        expect.objectContaining({ assetId: 'b' }),
      ]);
    });

    it('replaces the selection in single mode', async () => {
      const { user, onSelect } = setup({
        multiple: false,
        defaultAppCode: 'blog' as App,
        resourceList: [resource({ assetId: 'a' }), resource({ assetId: 'b' })],
      });
      await waitFor(() =>
        expect(screen.getByTestId('card-a')).toBeInTheDocument(),
      );

      await user.click(screen.getByTestId('card-a'));
      await user.click(screen.getByTestId('card-b'));

      expect(onSelect).toHaveBeenLastCalledWith([
        expect.objectContaining({ assetId: 'b' }),
      ]);
    });

    it('preselects the resource requested by the caller', async () => {
      const { onSelect } = setup({
        defaultAppCode: 'blog' as App,
        defaultResourceId: 'a',
        resourceList: [resource({ assetId: 'a' })],
      });

      await waitFor(() =>
        expect(onSelect).toHaveBeenLastCalledWith([
          expect.objectContaining({ assetId: 'a' }),
        ]),
      );
    });

    it('ignores a default resource absent from the list', async () => {
      const { onSelect } = setup({
        defaultAppCode: 'blog' as App,
        defaultResourceId: 'ghost',
        resourceList: [resource({ assetId: 'a' })],
      });

      await waitFor(() =>
        expect(screen.getByTestId('card-a')).toBeInTheDocument(),
      );
      expect(onSelect).toHaveBeenLastCalledWith([]);
    });
  });

  describe('loading more', () => {
    it('offers a load-more button when the caller asks for it', async () => {
      const onLoadMore = vi.fn();
      const { user } = setup({
        defaultAppCode: 'blog' as App,
        resourceList: [resource({ assetId: 'a' })],
        hasMoreResources: true,
        onLoadMore,
      });

      await user.click(
        await screen.findByRole('button', { name: 'bbm.linker.see.more' }),
      );

      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it('honors a custom label', async () => {
      setup({
        defaultAppCode: 'blog' as App,
        resourceList: [resource({ assetId: 'a' })],
        hasMoreResources: true,
        loadMoreLabel: 'Charger la suite',
      });

      expect(
        await screen.findByRole('button', { name: 'Charger la suite' }),
      ).toBeInTheDocument();
    });

    it('offers no button by default', async () => {
      setup({
        defaultAppCode: 'blog' as App,
        resourceList: [resource({ assetId: 'a' })],
      });

      await waitFor(() =>
        expect(screen.getByTestId('card-a')).toBeInTheDocument(),
      );
      expect(
        screen.queryByRole('button', { name: 'bbm.linker.see.more' }),
      ).not.toBeInTheDocument();
    });
  });
});
