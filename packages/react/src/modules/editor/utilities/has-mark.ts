import { Editor } from '@tiptap/react';

export const hasMark = (extensionName: string, editor: Editor | null) =>
  !!editor?.extensionManager.splittableMarks.includes(extensionName);
