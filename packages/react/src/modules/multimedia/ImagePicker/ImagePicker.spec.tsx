import { render, screen } from '~/setup';
import ImagePicker from './ImagePicker';

function setup({
  src,
  libraryMedia = '',
}: { src?: string; libraryMedia?: string } = {}) {
  const onUploadImage = vi.fn();
  const onDeleteImage = vi.fn();
  const show = vi.fn();
  const mediaLibraryRef: { current: { show: (type: string) => void } | null } =
    {
      current: { show },
    };

  return {
    ...render(
      <ImagePicker
        addButtonLabel="Ajouter une image"
        deleteButtonLabel="Supprimer l'image"
        src={src}
        libraryMedia={libraryMedia}
        mediaLibraryRef={mediaLibraryRef}
        onUploadImage={onUploadImage}
        onDeleteImage={onDeleteImage}
      />,
    ),
    onUploadImage,
    onDeleteImage,
    show,
    mediaLibraryRef,
  };
}

const addButton = () =>
  screen.getByRole('button', { name: 'Ajouter une image' });
const deleteButton = () =>
  screen.getByRole('button', { name: "Supprimer l'image" });

describe('ImagePicker', () => {
  it('falls back to the application icon without any image', () => {
    setup();

    expect(document.querySelector('img')).toBeNull();
    expect(deleteButton()).toBeDisabled();
  });

  it('previews the image given as default', () => {
    setup({ src: '/workspace/document/image-id' });

    expect(document.querySelector('img')).toHaveAttribute(
      'src',
      '/workspace/document/image-id',
    );
    expect(deleteButton()).toBeEnabled();
  });

  it('opens the media library on the add button', async () => {
    const { user, show } = setup();

    await user.click(addButton());

    expect(show).toHaveBeenCalledWith('image');
  });

  it('survives a click without any media library attached', async () => {
    const { user, mediaLibraryRef } = setup();
    mediaLibraryRef.current = null;

    await user.click(addButton());

    expect(addButton()).toBeInTheDocument();
  });

  it('previews and reports the media picked in the library', () => {
    const { onUploadImage } = setup({
      libraryMedia: '/workspace/document/picked-id',
    });

    expect(document.querySelector('img')).toHaveAttribute(
      'src',
      '/workspace/document/picked-id',
    );
    expect(onUploadImage).toHaveBeenCalledWith('/workspace/document/picked-id');
  });

  it('reports nothing while the library selection is empty', () => {
    const { onUploadImage } = setup();

    expect(onUploadImage).not.toHaveBeenCalled();
  });

  it('clears the preview on the delete button', async () => {
    const { user, onDeleteImage } = setup({
      src: '/workspace/document/image-id',
    });

    await user.click(deleteButton());

    expect(document.querySelector('img')).toBeNull();
    expect(onDeleteImage).toHaveBeenCalledTimes(1);
    expect(deleteButton()).toBeDisabled();
  });

  it('appends the custom classes to the picker', () => {
    render(
      <ImagePicker
        addButtonLabel="Ajouter"
        deleteButtonLabel="Supprimer"
        libraryMedia=""
        mediaLibraryRef={{ current: null }}
        className="my-picker"
        onUploadImage={vi.fn()}
        onDeleteImage={vi.fn()}
      />,
    );

    expect(document.getElementById('image-input')).toHaveClass(
      'image-input',
      'my-picker',
    );
  });
});
