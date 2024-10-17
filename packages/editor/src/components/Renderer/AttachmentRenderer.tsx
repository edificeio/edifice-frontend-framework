import { useState } from 'react';

import { Delete, Download } from '@edifice.io/icons';
import { Attachment, Grid, IconButton } from '@edifice.io/react';
import { Editor, NodeViewWrapper } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

import { useEditorContext } from '../..';

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

export const AttachmentRenderer = (props: AttachmentProps) => {
  const { t } = useTranslation();

  const { node } = props;

  const { editable } = useEditorContext();

  const [attachmentArrayAttrs, setAttachmentArrayAttrs] = useState<
    AttachmentAttrsProps[]
  >(node.attrs.links);

  const handleDelete = (index: any) => {
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
                          icon={<Download />}
                          variant="ghost"
                        />
                      </a>
                      {editable && (
                        <IconButton
                          aria-label={t('tiptap.attachments.delete')}
                          color="danger"
                          type="button"
                          icon={<Delete />}
                          variant="ghost"
                          onClick={() => handleDelete(index)}
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
