import { RefObject } from 'react';

import { Editor } from '@tiptap/react';
import { renderHook } from '~/setup';
import { MediaLibraryRef } from '../../multimedia';
import { useActionOptions } from './useActionOptions';

// Chainable mock: every method returns the same object so calls like
// `.chain().focus().insertTable(...).run()` can be composed freely.
function createChainMock() {
  const chainMock: any = {};
  [
    'clearNodes',
    'unsetAllMarks',
    'focus',
    'insertTable',
    'toggleSuperscript',
    'toggleSubscript',
    'toggleBulletList',
    'toggleOrderedList',
    'setTextAlign',
    'run',
  ].forEach((method) => {
    chainMock[method] = vi.fn(() => chainMock);
  });
  return chainMock;
}

function nonDividerActions(options: any[]) {
  return options.filter((option) => option.type !== 'divider');
}

describe('useActionOptions', () => {
  it('does not throw when the editor is null', () => {
    const toggleMathsModal = vi.fn();
    const mediaLibraryRef = {
      current: { show: vi.fn() },
    } as unknown as RefObject<MediaLibraryRef>;

    const { result } = renderHook(() =>
      useActionOptions(null, toggleMathsModal, mediaLibraryRef),
    );

    const [options, listOptions, alignmentOptions] = result.current;

    expect(() => nonDividerActions(options)[0].action()).not.toThrow();
    expect(() => nonDividerActions(listOptions)[0].action()).not.toThrow();
    expect(() => nonDividerActions(alignmentOptions)[0].action()).not.toThrow();
  });

  it('builds options wired to the editor chain, maths modal and media library', () => {
    const chainMock = createChainMock();
    const editor = {
      chain: vi.fn(() => chainMock),
    } as unknown as Editor;
    const toggleMathsModal = vi.fn();
    const mediaLibraryRef = {
      current: { show: vi.fn() },
    } as unknown as RefObject<MediaLibraryRef>;

    const { result } = renderHook(() =>
      useActionOptions(editor, toggleMathsModal, mediaLibraryRef),
    );

    const [options, listOptions, alignmentOptions] = result.current;

    // Every option (excluding dividers) must expose a truthy string label.
    [...options, ...listOptions, ...alignmentOptions]
      .filter((option) => option.type !== 'divider')
      .forEach((option) => {
        expect(typeof option.label).toBe('string');
        expect(option.label).toBeTruthy();
      });

    // Dividers are placed between the logical groups of `options`.
    expect(options[1]).toEqual({ type: 'divider' });
    expect(options[3]).toEqual({ type: 'divider' });
    expect(options[7]).toEqual({ type: 'divider' });

    const removeFormat = options[0];
    removeFormat.action();
    expect(chainMock.clearNodes).toHaveBeenCalled();
    expect(chainMock.unsetAllMarks).toHaveBeenCalled();
    expect(chainMock.run).toHaveBeenCalled();

    const table = options[2];
    table.action();
    expect(chainMock.insertTable).toHaveBeenCalledWith({
      rows: 3,
      cols: 3,
      withHeaderRow: true,
    });

    const superscript = options[4];
    superscript.action();
    expect(chainMock.toggleSuperscript).toHaveBeenCalled();

    const subscript = options[5];
    subscript.action();
    expect(chainMock.toggleSubscript).toHaveBeenCalled();

    const maths = options[6];
    maths.action();
    expect(toggleMathsModal).toHaveBeenCalled();

    const embed = options[8];
    embed.action();
    expect(mediaLibraryRef.current?.show).toHaveBeenCalledWith('embedder');

    const bulletList = listOptions[0];
    bulletList.action();
    expect(chainMock.toggleBulletList).toHaveBeenCalled();

    const orderedList = listOptions[1];
    orderedList.action();
    expect(chainMock.toggleOrderedList).toHaveBeenCalled();

    const alignCenter = alignmentOptions[1];
    alignCenter.action();
    expect(chainMock.setTextAlign).toHaveBeenCalledWith('center');
  });
});
