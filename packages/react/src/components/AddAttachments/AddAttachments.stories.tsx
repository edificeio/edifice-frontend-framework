import { StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Grid } from '../Grid';
import { AddAttachments } from './AddAttachments';
import { Attachment } from './models/attachment';

/** Helper: enregistre l’appel dans Storybook Actions et retourne true pour que la modale se ferme. */
function createCopyToWorkspaceHandler(
  storyFn: (attachments: Attachment[], folderId: string) => void,
) {
  return async (attachments: Attachment[], folderId: string) => {
    storyFn(attachments, folderId);
    return true;
  };
}

const mockAttachments: Attachment[] = [
  {
    id: 'attachment-1',
    charset: 'UTF-8',
    contentTransferEncoding: 'binary',
    contentType: 'application/pdf',
    filename: 'document.pdf',
    name: 'Document PDF',
    size: 102400,
  },
  {
    id: 'attachment-2',
    charset: 'UTF-8',
    contentTransferEncoding: 'binary',
    contentType: 'image/png',
    filename: 'image.png',
    name: 'Image PNG',
    size: 51200,
  },
  {
    id: 'attachment-3',
    charset: 'UTF-8',
    contentTransferEncoding: 'binary',
    contentType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    filename: 'spreadsheet.xlsx',
    name: 'Feuille de calcul',
    size: 204800,
  },
];

const meta = {
  title: 'Components/AddAttachments',
  component: AddAttachments,
  args: {
    onFilesSelected: fn(),
    onRemoveAttachment: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          "AddAttachments displays a list of attachments and handles adding (file selection). Files are passed to the parent via onFilesSelected; the UI updates immediately (optimistic list). Optional options: onCopyToWorkspace ('copy to workspace' buttons), getDownloadUrl (download button per attachment), downloadAllUrl ('download all' button when multiple attachments). Edit mode (add/remove) or view mode (read-only).\n\n**Why does the 'Copy to workspace' modal appear at the top of the page (first story)?** The modal is rendered via `createPortal` in a single DOM element (`document.getElementById('portal')`). In Docs mode, each story is wrapped by the decorator that adds a `<div id=\"portal\" />`. There can therefore be multiple elements with `id=\"portal\"` on the page; `getElementById` only returns the **first one**. All modals are therefore rendered in this first portal, hence the display at the top.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AddAttachments>;

/** Liste vide en mode édition : uniquement le bouton « Ajouter une pièce jointe ». */
export const ListeVide: Story = {
  args: {
    attachments: [],
    editMode: true,
    onFilesSelected: fn(),
    onRemoveAttachment: fn(),
  },
};

/** Mode édition avec pièces jointes : ajout, suppression une par une, supprimer tout. */
export const ModeEdition: Story = {
  render: (args) => {
    const [attachments, setAttachments] = useState<Attachment[]>(
      args.attachments ?? [],
    );
    return (
      <AddAttachments
        {...args}
        attachments={attachments}
        onFilesSelected={(files) => {
          args.onFilesSelected?.(files);
          setAttachments((prev) => [
            ...prev,
            ...files.map((f) => ({
              id: `${f.name}-${Date.now()}`,
              charset: 'UTF-8',
              contentTransferEncoding: 'binary',
              contentType: f.type || 'application/octet-stream',
              filename: f.name,
              name: f.name,
              size: f.size,
            })),
          ]);
        }}
        onRemoveAttachment={(id) => {
          args.onRemoveAttachment?.(id);
          setAttachments((prev) => prev.filter((a) => a.id !== id));
        }}
        editMode={true}
      />
    );
  },
  args: {
    attachments: mockAttachments,
    editMode: true,
    onFilesSelected: fn(),
    onRemoveAttachment: fn(),
  },
};

/** Mode visualisation seule : pas de bouton ajouter ni supprimer. */
export const ModeVisualisation: Story = {
  args: {
    attachments: mockAttachments,
    editMode: false,
    onFilesSelected: fn(),
    onRemoveAttachment: fn(),
  },
};

/** Uniquement la fonctionnalité « Copier vers l'espace » (une pièce ou tout). */
export const CopierVersEspace: Story = {
  render: (args) => {
    const [attachments] = useState<Attachment[]>(args.attachments ?? []);
    return (
      <AddAttachments
        {...args}
        attachments={attachments}
        onFilesSelected={args.onFilesSelected}
        onRemoveAttachment={args.onRemoveAttachment}
        onCopyToWorkspace={createCopyToWorkspaceHandler(
          args.onCopyToWorkspace ?? (() => {}),
        )}
        editMode={false}
      />
    );
  },
  args: {
    attachments: mockAttachments,
    editMode: false,
    onFilesSelected: fn(),
    onRemoveAttachment: fn(),
    onCopyToWorkspace: fn(),
  },
};

/** Uniquement les boutons de téléchargement (par pièce et « télécharger tout »). */
export const Telechargement: Story = {
  args: {
    attachments: mockAttachments,
    editMode: false,
    onFilesSelected: fn(),
    onRemoveAttachment: fn(),
    getDownloadUrl: (id) => `#/download/${id}`,
    downloadAllUrl: '#/download/all',
  },
};

/** Une pièce jointe avec un nom très long (vérification du truncate). */
export const NomLong: Story = {
  render: (args) => {
    const longName: Attachment[] = [
      {
        ...mockAttachments[0],
        id: 'long-1',
        filename:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.pdf',
        name: 'Document avec un nom très long',
      },
    ];
    return (
      <Grid>
        <Grid.Col sm="6">
          <AddAttachments
            {...args}
            attachments={longName}
            onFilesSelected={args.onFilesSelected}
            onRemoveAttachment={args.onRemoveAttachment}
            editMode={false}
          />
        </Grid.Col>
      </Grid>
    );
  },
  args: {
    attachments: [],
    onFilesSelected: fn(),
    onRemoveAttachment: fn(),
  },
};

/** État en chargement : boutons désactivés, loader sur « Ajouter ». */
export const EnChargement: Story = {
  args: {
    attachments: mockAttachments,
    editMode: true,
    isMutating: true,
    onFilesSelected: fn(),
    onRemoveAttachment: fn(),
  },
};

/** Toutes les options : édition + copier vers l'espace + téléchargement. */
export const ToutesOptions: Story = {
  render: (args) => {
    const [attachments, setAttachments] = useState<Attachment[]>(
      args.attachments ?? [],
    );
    return (
      <AddAttachments
        {...args}
        attachments={attachments}
        onFilesSelected={(files) => {
          args.onFilesSelected?.(files);
          setAttachments((prev) => [
            ...prev,
            ...files.map((f) => ({
              id: `${f.name}-${Date.now()}`,
              charset: 'UTF-8',
              contentTransferEncoding: 'binary',
              contentType: f.type || 'application/octet-stream',
              filename: f.name,
              name: f.name,
              size: f.size,
            })),
          ]);
        }}
        onRemoveAttachment={(id) => {
          args.onRemoveAttachment?.(id);
          setAttachments((prev) => prev.filter((a) => a.id !== id));
        }}
        onCopyToWorkspace={createCopyToWorkspaceHandler(
          args.onCopyToWorkspace ?? (() => {}),
        )}
      />
    );
  },
  args: {
    attachments: mockAttachments,
    editMode: true,
    onFilesSelected: fn(),
    onRemoveAttachment: fn(),
    onCopyToWorkspace: fn(),
    getDownloadUrl: (id: string) => `#/download/${id}`,
    downloadAllUrl: '#/download/all',
  },
};
