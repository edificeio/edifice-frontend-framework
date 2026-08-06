import { createRef } from 'react';

import { fireEvent, render, screen, waitFor } from '~/setup';
import { ShareBookmark } from './ShareBookmark';
import { BookmarkProps } from './hooks/useShareBookmark';

const buildBookmark = (
  overrides: Partial<BookmarkProps> = {},
): BookmarkProps => ({
  id: 'bookmark-1',
  name: '',
  ...overrides,
});

// A controllable promise, so we can assert the loading state mid-flight.
const createDeferred = () => {
  let resolve!: () => void;
  const promise = new Promise<void>((res) => {
    resolve = res;
  });
  return { promise, resolve };
};

describe('ShareBookmark', () => {
  it('calls onBookmarkChange when the input value changes', async () => {
    const onBookmarkChange = vi.fn();
    const refBookmark = createRef<HTMLInputElement>();

    const { user } = render(
      <ShareBookmark
        bookmark={buildBookmark({ name: '' })}
        refBookmark={refBookmark}
        onBookmarkChange={onBookmarkChange}
        onSave={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    await user.type(screen.getByTestId('share-bookmark-name-input'), 'a');

    expect(onBookmarkChange).toHaveBeenCalled();
  });

  it('disables the save button when bookmark name is empty', () => {
    render(
      <ShareBookmark
        bookmark={buildBookmark({ name: '' })}
        refBookmark={createRef<HTMLInputElement>()}
        onBookmarkChange={vi.fn()}
        onSave={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    expect(screen.getByTestId('share-bookmark-save-button')).toBeDisabled();
  });

  it('enables the save button when bookmark name is not empty', () => {
    render(
      <ShareBookmark
        bookmark={buildBookmark({ name: 'My favorite' })}
        refBookmark={createRef<HTMLInputElement>()}
        onBookmarkChange={vi.fn()}
        onSave={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    expect(screen.getByTestId('share-bookmark-save-button')).not.toBeDisabled();
  });

  it('calls onSave and shows a loading state while the save is pending', async () => {
    const deferred = createDeferred();
    const onSave = vi.fn().mockImplementation(() => deferred.promise);

    render(
      <ShareBookmark
        bookmark={buildBookmark({ name: 'My favorite' })}
        refBookmark={createRef<HTMLInputElement>()}
        onBookmarkChange={vi.fn()}
        onSave={onSave}
      />,
    );

    const saveButton = screen.getByTestId('share-bookmark-save-button');

    // Use fireEvent (synchronous) rather than user-event so we can inspect
    // the in-flight loading state before the save promise resolves.
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(saveButton).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument();

    deferred.resolve();
    await waitFor(() => expect(saveButton).not.toBeDisabled());

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
