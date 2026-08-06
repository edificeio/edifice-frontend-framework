import { Audio } from '@edifice.io/tiptap-extensions/audio';
import { Hyperlink } from '@edifice.io/tiptap-extensions/hyperlink';
import { Iframe } from '@edifice.io/tiptap-extensions/iframe';
import { Image } from '@edifice.io/tiptap-extensions/image';
import { Linker } from '@edifice.io/tiptap-extensions/linker';
import { TableCell } from '@edifice.io/tiptap-extensions/table-cell';
import { Editor, EditorOptions, Extensions } from '@tiptap/core';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Table from '@tiptap/extension-table';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';

const defaultExtensions: Extensions = [
  StarterKit,
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
  Image,
  Audio,
  Iframe,
  Linker,
  Hyperlink,
  TextAlign.configure({
    types: ['heading', 'paragraph', 'video', 'audio', 'iframe'],
  }),
  Underline,
  Subscript,
  Superscript,
];

/**
 * Builds a real, headless (uncoupled from React) tiptap `Editor` for
 * component specs that need genuine ProseMirror state - selection, commands,
 * `isActive` - rather than a hand-rolled mock. Callers should call
 * `.destroy()` in `afterEach` to avoid leaking editor instances across tests.
 */
export const createTestEditor = (
  overrides?: { extensions?: Extensions } & Partial<EditorOptions>,
): Editor => {
  const { extensions, content, ...rest } = overrides ?? {};

  return new Editor({
    extensions: [...defaultExtensions, ...(extensions ?? [])],
    content: content ?? '<p></p>',
    ...rest,
  });
};
