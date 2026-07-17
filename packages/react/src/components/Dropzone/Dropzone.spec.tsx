import { render, screen, waitFor } from '~/setup';
import Dropzone from './Dropzone';

function createFile(name: string, type = 'image/png') {
  return new File(['content'], name, { type });
}

function getFileInput(container: HTMLElement) {
  return container.querySelector('#attachment-input') as HTMLInputElement;
}

describe('Dropzone', () => {
  it('shows the import prompt and hides the file wrapper when there are no files', () => {
    const { container } = render(<Dropzone>child content</Dropzone>);

    expect(container.querySelector('.dropzone-import-wrapper')).toHaveClass(
      'd-flex',
    );
    expect(container.querySelector('.drop-file-wrapper')).toHaveClass('d-none');
  });

  it('renders children inside the file wrapper', () => {
    render(<Dropzone>child content</Dropzone>);

    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('swaps to the file wrapper and hides the import prompt once a file is added', async () => {
    const { container, user } = render(<Dropzone>child content</Dropzone>);

    await user.upload(getFileInput(container), createFile('photo.png'));

    expect(container.querySelector('.drop-file-wrapper')).toHaveClass(
      'd-block',
    );
    expect(container.querySelector('.dropzone-import-wrapper')).toHaveClass(
      'd-none',
    );
  });

  it('adds a dropped file', async () => {
    const { container } = render(<Dropzone>child content</Dropzone>);
    const dropzone = container.querySelector('.dropzone') as HTMLElement;
    const file = createFile('dropped.png');

    // After a drop, the hook syncs the hidden native input's `.files` from
    // the dropped array. jsdom's real FileList setter rejects a plain array
    // (unlike a real browser's genuine dataTransfer.files), so relax it to a
    // plain writable property for this synthetic drop.
    Object.defineProperty(getFileInput(container), 'files', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    fireEventDrop(dropzone, [file]);

    await waitFor(() =>
      expect(container.querySelector('.drop-file-wrapper')).toHaveClass(
        'd-block',
      ),
    );
  });

  it('only renders the Drag overlay when handle is true', () => {
    const { container } = render(<Dropzone handle>child content</Dropzone>);

    expect(
      container.querySelector('.drop-file-wrapper'),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('.dropzone-import-wrapper'),
    ).not.toBeInTheDocument();
  });

  it('passes accept as a comma-joined list on the hidden file input', () => {
    const { container } = render(
      <Dropzone accept={['image/png', 'image/jpeg']}>content</Dropzone>,
    );

    expect(getFileInput(container)).toHaveAttribute(
      'accept',
      'image/png,image/jpeg',
    );
  });
});

function fireEventDrop(element: HTMLElement, files: File[]) {
  const dataTransfer = { files };
  const event = new Event('drop', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });
  element.dispatchEvent(event);
}
