import { act, renderHook } from '~/setup';
import useDropzone from './useDropzone';

function createFile(name: string, type = 'image/png') {
  return new File(['content'], name, { type });
}

function createDragEvent(files?: File[]) {
  return {
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    dataTransfer: files ? { files } : undefined,
  } as any;
}

describe('useDropzone', () => {
  it('starts empty and not dragging', () => {
    const { result } = renderHook(() => useDropzone());

    expect(result.current.files).toEqual([]);
    expect(result.current.dragging).toBe(false);
  });

  it('flags dragging on drag enter and clears it on drag leave', () => {
    const { result } = renderHook(() => useDropzone());
    const event = createDragEvent();

    act(() => result.current.handleDragging(event));
    expect(result.current.dragging).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();

    act(() => result.current.handleDragLeave(event));
    expect(result.current.dragging).toBe(false);
  });

  it('adds a file to the list', async () => {
    const { result } = renderHook(() => useDropzone());
    const file = createFile('photo.png');

    await act(async () => {
      await result.current.addFile(file);
    });

    expect(result.current.files).toHaveLength(1);
    expect(result.current.files[0].name).toBe('photo.png');
  });

  it('removes a file by name', async () => {
    const { result } = renderHook(() => useDropzone());

    await act(async () => {
      await result.current.addFiles([createFile('a.png'), createFile('b.png')]);
    });
    expect(result.current.files).toHaveLength(2);

    act(() => result.current.deleteFile(createFile('a.png')));

    expect(result.current.files).toHaveLength(1);
    expect(result.current.files[0].name).toBe('b.png');
  });

  it('replaces a file at a given index', async () => {
    const { result } = renderHook(() => useDropzone());

    await act(async () => {
      await result.current.addFiles([createFile('a.png'), createFile('b.png')]);
    });

    const replacement = createFile('c.png');
    act(() => result.current.replaceFileAt(0, replacement));

    expect(result.current.files.map((f) => f.name)).toEqual(['c.png', 'b.png']);
  });

  it('empties the list with cleanFiles', async () => {
    const { result } = renderHook(() => useDropzone());

    await act(async () => {
      await result.current.addFile(createFile('a.png'));
    });
    expect(result.current.files).toHaveLength(1);

    act(() => result.current.cleanFiles());
    expect(result.current.files).toEqual([]);
  });

  it('adds dropped files and stops dragging', async () => {
    const { result } = renderHook(() => useDropzone());
    const event = createDragEvent([createFile('dropped.png')]);

    await act(async () => {
      await result.current.handleDrop(event);
    });

    expect(result.current.dragging).toBe(false);
    expect(result.current.files).toHaveLength(1);
    expect(result.current.files[0].name).toBe('dropped.png');
  });

  it('adds files selected through the input change handler', async () => {
    const { result } = renderHook(() => useDropzone());
    const event = {
      target: { files: [createFile('picked.png')] },
    } as any;

    await act(async () => {
      result.current.handleOnChange(event);
    });

    expect(result.current.files).toHaveLength(1);
    expect(result.current.files[0].name).toBe('picked.png');
  });

  it('filters files against the input accept attribute when forceFilters is set', async () => {
    const { result } = renderHook(() => useDropzone({ forceFilters: true }));

    // Simulate a mounted input[type=file] restricted to PNG images.
    result.current.inputRef.current = { accept: '.png' } as HTMLInputElement;

    await act(async () => {
      await result.current.addFiles([
        createFile('keep.png', 'image/png'),
        createFile('reject.txt', 'text/plain'),
      ]);
    });

    expect(result.current.files.map((f) => f.name)).toEqual(['keep.png']);
  });
});
