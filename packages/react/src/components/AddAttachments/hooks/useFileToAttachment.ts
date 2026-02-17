import { useCallback } from 'react';
import { Attachment } from '../models/attachment';

/** Convertit un File en Attachment (id unique généré). Exposé pour les apps qui utilisent AddAttachments. */
export function useFileToAttachment(): (file: File) => Attachment {
  return useCallback(
    (file: File): Attachment => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      charset: 'UTF-8',
      contentTransferEncoding: 'binary',
      contentType: file.type || 'application/octet-stream',
      filename: file.name,
      name: file.name,
      size: file.size,
      file,
    }),
    [],
  );
}
