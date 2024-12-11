import { Editor } from '@tiptap/react';

import { hasMark } from './has-mark';

export const hasTextStyle = (styleName: string, editor: Editor | null) =>
  editor?.extensionManager.extensions.find(
    (item) => item.name === styleName && hasMark('textStyle', editor),
  );
