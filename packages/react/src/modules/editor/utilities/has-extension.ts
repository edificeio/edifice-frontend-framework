import { Editor } from '@tiptap/react';

export const hasExtension = (extensionName: string, editor: Editor | null) =>
  !!editor?.extensionManager.extensions.find(
    (item) => item.name === extensionName,
  );
