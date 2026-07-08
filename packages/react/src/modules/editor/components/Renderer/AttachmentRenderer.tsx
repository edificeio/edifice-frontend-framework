import { useEffect, useState } from 'react';

import { Editor, NodeViewWrapper } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

import { useEditorContext } from '../..';
import { Attachment, Grid, IconButton } from '../../../../components';
import { IconDelete, IconDownload } from '../../../icons/components';

interface AttachmentProps {
  editor: Editor;
  [x: string]: any;
}

interface AttachmentAttrsProps {
  'name': string;
  'href': string;
  'dataDocumentId'?: string;
  'dataContentType'?: string;
  'documentId'?: string;
  'data-document-id'?: string;
}

const AttachmentRenderer = (props: AttachmentProps) => {
  const { node, editor, updateAttributes, deleteNode } = props;
  const [attachmentArrayAttrs, setAttachmentArrayAttrs] = useState<
    AttachmentAttrsProps[]
  >(node.attrs.links);
  const { t } = useTranslation();
  const { editable } = useEditorContext();

  // Fix #WB2-2243: update attachmentArrayAttrs state when props changes
  useEffect(() => {
    if (attachmentArrayAttrs !== node.attrs.links) {
      setAttachmentArrayAttrs(node.attrs.links);
    }
  }, [node.attrs.links, attachmentArrayAttrs]);

  const handleDelete = (index: number, documentId: string) => {
    const nextAttachments = (node.attrs.links ?? []).filter(
      (link: AttachmentAttrsProps, i: number) => {
        const linkDocumentId =
          link.dataDocumentId ??
          link.documentId ??
          link['data-document-id'] ??
          link.href;

        return !(
          i === index ||
          String(linkDocumentId ?? '') === String(documentId ?? '')
        );
      },
    );

    if (nextAttachments.length > 0) {
      updateAttributes?.({ ...node.attrs, links: nextAttachments });
    } else {
      deleteNode?.();
    }

    // Fallback for environments where node-view helpers are not wired.
    if (!updateAttributes && !deleteNode) {
      editor.commands.unsetAttachment(documentId);
    }

    setAttachmentArrayAttrs(nextAttachments);
  };

  return (
    attachmentArrayAttrs?.length !== 0 && (
      <NodeViewWrapper>
        <div
          style={{
            backgroundColor: '#F2F2F2',
            borderRadius: '.8rem',
            padding: '1.2rem',
          }}
          data-drag-handle
        >
          <p className="m-12 mt-0">{t('tiptap.attachments.bloc')}</p>
          <Grid>
            {attachmentArrayAttrs?.map((attachment, index) => (
              <Grid.Col sm="6" key={index}>
                <Attachment
                  name={attachment.name}
                  options={
                    <>
                      <a
                        href={attachment.href}
                        data-document-id={attachment.dataDocumentId}
                        data-content-type={attachment.dataContentType}
                        download
                      >
                        <IconButton
                          aria-label={t('tiptap.attachments.download')}
                          color="tertiary"
                          type="button"
                          icon={<IconDownload />}
                          variant="ghost"
                        />
                      </a>
                      {editable && (
                        <IconButton
                          aria-label={t('tiptap.attachments.delete')}
                          color="danger"
                          type="button"
                          icon={<IconDelete />}
                          variant="ghost"
                          onClick={() =>
                            handleDelete(
                              index,
                              attachment.dataDocumentId ??
                                attachment['data-document-id'] ??
                                attachment.href,
                            )
                          }
                        />
                      )}
                    </>
                  }
                />
              </Grid.Col>
            ))}
          </Grid>
        </div>
      </NodeViewWrapper>
    )
  );
};

export default AttachmentRenderer;
