import { Editor, NodeViewWrapper } from '@tiptap/react';

interface AudioProps {
  editor: Editor;
  [x: string]: any;
}

const AudioRenderer = (props: AudioProps) => {
  const { node } = props;

  return (
    <NodeViewWrapper
      style={{ display: 'inline-block', width: 'fit-content' }}
    >
      <div className="audio-wrapper" data-drag-handle>
        <audio src={node.attrs.src} controls data-document-id={node.attrs.src}>
          <track kind="captions" />
        </audio>
      </div>
    </NodeViewWrapper>
  );
};

export default AudioRenderer;
