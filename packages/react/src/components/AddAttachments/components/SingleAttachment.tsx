import {
  Attachment as AttachmentComponent,
  IconButton,
} from '../../..';
import {
  IconDelete,
  IconDownload,
  IconFolderAdd,
} from '../../../modules/icons/components';
import { useTranslation } from 'react-i18next';
import { Attachment } from '../models/attachment';

export interface SingleAttachmentProps {
  attachment: Attachment;
  onDelete: (attachmentId: string) => void;
  editMode?: boolean;
  /** Si fourni, affiche le bouton « copier vers l'espace » et appelle ce callback au clic. */
  onCopyToWorkspace?: (attachment: Attachment) => void;
  /** Si fourni, affiche le bouton télécharger avec l'URL retournée. */
  getDownloadUrl?: (attachmentId: string) => string;
  /** Désactive les boutons d'action (ex. pendant une suppression). */
  disabled?: boolean;
}

export function SingleAttachment({
  attachment,
  onDelete,
  editMode = false,
  onCopyToWorkspace,
  getDownloadUrl,
  disabled = false,
}: SingleAttachmentProps) {
  const { t } = useTranslation();
  const downloadUrl = getDownloadUrl?.(attachment.id);

  return (
    <AttachmentComponent
      name={attachment.filename}
      options={
        <>
          {onCopyToWorkspace && (
            <IconButton
              title={t('conversation.copy.toworkspace')}
              color="tertiary"
              type="button"
              icon={<IconFolderAdd />}
              variant="ghost"
              onClick={() => onCopyToWorkspace(attachment)}
              disabled={disabled}
            />
          )}
          {downloadUrl !== undefined && (
            <a href={downloadUrl} download>
              <IconButton
                title={t('download.attachment')}
                color="tertiary"
                type="button"
                icon={<IconDownload />}
                variant="ghost"
                disabled={disabled}
              />
            </a>
          )}
          {editMode && (
            <IconButton
              title={t('remove.attachment')}
              color="danger"
              type="button"
              icon={<IconDelete />}
              variant="ghost"
              onClick={() => onDelete(attachment.id)}
              disabled={disabled}
            />
          )}
        </>
      }
    />
  );
}
