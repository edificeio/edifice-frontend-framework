import { Editor } from '@tiptap/core';
import { generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { afterEach, describe, expect, it } from 'vitest';
import { CustomHeading } from './heading';

describe('CustomHeading', () => {
  it("parses <h1> as customHeading, not StarterKit's bundled heading", () => {
    // v3's StarterKit bundles its own 'heading' node; it must stay disabled wherever
    // CustomHeading is used, or it silently wins the parse (see useTipTapEditor.ts).
    const extensions = [
      StarterKit.configure({ heading: false }),
      CustomHeading.configure({ levels: [1, 2] }),
    ];

    const json = generateJSON('<h1>Title</h1>', extensions);

    expect(json.content[0].type).toBe('customHeading');
  });

  let editor: Editor | undefined;

  afterEach(() => {
    editor?.destroy();
  });

  it('setCustomHeading() turns a paragraph into a customHeading (not a crash)', () => {
    // Regression: setCustomHeading() delegates to commands.setHeading(), which
    // only exists if CustomHeading's addCommands() inherits it from the base
    // Heading extension - without that, this throws "setHeading is not a
    // function" as soon as StarterKit's own heading is disabled.
    editor = new Editor({
      extensions: [
        StarterKit.configure({ heading: false }),
        CustomHeading.configure({ levels: [1, 2] }),
      ],
      content: '<p>Title</p>',
    });

    editor.commands.setCustomHeading({ level: 1 });

    expect(editor.getJSON().content?.[0].type).toBe('customHeading');
  });

  it('toggleHeading() (inherited, backs the Mod-Alt-1/2 shortcut) toggles customHeading', () => {
    // Same inheritance bug as setHeading above: addKeyboardShortcuts() in the
    // base Heading extension calls this.editor.commands.toggleHeading(...).
    editor = new Editor({
      extensions: [
        StarterKit.configure({ heading: false }),
        CustomHeading.configure({ levels: [1, 2] }),
      ],
      content: '<p>Title</p>',
    });

    editor.commands.toggleHeading({ level: 2 });
    expect(editor.getJSON().content?.[0]).toMatchObject({
      type: 'customHeading',
      attrs: { level: 2 },
    });

    editor.commands.toggleHeading({ level: 2 });
    expect(editor.getJSON().content?.[0].type).toBe('paragraph');
  });
});
