import { StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Grid } from '../Grid';
import type { AddAttachmentsProps } from './AddAttachments';
import { AddAttachments } from './AddAttachments';
import { Attachment } from './models/attachment';

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
          "AddAttachments affiche une liste de pièces jointes et gère l'ajout (sélection de fichiers). Les fichiers sont transmis au parent via onFilesSelected ; l'UI se met à jour immédiatement (liste optimiste). Options optionnelles : onCopyToWorkspace (boutons « copier vers l'espace »), getDownloadUrl (bouton télécharger par pièce), downloadAllUrl (bouton « télécharger tout » si plusieurs pièces). Mode édition (ajout/suppression) ou visualisation (lecture seule).",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AddAttachments>;

export const Base: Story = {
  args: {
    attachments: [],
    editMode: true,
    onFilesSelected: fn(),
    onRemoveAttachment: fn(),
  },
};

export const ModeEdition: Story = {
  render: function ModeEditionRender(args: AddAttachmentsProps) {
    const [attachments, setAttachments] = useState<Attachment[]>(
      args.attachments,
    );

    return (
      <AddAttachments
        {...args}
        attachments={attachments}
        onFilesSelected={(files) => {
          args.onFilesSelected(files);
        }}
        onRemoveAttachment={(attachmentId) => {
          args.onRemoveAttachment(attachmentId);
          setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
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

export const ModeVisualisation: Story = {
  args: {
    attachments: mockAttachments,
    editMode: false,
    onFilesSelected: fn(),
    onRemoveAttachment: fn(),
  },
};

export const AvecCopierVersEspace: Story = {
  args: {
    attachments: mockAttachments,
    editMode: true,
    onFilesSelected: fn(),
    onRemoveAttachment: fn(),
    onCopyToWorkspace: fn(),
  },
};

export const AvecTelechargement: Story = {
  args: {
    attachments: mockAttachments,
    editMode: true,
    onFilesSelected: fn(),
    onRemoveAttachment: fn(),
    getDownloadUrl: (attachmentId: string) => `#/download/${attachmentId}`,
    downloadAllUrl: '#/download/all',
  },
};

export const ToutesOptions: Story = {
  args: {
    attachments: mockAttachments,
    editMode: true,
    onFilesSelected: fn(),
    onRemoveAttachment: fn(),
    onCopyToWorkspace: fn(),
    getDownloadUrl: (attachmentId: string) => `#/download/${attachmentId}`,
    downloadAllUrl: '#/download/all',
  },
};

export const NomLong: Story = {
  render: function NomLongRender(args: AddAttachmentsProps) {
    const longNameAttachments: Attachment[] = [
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
            attachments={longNameAttachments}
            onFilesSelected={args.onFilesSelected}
            onRemoveAttachment={args.onRemoveAttachment}
            editMode={true}
          />
        </Grid.Col>
      </Grid>
    );
  },
  args: {
    attachments: [],
    editMode: true,
    onFilesSelected: fn(),
    onRemoveAttachment: fn(),
  },
};

export const BlocPiecesJointes: Story = {
  args: {
    attachments: mockAttachments,
    editMode: true,
    onFilesSelected: fn(),
    onRemoveAttachment: fn(),
  },
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundColor: '#F2F2F2',
          borderRadius: '8px',
          padding: '12px',
        }}
      >
        <p className="m-12">Bloc pièces jointes</p>
        <Story />
      </div>
    ),
  ],
};
