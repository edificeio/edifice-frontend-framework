import { Editor, NodeViewWrapper } from '@tiptap/react';

interface AudioProps {
  editor: Editor;
  [x: string]: any;
}

export const AudioRenderer = (props: AudioProps) => {
  const { node } = props;

  return (
    <NodeViewWrapper>
      <div className="audio-wrapper">
        <audio src={node.attrs.src} controls data-document-id={node.attrs.src}>
          <track kind="captions" />
        </audio>
      </div>
    </NodeViewWrapper>
  );
};
