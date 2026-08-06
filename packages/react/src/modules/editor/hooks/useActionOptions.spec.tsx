import { RefObject } from 'react';

import { Editor } from '@tiptap/react';
import { renderHook } from '~/setup';
import { DropdownMenuOptions } from '../../../components';
import { MediaLibraryRef } from '../../multimedia';
import { useActionOptions } from './useActionOptions';

type ActionOption = Exclude<DropdownMenuOptions, { type: 'divider' }>;

// The hook builds a fixed-order array (dividers asserted separately below);
// this narrows a raw index to the non-divider variant instead of casting,
// and throws a clear message if the source ever reorders the array so that
// a given index stops being an action item.
function actionAt(options: DropdownMenuOptions[], index: number): ActionOption {
  const option = options[index];
  if (option.type === 'divider') {
    throw new Error(
      `Expected an action option at index ${index}, got a divider`,
    );
  }
  return option;
}

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

    const removeFormat = actionAt(options, 0);
    removeFormat.action(undefined);
    expect(chainMock.clearNodes).toHaveBeenCalled();
    expect(chainMock.unsetAllMarks).toHaveBeenCalled();
    expect(chainMock.run).toHaveBeenCalled();

    const table = actionAt(options, 2);
    table.action(undefined);
    expect(chainMock.insertTable).toHaveBeenCalledWith({
      rows: 3,
      cols: 3,
      withHeaderRow: true,
    });

    const superscript = actionAt(options, 4);
    superscript.action(undefined);
    expect(chainMock.toggleSuperscript).toHaveBeenCalled();

    const subscript = actionAt(options, 5);
    subscript.action(undefined);
    expect(chainMock.toggleSubscript).toHaveBeenCalled();

    const maths = actionAt(options, 6);
    maths.action(undefined);
    expect(toggleMathsModal).toHaveBeenCalled();

    const embed = actionAt(options, 8);
    embed.action(undefined);
    expect(mediaLibraryRef.current?.show).toHaveBeenCalledWith('embedder');

    const bulletList = actionAt(listOptions, 0);
    bulletList.action(undefined);
    expect(chainMock.toggleBulletList).toHaveBeenCalled();

    const orderedList = actionAt(listOptions, 1);
    orderedList.action(undefined);
    expect(chainMock.toggleOrderedList).toHaveBeenCalled();

    const alignCenter = actionAt(alignmentOptions, 1);
    alignCenter.action(undefined);
    expect(chainMock.setTextAlign).toHaveBeenCalledWith('center');
  });
});
