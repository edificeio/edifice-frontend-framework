import { render, screen, waitFor } from '~/setup';

import { AddAttachments } from './AddAttachments';
import { Attachment } from './models/attachment';

const attachment: Attachment = {
  id: 'attachment-1',
  charset: 'UTF-8',
  contentTransferEncoding: 'binary',
  contentType: 'application/pdf',
  filename: 'document.pdf',
  name: 'Document PDF',
  size: 102400,
  file: new File([], 'document.pdf'),
};

describe('AddAttachments', () => {
  beforeEach(() => {
    // AddAttachmentToWorkspaceModal renders through a portal targeting this node.
    const portal = document.createElement('div');
    portal.id = 'portal';
    document.body.appendChild(portal);
  });

  afterEach(() => {
    document.getElementById('portal')?.remove();
  });

  it('renders without crashing when entering through AddAttachments in editMode', () => {
    render(
      <AddAttachments attachments={[attachment]} editMode onChange={vi.fn()} />,
    );

    expect(screen.getByText('document.pdf')).toBeInTheDocument();
  });

  it('removes an attachment when its delete button is clicked', async () => {
    const onChange = vi.fn();
    const onRemoveAttachment = vi.fn();
    const { user } = render(
      <AddAttachments
        attachments={[attachment]}
        editMode
        onChange={onChange}
        onRemoveAttachment={onRemoveAttachment}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Remove attachment' }));

    expect(onChange).toHaveBeenCalledWith([]);
    expect(onRemoveAttachment).toHaveBeenCalledWith(attachment.id);
  });

  it('renders a download link using the provided URL', () => {
    render(
      <AddAttachments
        attachments={[attachment]}
        editMode
        onChange={vi.fn()}
        getDownloadUrl={(id) => `https://workspace.example/${id}`}
      />,
    );

    const downloadButton = screen.getByRole('button', {
      name: 'Download attachment',
    });

    expect(downloadButton.closest('a')).toHaveAttribute(
      'href',
      'https://workspace.example/attachment-1',
    );
  });

  it('opens the copy-to-workspace modal when its button is clicked', async () => {
    const onCopyToWorkspace = vi.fn().mockResolvedValue(true);
    const { user } = render(
      <AddAttachments
        attachments={[attachment]}
        editMode
        onChange={vi.fn()}
        onCopyToWorkspace={onCopyToWorkspace}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Copy to workspace' }));

    await waitFor(() =>
      expect(screen.getByText('Add to folder')).toBeInTheDocument(),
    );
  });
});
