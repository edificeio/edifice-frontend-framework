import { createRef } from 'react';
import { act, render, screen } from '~/setup';
import { UserRightsList, UserRightsListRef } from './UserRightsList';
import type { BookmarkInput, ResourceRights, SharingItem } from './types/types';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockResourceRights: ResourceRights = {
  read: { priority: 1, default: true, requires: [], excludes: [] },
  contrib: {
    priority: 2,
    default: false,
    requires: ['read'],
    excludes: [],
  },
  publish: {
    priority: 3,
    default: false,
    requires: ['contrib', 'read'],
    excludes: [],
  },
  manager: {
    priority: 4,
    default: false,
    requires: ['publish', 'contrib', 'read'],
    excludes: [],
  },
  comment: {
    priority: 5,
    default: false,
    requires: ['read'],
    excludes: [],
  },
};

const mockSharings: SharingItem[] = [
  {
    recipientId: 'user-1',
    recipientType: 'user',
    permission: ['read'],
    displayName: 'Marie Dupont',
  },
  {
    recipientId: 'user-2',
    recipientType: 'user',
    permission: ['read', 'comment'],
    displayName: 'Jean Martin',
  },
];

const mockBookmark: BookmarkInput = {
  id: 'bookmark-1',
  name: 'Parents CE2',
  users: [
    { id: 'bk-user-1', displayName: 'Alice Durand' },
    { id: 'bk-user-2', displayName: 'Bob Leroy' },
  ],
};

const defaultProps = {
  resourceRights: mockResourceRights,
  isReadOnly: false,
  isLoading: false,
  ownerId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
  isCreating: true,
  initialSharings: mockSharings,
  onChange: vi.fn(),
  onAddItems: vi.fn(),
  onDeleteItems: vi.fn(),
};

function renderList(
  overrides: Partial<React.ComponentProps<typeof UserRightsList>> = {},
  ref?: React.RefObject<UserRightsListRef>,
) {
  return render(<UserRightsList ref={ref} {...defaultProps} {...overrides} />);
}

function getRows() {
  return screen.getAllByTestId('user-rights-list-item-row');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('UserRightsList', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the owner row and initial sharings', () => {
      renderList();
      const rows = getRows();
      // owner + 2 sharings
      expect(rows.length).toBe(3);
      expect(screen.getByText('Marie Dupont')).toBeInTheDocument();
      expect(screen.getByText('Jean Martin')).toBeInTheDocument();
    });

    it('renders a loading state instead of the table', () => {
      renderList({ isLoading: true });
      expect(screen.queryAllByTestId('user-rights-list-item-row')).toHaveLength(
        0,
      );
    });

    it('disables checkboxes and hides delete buttons when read-only', () => {
      renderList({ isReadOnly: true });
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeDisabled();
      });
      expect(
        screen.queryByTestId('user-rights-list-close-button'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Rights toggle', () => {
    it('calls onChange when toggling a right on a user', async () => {
      const onChange = vi.fn();
      const { user } = renderList({ onChange });

      const contribCheckbox = screen.getByLabelText('Marie Dupont - contrib');
      await user.click(contribCheckbox);

      expect(onChange).toHaveBeenCalledTimes(1);
      const updatedItems: SharingItem[] = onChange.mock.calls[0][0];
      const marie = updatedItems.find((item) => item.recipientId === 'user-1');
      expect(marie?.permission).toContain('contrib');
      expect(marie?.permission).toContain('read');
    });

    it('transitively removes dependent rights when unchecking a required right', async () => {
      const onChange = vi.fn();
      const { user } = renderList({
        onChange,
        initialSharings: [
          {
            recipientId: 'user-1',
            recipientType: 'user',
            permission: ['read', 'contrib', 'publish'],
            displayName: 'Marie Dupont',
          },
        ],
      });

      // Uncheck read → should also remove contrib and publish
      const readCheckbox = screen.getByLabelText('Marie Dupont - read');
      await user.click(readCheckbox);

      const updatedItems: SharingItem[] = onChange.mock.calls[0][0];
      const marie = updatedItems.find((item) => item.recipientId === 'user-1');
      expect(marie?.permission).not.toContain('read');
      expect(marie?.permission).not.toContain('contrib');
      expect(marie?.permission).not.toContain('publish');
    });
  });

  describe('Delete item', () => {
    it('removes a user and calls onDeleteItems', async () => {
      const onChange = vi.fn();
      const onDeleteItems = vi.fn();
      const { user } = renderList({ onChange, onDeleteItems });

      const deleteButton = screen.getByTitle(/close Marie Dupont/i);
      await user.click(deleteButton);

      expect(onDeleteItems).toHaveBeenCalledTimes(1);
      expect(onDeleteItems).toHaveBeenCalledWith([
        expect.objectContaining({ recipientId: 'user-1' }),
      ]);
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Add item via ref', () => {
    it('adds a user via ref.addItem', () => {
      const onAddItems = vi.fn();
      const ref = createRef<UserRightsListRef>();
      renderList({ onAddItems }, ref);

      act(() => {
        ref.current?.addItem({
          recipientId: 'user-new',
          recipientType: 'user',
          permission: ['read'],
          displayName: 'Nouvel utilisateur',
        });
      });

      expect(screen.getByText('Nouvel utilisateur')).toBeInTheDocument();
      expect(onAddItems).toHaveBeenCalledWith([
        expect.objectContaining({ recipientId: 'user-new' }),
      ]);
    });

    it('ignores duplicate recipientId', () => {
      const onAddItems = vi.fn();
      const ref = createRef<UserRightsListRef>();
      renderList({ onAddItems }, ref);

      act(() => {
        ref.current?.addItem({
          recipientId: 'user-1',
          recipientType: 'user',
          permission: ['read'],
          displayName: 'Duplicate Marie',
        });
      });

      expect(screen.queryByText('Duplicate Marie')).not.toBeInTheDocument();
      expect(onAddItems).not.toHaveBeenCalled();
    });
  });

  describe('Bookmark support', () => {
    it('adds a bookmark via ref and displays the bookmark row', () => {
      const onAddItems = vi.fn();
      const ref = createRef<UserRightsListRef>();
      renderList({ onAddItems }, ref);

      act(() => {
        ref.current?.addItem(mockBookmark);
      });

      expect(
        screen.getByTestId('user-rights-list-bookmark-row'),
      ).toBeInTheDocument();
      expect(screen.getByText('Parents CE2')).toBeInTheDocument();
      // Users are not visible (collapsed by default)
      expect(screen.queryByText('Alice Durand')).not.toBeInTheDocument();
      // onAddItems called with all bookmark users
      expect(onAddItems).toHaveBeenCalledWith([
        expect.objectContaining({ recipientId: 'bk-user-1' }),
        expect.objectContaining({ recipientId: 'bk-user-2' }),
      ]);
    });

    it('expands bookmark to show users', async () => {
      const ref = createRef<UserRightsListRef>();
      const { user } = renderList({}, ref);

      act(() => {
        ref.current?.addItem(mockBookmark);
      });

      const expandButton = screen.getByText('Parents CE2');
      await user.click(expandButton);

      expect(screen.getByText('Alice Durand')).toBeInTheDocument();
      expect(screen.getByText('Bob Leroy')).toBeInTheDocument();
    });

    it('does not show delete button on bookmark users', async () => {
      const ref = createRef<UserRightsListRef>();
      const { user } = renderList({}, ref);

      act(() => {
        ref.current?.addItem(mockBookmark);
      });

      await user.click(screen.getByText('Parents CE2'));

      // Regular users have delete buttons, bookmark users do not
      const userDeleteButtons = screen.getAllByTestId(
        'user-rights-list-close-button',
      );
      expect(userDeleteButtons).toHaveLength(2);
      // Bookmark row has its own delete button
      expect(
        screen.getByTestId('user-rights-list-bookmark-close-button'),
      ).toBeInTheDocument();
    });

    it('toggles a right on the bookmark row and applies to all its users', async () => {
      const onChange = vi.fn();
      const ref = createRef<UserRightsListRef>();
      const { user } = renderList({ onChange }, ref);

      act(() => {
        ref.current?.addItem(mockBookmark);
      });
      onChange.mockClear();

      const contribCheckbox = screen.getByLabelText('Parents CE2 - contrib');
      await user.click(contribCheckbox);

      expect(onChange).toHaveBeenCalled();
      const updatedItems: SharingItem[] = onChange.mock.calls[0][0];
      const bookmarkUsers = updatedItems.filter((item) =>
        ['bk-user-1', 'bk-user-2'].includes(item.recipientId),
      );
      bookmarkUsers.forEach((bookmarkUser) => {
        expect(bookmarkUser.permission).toContain('contrib');
        expect(bookmarkUser.permission).toContain('read');
      });
    });

    it('deletes a bookmark and removes all its users', async () => {
      const onDeleteItems = vi.fn();
      const onChange = vi.fn();
      const ref = createRef<UserRightsListRef>();
      const { user } = renderList({ onDeleteItems, onChange }, ref);

      act(() => {
        ref.current?.addItem(mockBookmark);
      });
      onDeleteItems.mockClear();

      const bookmarkDeleteButton = screen.getByTestId(
        'user-rights-list-bookmark-close-button',
      );
      await user.click(bookmarkDeleteButton);

      expect(
        screen.queryByTestId('user-rights-list-bookmark-row'),
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Alice Durand')).not.toBeInTheDocument();
      expect(onDeleteItems).toHaveBeenCalledWith([
        expect.objectContaining({ recipientId: 'bk-user-1' }),
        expect.objectContaining({ recipientId: 'bk-user-2' }),
      ]);
    });

    it('ignores duplicate bookmark', () => {
      const onAddItems = vi.fn();
      const ref = createRef<UserRightsListRef>();
      renderList({ onAddItems }, ref);

      act(() => {
        ref.current?.addItem(mockBookmark);
      });
      onAddItems.mockClear();

      act(() => {
        ref.current?.addItem(mockBookmark);
      });

      expect(onAddItems).not.toHaveBeenCalled();
      expect(
        screen.getAllByTestId('user-rights-list-bookmark-row'),
      ).toHaveLength(1);
    });

    it('skips bookmark users that already exist in the list', () => {
      const onAddItems = vi.fn();
      const ref = createRef<UserRightsListRef>();
      const bookmarkWithExistingUser: BookmarkInput = {
        id: 'bookmark-overlap',
        name: 'Overlap Bookmark',
        users: [
          { id: 'user-1', displayName: 'Marie Dupont' },
          { id: 'new-user', displayName: 'New User' },
        ],
      };
      renderList({ onAddItems }, ref);

      act(() => {
        ref.current?.addItem(bookmarkWithExistingUser);
      });

      // Only new-user should have been added
      expect(onAddItems).toHaveBeenCalledWith([
        expect.objectContaining({ recipientId: 'new-user' }),
      ]);
    });
  });

  describe('Save bookmark', () => {
    it('shows save bookmark form when button is clicked', async () => {
      const onSaveBookmark = vi.fn().mockResolvedValue(undefined);
      const { user } = renderList({ onSaveBookmark });

      const showButton = screen.getByTestId(
        'common-user-rights-list-share-bookmark-show-button',
      );
      await user.click(showButton);

      expect(
        screen.getByTestId('common-save-bookmark-name-input'),
      ).toBeInTheDocument();
    });

    it('hides save bookmark button when onSaveBookmark is not provided', () => {
      renderList({ onSaveBookmark: undefined });
      expect(
        screen.queryByTestId(
          'common-user-rights-list-share-bookmark-show-button',
        ),
      ).not.toBeInTheDocument();
    });
  });
});
