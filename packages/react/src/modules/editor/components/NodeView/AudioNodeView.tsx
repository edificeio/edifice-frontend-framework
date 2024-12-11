import { Audio } from '@edifice.io/tiptap-extensions/audio';
import { ReactNodeViewRenderer } from '@tiptap/react';

const AudioNodeView = (Component: any) =>
  Audio.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

export default AudioNodeView;
