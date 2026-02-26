import { act, fireEvent, render, screen, waitFor } from '~/setup';
import { UserSearch } from './UserSearch';
import type { Visible } from './types/visible';
import { VisibleType } from './types/visible';

const mockVisibles: Visible[] = [
  {
    id: 'user-1',
    displayName: 'Marie Dupont',
    type: VisibleType.User,
    profile: '/profile/marie',
  },
  {
    id: 'user-2',
    displayName: 'Jean Martin',
    type: VisibleType.User,
    profile: '/profile/jean',
  },
];

const mockBookmarks: Visible[] = [
  {
    id: 'bookmark-1',
    displayName: 'Favori Mathématiques',
    type: VisibleType.ShareBookmark,
  },
];

function getInput() {
  return screen.getByTestId('combobox-search-input');
}

describe('UserSearch', () => {
  describe('Rendu initial', () => {
    it('affiche le placeholder par défaut', () => {
      const getSearchResults = vi.fn().mockResolvedValue({ results: [] });
      render(<UserSearch getSearchResults={getSearchResults} />);
      expect(getInput()).toHaveAttribute(
        'placeholder',
        'Rechercher un utilisateur',
      );
    });

    it('affiche le placeholder personnalisé', () => {
      const getSearchResults = vi.fn().mockResolvedValue({ results: [] });
      render(
        <UserSearch
          getSearchResults={getSearchResults}
          placeholder="Rechercher (min. 3 caractères)"
        />,
      );
      expect(getInput()).toHaveAttribute(
        'placeholder',
        'Rechercher (min. 3 caractères)',
      );
    });

    it("affiche les bookmarks comme options initiales à l'ouverture du dropdown", async () => {
      const getSearchResults = vi.fn().mockResolvedValue({ results: [] });
      const { user } = render(
        <UserSearch
          getSearchResults={getSearchResults}
          bookmarks={mockBookmarks}
        />,
      );
      const input = getInput();
      await user.click(input);
      await user.keyboard('a');
      await waitFor(() => {
        expect(screen.getByText('Favori Mathématiques')).toBeInTheDocument();
      });
    });

    it("n'appelle pas getSearchResults avant searchMinLength caractères (isAdmlcOrAdmc)", async () => {
      vi.useFakeTimers();
      const getSearchResults = vi.fn().mockResolvedValue({ results: [] });
      render(
        <UserSearch getSearchResults={getSearchResults} isAdmlcOrAdmc={true} />,
      );
      const input = getInput();
      fireEvent.change(input, { target: { value: 'ab' } });
      await act(async () => {
        vi.advanceTimersByTime(500);
        expect(getSearchResults).not.toHaveBeenCalled();
        fireEvent.change(input, { target: { value: 'abc' } });
        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        expect(getSearchResults).toHaveBeenCalledWith('abc');
        vi.useRealTimers();
      });
    });
  });

  describe('Saisie et debounce', () => {
    it('met à jour la valeur affichée à chaque frappe', async () => {
      const getSearchResults = vi.fn().mockResolvedValue({ results: [] });
      const { user } = render(
        <UserSearch getSearchResults={getSearchResults} />,
      );
      const input = getInput();
      await user.type(input, 'test');
      expect(input).toHaveValue('test');
    });

    it('appelle getSearchResults après 500 ms de debounce avec la valeur saisie', async () => {
      vi.useFakeTimers();
      const getSearchResults = vi.fn().mockResolvedValue({ results: [] });
      render(<UserSearch getSearchResults={getSearchResults} />);
      const input = getInput();
      fireEvent.change(input, { target: { value: 'x' } });
      expect(getSearchResults).not.toHaveBeenCalled();
      await act(async () => {
        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        expect(getSearchResults).toHaveBeenCalledTimes(1);
        expect(getSearchResults).toHaveBeenCalledWith('x');
        vi.useRealTimers();
      });
    });
  });

  describe('Résultats et chargement', () => {
    it('affiche bookmarks + résultats API après résolution, hors sharings', async () => {
      vi.useFakeTimers();
      const getSearchResults = vi
        .fn()
        .mockResolvedValue({ results: mockVisibles });
      render(
        <UserSearch
          getSearchResults={getSearchResults}
          bookmarks={mockBookmarks}
        />,
      );
      const input = getInput();
      fireEvent.change(input, { target: { value: 'marie' } });
      await act(async () => {
        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        await vi.runAllTimersAsync();
        vi.useRealTimers();
      });
      await waitFor(() => {
        expect(screen.getByText('Marie Dupont')).toBeInTheDocument();
      });
      expect(screen.getByText('Jean Martin')).toBeInTheDocument();
      expect(screen.getByText('Favori Mathématiques')).toBeInTheDocument();
    });

    it("affiche l'état de chargement pendant l'appel à getSearchResults", async () => {
      vi.useFakeTimers();
      let resolveSearch: (value: { results: Visible[] }) => void;
      const getSearchResults = vi.fn().mockImplementation(
        () =>
          new Promise<{ results: Visible[] }>((resolve) => {
            resolveSearch = resolve;
          }),
      );
      render(<UserSearch getSearchResults={getSearchResults} />);
      const input = getInput();
      fireEvent.change(input, { target: { value: 'x' } });
      await act(async () => {
        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        vi.useRealTimers();
      });
      await waitFor(() => {
        expect(getSearchResults).toHaveBeenCalled();
      });
      expect(screen.getByText('explorer.search.pending')).toBeInTheDocument();
      resolveSearch!({ results: [] });
      await waitFor(() => {
        expect(
          screen.queryByText('explorer.search.pending'),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Sélection et callback', () => {
    it('appelle onSearchResultsChange avec le Visible lors de la sélection', async () => {
      vi.useFakeTimers();
      const getSearchResults = vi
        .fn()
        .mockResolvedValue({ results: mockVisibles });
      const onSearchResultsChange = vi.fn();
      const { user } = render(
        <UserSearch
          getSearchResults={getSearchResults}
          onSearchResultsChange={onSearchResultsChange}
        />,
      );
      const input = getInput();
      fireEvent.change(input, { target: { value: 'marie' } });
      await act(async () => {
        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        vi.useRealTimers();
      });
      await waitFor(() => {
        expect(screen.getByText('Marie Dupont')).toBeInTheDocument();
      });
      const option = screen.getByRole('menuitem', { name: /Marie Dupont/ });
      await user.click(option);
      expect(onSearchResultsChange).toHaveBeenCalledTimes(1);
      expect(onSearchResultsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'user-1',
          displayName: 'Marie Dupont',
          type: VisibleType.User,
        }),
      );
    });

    it("retire l'élément sélectionné de la liste", async () => {
      vi.useFakeTimers();
      const getSearchResults = vi
        .fn()
        .mockResolvedValue({ results: mockVisibles });
      const onSearchResultsChange = vi.fn();
      const { user } = render(
        <UserSearch
          getSearchResults={getSearchResults}
          onSearchResultsChange={onSearchResultsChange}
        />,
      );
      const input = getInput();
      fireEvent.change(input, { target: { value: 'marie' } });
      await act(async () => {
        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        vi.useRealTimers();
      });
      await waitFor(() => {
        expect(screen.getByText('Marie Dupont')).toBeInTheDocument();
      });
      await user.click(screen.getByRole('menuitem', { name: /Marie Dupont/ }));
      vi.useFakeTimers();
      fireEvent.change(input, { target: { value: 'mar' } });
      await act(async () => {
        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        vi.useRealTimers();
      });
      await waitFor(() => {
        const items = screen.queryAllByRole('menuitem');
        const labels = items.map((el) => el.textContent ?? '');
        expect(labels.some((l) => l.includes('Marie Dupont'))).toBe(false);
        expect(labels.some((l) => l.includes('Jean Martin'))).toBe(true);
      });
    });
  });

  describe('initialSharings', () => {
    it("exclut les résultats dont l'id est dans initialSharings", async () => {
      vi.useFakeTimers();
      const getSearchResults = vi
        .fn()
        .mockResolvedValue({ results: mockVisibles });
      render(
        <UserSearch
          getSearchResults={getSearchResults}
          initialSharings={[
            {
              recipientId: 'user-1',
              recipientType: 'user',
              permission: ['read'],
              displayName: 'Marie Dupont',
            },
          ]}
        />,
      );
      const input = getInput();
      fireEvent.change(input, { target: { value: 'marie' } });
      await act(async () => {
        vi.advanceTimersByTime(500);
        await vi.runAllTimersAsync();
        vi.useRealTimers();
      });
      await waitFor(() => {
        expect(screen.getByText('Jean Martin')).toBeInTheDocument();
      });
      expect(screen.queryByText('Marie Dupont')).not.toBeInTheDocument();
    });
  });
});
