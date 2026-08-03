import { render, screen, waitFor } from '~/setup';
import { SaveBookmark } from './SaveBookmark';

const input = () => screen.getByTestId('common-save-bookmark-name-input');
const saveButton = () => screen.getByTestId('common-save-bookmark-save-button');

describe('SaveBookmark', () => {
  it('cannot be saved while the name is empty', () => {
    render(<SaveBookmark onSave={vi.fn()} />);

    expect(saveButton()).toBeDisabled();
  });

  it('enables the save button as soon as a name is typed', async () => {
    const { user } = render(<SaveBookmark onSave={vi.fn()} />);

    await user.type(input(), 'Ma classe');

    expect(saveButton()).toBeEnabled();
  });

  it('saves the typed name and clears the field', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { user } = render(<SaveBookmark onSave={onSave} />);

    await user.type(input(), 'Ma classe');
    await user.click(saveButton());

    expect(onSave).toHaveBeenCalledWith('Ma classe');
    await waitFor(() => expect(input()).toHaveValue(''));
  });

  it('locks the button while the save is in flight', async () => {
    let resolveSave: () => void = () => {};
    const onSave = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        }),
    );
    const { user } = render(<SaveBookmark onSave={onSave} />);

    await user.type(input(), 'Ma classe');
    await user.click(saveButton());

    expect(saveButton()).toBeDisabled();

    resolveSave();
    await waitFor(() => expect(input()).toHaveValue(''));
  });
});
