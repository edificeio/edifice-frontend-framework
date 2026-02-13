import clsx from 'clsx';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconDelete,
  IconDownload,
  IconFolderAdd,
  IconPlus,
} from '../../modules/icons/components';
import { Button, Flex, IconButton } from '../index';
import { AddAttachmentToWorkspaceModal } from './components/AddAttachmentToWorkspaceModal';
import { SingleAttachment } from './components/SingleAttachment';
import { Attachment } from './models/attachment';

function fileToAttachment(file: File): Attachment {
  return {
    id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    charset: 'UTF-8',
    contentTransferEncoding: 'binary',
    contentType: file.type || 'application/octet-stream',
    filename: file.name,
    name: file.name,
    size: file.size,
  };
}

export interface AddAttachmentsProps {
  attachments: Attachment[];
  onFilesSelected: (files: File[]) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  editMode?: boolean;
  isMutating?: boolean;
  onCopyToWorkspace?: (
    attachments: Attachment[],
    folderId: string,
  ) => Promise<boolean>;
  /** Si fourni, chaque pièce jointe affiche un bouton télécharger avec l'URL retournée. */
  getDownloadUrl?: (attachmentId: string) => string;
  /** Si fourni et qu'il y a plusieurs pièces jointes, affiche un bouton « télécharger tout ». */
  downloadAllUrl?: string;
}

export const AddAttachments = ({
  attachments,
  onFilesSelected,
  onRemoveAttachment,
  editMode = false,
  isMutating = false,
  onCopyToWorkspace,
  getDownloadUrl,
  downloadAllUrl,
}: AddAttachmentsProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [optimisticAttachments, setOptimisticAttachments] = useState<
    Attachment[]
  >([]);
  const [attachmentsToAddToWorkspace, setAttachmentsToAddToWorkspace] =
    useState<Attachment[] | undefined>(undefined);

  const prevAttachmentsLengthRef = useRef(attachments.length);

  const displayedAttachments = [...attachments, ...optimisticAttachments];

  useEffect(() => {
    if (attachments.length > prevAttachmentsLengthRef.current) {
      setOptimisticAttachments([]);
    }
    prevAttachmentsLengthRef.current = attachments.length;
  }, [attachments.length]);

  if (!editMode && !displayedAttachments.length) return null;

  const resetInputValue = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleAttachClick = () => inputRef?.current?.click();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) {
      onFilesSelected(files);
      const newOptimistic = files.map(fileToAttachment);
      setOptimisticAttachments((prev) => [...prev, ...newOptimistic]);
    }
    resetInputValue();
  };

  const handleDetachAllClick = () => {
    setOptimisticAttachments([]);
    attachments.forEach((attachment) => {
      onRemoveAttachment(attachment.id);
    });
    resetInputValue();
  };

  const handleDetachClick = (attachmentId: string) => {
    const isOptimistic = optimisticAttachments.some(
      (attachment) => attachment.id === attachmentId,
    );
    if (isOptimistic) {
      setOptimisticAttachments((prev) =>
        prev.filter((attachment) => attachment.id !== attachmentId),
      );
    } else {
      onRemoveAttachment(attachmentId);
    }
    resetInputValue();
  };

  const handleCopyToWorkspace = (attachments: Attachment[]) => {
    setAttachmentsToAddToWorkspace(attachments);
  };

  const className = clsx(
    'bg-gray-200 rounded px-12 py-8 message-attachments align-self-start gap-8 d-flex flex-column mw-100',
    { 'border add-attachments-edit mx-16': editMode },
  );

  return (
    <div className={className} data-drag-handle>
      {!!displayedAttachments.length && (
        <>
          <Flex
            direction="row"
            align="center"
            justify="between"
            className="border-bottom"
          >
            <span className="caption fw-bold my-8">{t('attachments')}</span>
            {displayedAttachments.length > 1 && (
              <div>
                {onCopyToWorkspace && (
                  <IconButton
                    title={t('conversation.copy.all.toworkspace')}
                    color="tertiary"
                    type="button"
                    icon={<IconFolderAdd />}
                    onClick={() => handleCopyToWorkspace(displayedAttachments)}
                    variant="ghost"
                  />
                )}
                {downloadAllUrl && (
                  <a href={downloadAllUrl} download>
                    <IconButton
                      title={t('download.all.attachment')}
                      color="tertiary"
                      type="button"
                      icon={<IconDownload />}
                      variant="ghost"
                    />
                  </a>
                )}
                {editMode && (
                  <IconButton
                    title={t('remove.all.attachment')}
                    color="danger"
                    type="button"
                    icon={<IconDelete />}
                    variant="ghost"
                    onClick={handleDetachAllClick}
                    disabled={isMutating}
                  />
                )}
              </div>
            )}
          </Flex>
          <ul className="d-flex gap-8 flex-column list-unstyled m-0">
            {displayedAttachments.map((attachment) => (
              <li key={attachment.id} className="mw-100">
                <SingleAttachment
                  attachment={attachment}
                  editMode={editMode}
                  onDelete={handleDetachClick}
                  onCopyToWorkspace={
                    onCopyToWorkspace
                      ? (attachment) => handleCopyToWorkspace([attachment])
                      : undefined
                  }
                  getDownloadUrl={getDownloadUrl}
                  disabled={isMutating}
                />
              </li>
            ))}
          </ul>
        </>
      )}
      {editMode && (
        <>
          <Button
            color="secondary"
            variant="ghost"
            isLoading={isMutating}
            onClick={handleAttachClick}
            disabled={isMutating}
            className="align-self-start"
            leftIcon={<IconPlus />}
          >
            {t('add.attachment')}
          </Button>
          <input
            ref={inputRef}
            multiple={true}
            type="file"
            name="attachment-input"
            id="attachment-input"
            onChange={handleFileChange}
            hidden
          />
        </>
      )}
      {onCopyToWorkspace && !!attachmentsToAddToWorkspace && (
        <AddAttachmentToWorkspaceModal
          isOpen
          onModalClose={() => setAttachmentsToAddToWorkspace(undefined)}
          attachments={attachmentsToAddToWorkspace}
          onCopyToWorkspace={onCopyToWorkspace}
        />
      )}
    </div>
  );
};

AddAttachments.displayName = 'AddAttachments';

export default AddAttachments;
