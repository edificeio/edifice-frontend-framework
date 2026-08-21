import { render, screen, waitFor, within } from '~/setup';
import NotificationListContainer from './NotificationListContainer';

// jsdom doesn't implement IntersectionObserver, used by the list's infinite
// scroll sentinel; stub it so the container can mount in this test file.
beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
});

const openFilterModal = async (user: ReturnType<typeof render>['user']) => {
  const filterButton = await screen.findByTestId('notification-filter-button');
  await user.click(filterButton);
  return screen.findByRole('dialog');
};

describe('NotificationListContainer', () => {
  // The MSW mock for GET /userbook/preference/timeline returns
  // { type: ['BLOG', 'WIKI'] } — this test relies on that default and must
  // run before any test that saves a new selection (which mutates the mock).
  it('initializes the filter selection from the saved timeline preference', async () => {
    const { user } = render(<NotificationListContainer />);

    const modal = await openFilterModal(user);
    expect(
      within(modal).getByText('Filtrer les notifications'),
    ).toBeInTheDocument();

    const blogCheckbox = within(
      within(modal).getByText('Blog').closest('label')!,
    ).getByRole('checkbox') as HTMLInputElement;
    const wikiCheckbox = within(
      within(modal).getByText('Wiki').closest('label')!,
    ).getByRole('checkbox') as HTMLInputElement;
    const archiveCheckbox = within(
      within(modal).getByText('archive').closest('label')!,
    ).getByRole('checkbox') as HTMLInputElement;

    expect(blogCheckbox.checked).toBe(true);
    expect(wikiCheckbox.checked).toBe(true);
    expect(archiveCheckbox.checked).toBe(false);

    const checkboxes = within(modal).getAllByRole(
      'checkbox',
    ) as HTMLInputElement[];
    const totalTypes = checkboxes.length - 1;
    // only 2 types (blog, wiki) come from the saved preference
    expect(
      within(modal).getByText(`2 / ${totalTypes} sélectionnées`),
    ).toBeInTheDocument();
    // "select all" checkbox isn't checked since not every type is selected
    expect(checkboxes[0].checked).toBe(false);
  });

  it('discards the selection when the filter modal is cancelled', async () => {
    const { user } = render(<NotificationListContainer />);

    const modal = await openFilterModal(user);
    const checkboxes = within(modal).getAllByRole(
      'checkbox',
    ) as HTMLInputElement[];
    const initiallyChecked = checkboxes.map((checkbox) => checkbox.checked);

    await user.click(checkboxes[1]);
    expect(checkboxes[1].checked).toBe(!initiallyChecked[1]);

    await user.click(within(modal).getByText('Cancel'));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    const reopenedModal = await openFilterModal(user);
    const reopenedCheckboxes = within(reopenedModal).getAllByRole(
      'checkbox',
    ) as HTMLInputElement[];
    expect(reopenedCheckboxes.map((checkbox) => checkbox.checked)).toEqual(
      initiallyChecked,
    );
  });

  it('persists the new selection to the timeline preference on Enregistrer', async () => {
    const { user } = render(<NotificationListContainer />);

    const modal = await openFilterModal(user);
    const wikiCheckbox = within(
      within(modal).getByText('Wiki').closest('label')!,
    ).getByRole('checkbox') as HTMLInputElement;
    expect(wikiCheckbox.checked).toBe(true);

    await user.click(wikiCheckbox);
    expect(wikiCheckbox.checked).toBe(false);

    await user.click(within(modal).getByText('Enregistrer'));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // A completely fresh mount (own QueryClient) re-fetches the preference
    // from the server, proving the PUT actually persisted it.
    const { user: freshUser } = render(<NotificationListContainer />);
    const freshModal = await openFilterModal(freshUser);
    const freshWikiCheckbox = within(
      within(freshModal).getByText('Wiki').closest('label')!,
    ).getByRole('checkbox') as HTMLInputElement;
    expect(freshWikiCheckbox.checked).toBe(false);
  });
});
