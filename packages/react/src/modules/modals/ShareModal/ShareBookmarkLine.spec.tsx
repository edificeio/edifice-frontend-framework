import {
  ShareRight,
  ShareRightAction,
  ShareRightWithVisibles,
} from '@edifice.io/client';

import { render, screen } from '~/setup';
import { ShareBookmarkLine } from './ShareBookmarkLine';

// Minimal ShareRight fixture builder
const buildShareRight = (overrides: Partial<ShareRight> = {}): ShareRight => ({
  id: 'right-1',
  type: 'user',
  displayName: 'Right 1',
  avatarUrl: '',
  directoryUrl: '',
  actions: [],
  ...overrides,
});

// Minimal ShareRightWithVisibles fixture builder
const buildShareRights = (
  rights: ShareRight[],
  overrides: Partial<ShareRightWithVisibles> = {},
): ShareRightWithVisibles => ({
  rights,
  visibleUsers: [],
  visibleGroups: [],
  visibleBookmarks: [],
  ...overrides,
});

// Minimal ShareRightAction fixture builder
const buildShareRightAction = (
  overrides: Partial<ShareRightAction> = {},
): ShareRightAction => ({
  id: 'read',
  displayName: 'read',
  ...overrides,
});

interface RenderLineOverrides {
  shareRights?: ShareRightWithVisibles;
  shareRightActions?: ShareRightAction[];
  showBookmark?: boolean;
  toggleRight?: (...args: any[]) => void;
  toggleBookmark?: () => void;
  onDeleteRow?: (...args: any[]) => void;
}

// Renders the component inside a real table, since it returns raw <tr> elements.
const renderLine = (overrides: RenderLineOverrides = {}) => {
  const shareRights = overrides.shareRights ?? buildShareRights([]);
  const shareRightActions = overrides.shareRightActions ?? [
    buildShareRightAction(),
  ];
  const toggleRight = overrides.toggleRight ?? vi.fn();
  const toggleBookmark = overrides.toggleBookmark ?? vi.fn();
  const onDeleteRow = overrides.onDeleteRow ?? vi.fn();
  const showBookmark = overrides.showBookmark ?? false;

  return render(
    <table>
      <tbody>
        <ShareBookmarkLine
          shareRights={shareRights}
          shareRightActions={shareRightActions}
          showBookmark={showBookmark}
          toggleRight={toggleRight}
          toggleBookmark={toggleBookmark}
          onDeleteRow={onDeleteRow}
        />
      </tbody>
    </table>,
  );
};

describe('ShareBookmarkLine', () => {
  it('renders one row per right in shareRights.rights', () => {
    // Use type "group" here so no profile suffix is appended to displayName,
    // keeping this assertion focused on row count / naming only.
    const rights = [
      buildShareRight({
        id: 'right-1',
        type: 'group',
        displayName: 'First right',
      }),
      buildShareRight({
        id: 'right-2',
        type: 'group',
        displayName: 'Second right',
      }),
    ];

    renderLine({ shareRights: buildShareRights(rights) });

    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByText('First right')).toBeInTheDocument();
    expect(screen.getByText('Second right')).toBeInTheDocument();
  });

  it('renders an Avatar for a user type share right', () => {
    const rights = [
      buildShareRight({
        type: 'user',
        avatarUrl: 'https://example.com/avatar.png',
      }),
    ];

    const { container } = renderLine({ shareRights: buildShareRights(rights) });

    const img = container.querySelector(
      'img[src="https://example.com/avatar.png"]',
    );
    expect(img).toBeInTheDocument();
  });

  it('renders a plain div with IconUsers for a group type share right', () => {
    const rights = [buildShareRight({ type: 'group' })];

    const { container } = renderLine({ shareRights: buildShareRights(rights) });

    const groupAvatar = container.querySelector('div.avatar-xs');
    expect(groupAvatar).toBeInTheDocument();
    expect(groupAvatar?.querySelector('svg')).toBeInTheDocument();
  });

  it('renders IconBookmark for a sharebookmark type share right', () => {
    const rights = [
      buildShareRight({ type: 'sharebookmark', displayName: 'My bookmark' }),
    ];

    const { container } = renderLine({ shareRights: buildShareRights(rights) });

    // First cell of the row holds the avatar mapping.
    const firstCell = container.querySelector('tr td');
    expect(firstCell?.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('div.avatar-xs')).not.toBeInTheDocument();
  });

  it('renders no avatar for an unrecognized share right type', () => {
    const rights = [
      buildShareRight({
        type: 'unknown' as unknown as ShareRight['type'],
      }),
    ];

    const { container } = renderLine({ shareRights: buildShareRights(rights) });

    const firstCell = container.querySelector('tr td');
    expect(firstCell?.querySelector('svg, img')).not.toBeInTheDocument();
  });

  it('renders a clickable bookmark button that calls toggleBookmark and rotates its icon', async () => {
    const toggleBookmark = vi.fn();
    const rights = [
      buildShareRight({ type: 'sharebookmark', displayName: 'My bookmark' }),
    ];

    const { user, rerender } = renderLine({
      shareRights: buildShareRights(rights),
      toggleBookmark,
      showBookmark: false,
    });

    const button = screen.getByRole('button', { name: 'My bookmark' });
    const icon = button.querySelector('svg');
    expect(icon?.getAttribute('style')).toContain('rotate: 0deg');

    await user.click(button);
    expect(toggleBookmark).toHaveBeenCalledTimes(1);

    rerender(
      <table>
        <tbody>
          <ShareBookmarkLine
            shareRights={buildShareRights(rights)}
            shareRightActions={[buildShareRightAction()]}
            showBookmark={true}
            toggleRight={vi.fn()}
            toggleBookmark={toggleBookmark}
            onDeleteRow={vi.fn()}
          />
        </tbody>
      </table>,
    );

    const rotatedIcon = screen
      .getByRole('button', { name: 'My bookmark' })
      .querySelector('svg');
    expect(rotatedIcon?.getAttribute('style')).toContain('rotate: -180deg');
  });

  it('renders displayName as plain text for non-bookmark rows', () => {
    const rights = [
      buildShareRight({ type: 'group', displayName: 'My group' }),
    ];

    renderLine({ shareRights: buildShareRights(rights) });

    expect(
      screen.queryByRole('button', { name: 'My group' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('My group')).toBeInTheDocument();
  });

  it('appends the profile suffix for user type rows when profile is set', () => {
    const rights = [
      buildShareRight({
        type: 'user',
        displayName: 'Jane Doe',
        profile: 'Student',
      }),
    ];

    const { container } = renderLine({ shareRights: buildShareRights(rights) });

    // The profile key isn't a registered translation, so t() returns it as-is.
    expect(container.querySelector('tr td:nth-child(2)')?.textContent).toBe(
      'Jane Doe (Student)',
    );
  });

  it('renders one checkbox per shareRightActions entry, reflecting hasRight', () => {
    const actions = [
      buildShareRightAction({ id: 'read', displayName: 'read' }),
      buildShareRightAction({ id: 'contrib', displayName: 'contrib' }),
    ];
    const rights = [
      buildShareRight({
        actions: [buildShareRightAction({ id: 'read', displayName: 'read' })],
      }),
    ];

    renderLine({
      shareRights: buildShareRights(rights),
      shareRightActions: actions,
    });

    const readCheckbox = screen.getByTestId(
      'share-right-read-checkbox',
    ) as HTMLInputElement;
    const contribCheckbox = screen.getByTestId(
      'share-right-contrib-checkbox',
    ) as HTMLInputElement;

    expect(readCheckbox.checked).toBe(true);
    expect(contribCheckbox.checked).toBe(false);
  });

  it('calls toggleRight with the share right and action name on checkbox change', async () => {
    const toggleRight = vi.fn();
    const actions = [buildShareRightAction({ id: 'contrib' })];
    const shareRight = buildShareRight({ actions: [] });

    const { user } = renderLine({
      shareRights: buildShareRights([shareRight]),
      shareRightActions: actions,
      toggleRight,
    });

    await user.click(screen.getByTestId('share-right-contrib-checkbox'));

    expect(toggleRight).toHaveBeenCalledTimes(1);
    expect(toggleRight).toHaveBeenCalledWith(shareRight, 'contrib');
  });

  it('disables checkboxes for a group share right with a disabled label', () => {
    const shareRight = buildShareRight({
      id: 'group-1',
      type: 'group',
    });

    renderLine({
      shareRights: buildShareRights([shareRight], {
        visibleGroups: [
          {
            id: 'group-1',
            displayName: 'Group 1',
            labels: ['CommunityMemberGroup'],
          },
        ],
      }),
    });

    const checkbox = screen.getByTestId(
      'share-right-read-checkbox',
    ) as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
  });

  it('does not disable checkboxes for a group share right without a disabled label', () => {
    const shareRight = buildShareRight({
      id: 'group-1',
      type: 'group',
    });

    renderLine({
      shareRights: buildShareRights([shareRight], {
        visibleGroups: [
          { id: 'group-1', displayName: 'Group 1', labels: ['SomeLabel'] },
        ],
      }),
    });

    const checkbox = screen.getByTestId(
      'share-right-read-checkbox',
    ) as HTMLInputElement;
    expect(checkbox.disabled).toBe(false);
  });

  it('shows the delete button for a non-bookmark-member, non-disabled row and calls onDeleteRow', async () => {
    const onDeleteRow = vi.fn();
    const shareRight = buildShareRight({ isBookmarkMember: false });

    const { user } = renderLine({
      shareRights: buildShareRights([shareRight]),
      onDeleteRow,
    });

    const closeButton = screen.getByTestId('share-right-close-button');
    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);
    expect(onDeleteRow).toHaveBeenCalledWith(shareRight);
  });

  it('hides the delete button when the share right is a bookmark member', () => {
    const shareRight = buildShareRight({
      isBookmarkMember: true,
      displayName: 'Bookmark member row',
    });

    renderLine({
      shareRights: buildShareRights([shareRight]),
      showBookmark: true,
    });

    expect(
      screen.queryByTestId('share-right-close-button'),
    ).not.toBeInTheDocument();
  });

  it('hides the delete button when the share right is disabled', () => {
    const shareRight = buildShareRight({ id: 'group-1', type: 'group' });

    renderLine({
      shareRights: buildShareRights([shareRight], {
        visibleGroups: [
          {
            id: 'group-1',
            displayName: 'Group 1',
            labels: ['CommunityMemberGroup'],
          },
        ],
      }),
    });

    expect(
      screen.queryByTestId('share-right-close-button'),
    ).not.toBeInTheDocument();
  });

  it('renders nothing for a group with a hidden label', () => {
    const shareRight = buildShareRight({
      id: 'group-1',
      type: 'group',
      displayName: 'Hidden admin group',
    });

    renderLine({
      shareRights: buildShareRights([shareRight], {
        visibleGroups: [
          {
            id: 'group-1',
            displayName: 'Group 1',
            labels: ['CommunityAdminGroup'],
          },
        ],
      }),
    });

    expect(screen.queryByText('Hidden admin group')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('row')).toHaveLength(0);
  });

  it('hides a bookmark member row when showBookmark is false and shows it when true', () => {
    // Use type "group" so no profile suffix is appended to displayName.
    const shareRight = buildShareRight({
      type: 'group',
      isBookmarkMember: true,
      displayName: 'Member row',
    });

    const { rerender } = renderLine({
      shareRights: buildShareRights([shareRight]),
      showBookmark: false,
    });

    expect(screen.queryByText('Member row')).not.toBeInTheDocument();

    rerender(
      <table>
        <tbody>
          <ShareBookmarkLine
            shareRights={buildShareRights([shareRight])}
            shareRightActions={[buildShareRightAction()]}
            showBookmark={true}
            toggleRight={vi.fn()}
            toggleBookmark={vi.fn()}
            onDeleteRow={vi.fn()}
          />
        </tbody>
      </table>,
    );

    expect(screen.getByText('Member row')).toBeInTheDocument();
  });
});
