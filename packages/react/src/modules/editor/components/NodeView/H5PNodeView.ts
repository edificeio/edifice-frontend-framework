import { H5P } from '@edifice.io/tiptap-extensions/h5p';
import { ReactNodeViewRenderer } from '@tiptap/react';

/**
 * H5P node rendered by a React component provided by the host application (e.g. the
 * `H5PRenderer` of @edifice.io/h5p-frontend). Like the conversation history, it is not
 * part of the default extensions: each application opts in explicitly and wires its
 * activity editor with `.configure({ onRequestEdit })`.
 */
const H5PNodeView = (Component: any) =>
  H5P.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

export default H5PNodeView;
