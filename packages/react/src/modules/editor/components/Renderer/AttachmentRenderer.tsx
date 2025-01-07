import { useState } from 'react';

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
  name: string;
  href: string;
  documentId: string;
  dataContentType: string;
}

const AttachmentRenderer = (props: AttachmentProps) => {
  const { t } = useTranslation();

  const { node, editor } = props;

  const { editable } = useEditorContext();

  const [attachmentArrayAttrs, setAttachmentArrayAttrs] = useState<
    AttachmentAttrsProps[]
  >(node.attrs.links);

  const handleDelete = (index: any, documentId: any) => {
    editor.commands.unsetAttachment(documentId);
    setAttachmentArrayAttrs((oldAttachments) =>
      oldAttachments.filter((_, i) => i !== index),
    );
  };

  return (
    attachmentArrayAttrs.length !== 0 && (
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
                      <a href={attachment.href} download>
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
                            handleDelete(index, attachment.documentId)
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
