import {
  IconAlertTriangle,
  IconInfoCircle,
  IconQuestion,
  IconSuccessOutline,
} from '../../../../modules/icons/components';
import { MediaResizeProps } from '../../hooks';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';

const InformationPaneRenderer = (props: MediaResizeProps) => {
  const { node } = props;

  const getIconByType = (type: string) => {
    switch (type) {
      case 'warning':
        return <IconAlertTriangle color="#F59700" />;
      case 'success':
        return <IconSuccessOutline color="#7DBF85" />;
      case 'info':
        return <IconInfoCircle color="#2A9CC8" />;
      case 'question':
        return <IconQuestion color="#823AA1" />;
      default:
        return <IconInfoCircle color="#2A9CC8" />;
    }
  };

  return (
    <NodeViewWrapper node={node} className="react-component">
      <div
        className={`information-pane information-pane-${node.attrs.type}`}
        data-information-pane
        data-type={node.attrs.type}
      >
        <span className="information-pane-icon">
          {getIconByType(node.attrs.type)}
        </span>

        <NodeViewContent style={{ width: '100%' }} />
      </div>
    </NodeViewWrapper>
  );
};

export default InformationPaneRenderer;
