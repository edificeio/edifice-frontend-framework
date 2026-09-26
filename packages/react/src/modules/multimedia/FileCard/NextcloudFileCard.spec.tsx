import { NextcloudDocument } from '@edifice.io/client';
import { render, screen } from '~/setup';
import NextcloudFileCard from './NextcloudFileCard';

const { role, getFileUrl, useThumbnail } = vi.hoisted(() => ({
  role: vi.fn(),
  getFileUrl: vi.fn(() => '/nextcloud/files/user/user-1/file/img.png/download'),
  useThumbnail: vi.fn(() => false),
}));

vi.mock('@edifice.io/client', () => ({
  DocumentHelper: { role },
  odeServices: { nextcloud: () => ({ getFileUrl }) },
}));

vi.mock('../../../hooks/useThumbnail', () => ({ useThumbnail }));

function doc(partial: Partial<NextcloudDocument> = {}): NextcloudDocument {
  return {
    path: '/report.pdf',
    name: 'report.pdf',
    ownerDisplayName: 'Pascal Saussier',
    isFolder: false,
    ...partial,
  };
}

const tile = () => document.querySelector('.file');

describe('NextcloudFileCard', () => {
  beforeEach(() => {
    role.mockReturnValue('pdf');
    useThumbnail.mockReturnValue(false);
  });

  it('shows the document name and its owner', () => {
    render(<NextcloudFileCard doc={doc()} userId="user-1" />);

    expect(screen.getByText('report.pdf')).toBeInTheDocument();
    expect(screen.getByText('Pascal Saussier')).toBeInTheDocument();
  });

  it.each([
    ['pdf', 'bg-red-200', '.PDF'],
    ['csv', 'bg-orange-200', '.CSV'],
    ['doc', 'bg-blue-200', '.DOC'],
  ])('labels a %s document', (docRole, color, label) => {
    role.mockReturnValue(docRole);

    render(<NextcloudFileCard doc={doc()} userId="user-1" />);

    expect(tile()).toHaveClass(color);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('falls back to the unknown mapping for an unmapped role', () => {
    role.mockReturnValue(undefined);

    render(<NextcloudFileCard doc={doc()} userId="user-1" />);

    expect(tile()).toHaveClass('bg-gray-300');
  });

  describe('thumbnail', () => {
    it('builds a preview URL only for image documents', () => {
      role.mockReturnValue('img');

      render(<NextcloudFileCard doc={doc()} userId="user-1" />);

      expect(getFileUrl).toHaveBeenCalledWith('user-1', doc());
      expect(useThumbnail).toHaveBeenCalledWith(
        '/nextcloud/files/user/user-1/file/img.png/download',
        expect.objectContaining({ ref: expect.anything() }),
      );
    });

    it('asks for nothing on a non-image document', () => {
      role.mockReturnValue('pdf');

      render(<NextcloudFileCard doc={doc()} userId="user-1" />);

      expect(getFileUrl).not.toHaveBeenCalled();
      expect(useThumbnail).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ ref: expect.anything() }),
      );
    });

    it('paints the thumbnail as background once available and hides the icon', () => {
      role.mockReturnValue('img');
      useThumbnail.mockReturnValue(true);

      render(<NextcloudFileCard doc={doc()} userId="user-1" />);

      expect(tile()).toHaveStyle({ backgroundSize: 'cover' });
      expect(tile()?.querySelector('svg')).toBeNull();
    });

    it('keeps the icon on an image without a loaded thumbnail', () => {
      role.mockReturnValue('img');
      useThumbnail.mockReturnValue(false);

      render(<NextcloudFileCard doc={doc()} userId="user-1" />);

      expect(tile()?.querySelector('svg')).not.toBeNull();
    });
  });

  describe('card behaviour', () => {
    it('reports selection state and click', async () => {
      const onClick = vi.fn();
      const { user } = render(
        <NextcloudFileCard doc={doc()} userId="user-1" onClick={onClick} />,
      );

      await user.click(
        screen.getByRole('button', { name: 'card.open.resource' }),
      );

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('appends the custom classes to the card', () => {
      render(
        <NextcloudFileCard doc={doc()} userId="user-1" className="my-card" />,
      );

      expect(document.querySelector('.card-file')).toHaveClass('my-card');
    });
  });
});
