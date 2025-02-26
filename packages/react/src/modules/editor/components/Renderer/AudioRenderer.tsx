import { Editor, NodeViewWrapper } from '@tiptap/react';

interface AudioProps {
  editor: Editor;
  [x: string]: any;
}

const AudioRenderer = (props: AudioProps) => {
  const { node } = props;

  const alignContent = (textalign: string) => {
    switch (textalign) {
      case 'center':
      case 'justify':
        return {
          marginLeft: 'auto',
          marginRight: 'auto',
          width: 'fit-content',
        };
      case 'left':
        return { marginRight: 'auto', width: 'fit-content' };
      case 'right':
        return { marginLeft: 'auto', width: 'fit-content' };
      default:
        return {};
    }
  };

  return (
    <NodeViewWrapper style={{ cursor: 'text' }}>
      <div
        className="audio-wrapper"
        data-drag-handle
        style={alignContent(node.attrs.textAlign)}
      >
        <audio src={node.attrs.src} controls data-document-id={node.attrs.src}>
          <track kind="captions" />
        </audio>
      </div>
    </NodeViewWrapper>
  );
};

export default AudioRenderer;
