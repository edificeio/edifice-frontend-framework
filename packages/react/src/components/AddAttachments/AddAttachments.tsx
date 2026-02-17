import clsx from 'clsx';
import { ChangeEvent, useRef, useState } from 'react';
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
import { useFileToAttachment } from './hooks/useFileToAttachment';
import { Attachment } from './models/attachment';

export type SingleAttachmentType = Attachment;
export { useFileToAttachment } from './hooks/useFileToAttachment';

export interface AddAttachmentsProps {
  attachments: Attachment[];
  onChange?: (attachments: Attachment[]) => void;
  onFilesSelected?: (files: File[]) => void;
  onRemoveAttachment?: (attachmentId: string) => void;
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
  onChange,
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
  const fileToAttachment = useFileToAttachment();
  const [attachmentsToAddToWorkspace, setAttachmentsToAddToWorkspace] =
    useState<Attachment[] | undefined>(undefined);

  if (!editMode && !attachments.length) return null;

  const resetInputValue = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleAttachClick = () => inputRef?.current?.click();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) {
      const newAttachments = files.map(fileToAttachment);
      onChange?.([...attachments, ...newAttachments]);
      onFilesSelected?.(files);
    }
    resetInputValue();
  };

  const handleDetachAllClick = () => {
    onChange?.([]);
    attachments.forEach((a) => onRemoveAttachment?.(a.id));
    resetInputValue();
  };

  const handleDetachClick = (attachmentId: string) => {
    const next = attachments.filter((a) => a.id !== attachmentId);
    onChange?.(next);
    onRemoveAttachment?.(attachmentId);
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
      {!!attachments.length && (
        <>
          <Flex
            direction="row"
            align="center"
            justify="between"
            className="border-bottom"
          >
            <span className="caption fw-bold my-8">{t('attachments')}</span>
            {attachments.length > 1 && (
              <div>
                {onCopyToWorkspace && (
                  <IconButton
                    title={t('conversation.copy.all.toworkspace')}
                    color="tertiary"
                    type="button"
                    icon={<IconFolderAdd />}
                    onClick={() => handleCopyToWorkspace(attachments)}
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
            {attachments.map((attachment) => (
              <li
                key={`${attachment.id}-${attachment.name}`}
                className="mw-100"
              >
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
            data-testid="common-add-attachments-button-add-attachment"
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
