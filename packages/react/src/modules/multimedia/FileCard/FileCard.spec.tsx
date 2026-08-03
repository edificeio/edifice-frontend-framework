import { WorkspaceElement } from '@edifice.io/client';
import { render, screen } from '~/setup';
import FileCard from './FileCard';

const { getRole, getThumbnailUrl, useThumbnail } = vi.hoisted(() => ({
  getRole: vi.fn(),
  getThumbnailUrl: vi.fn(() => '/workspace/thumbnail/doc-id'),
  useThumbnail: vi.fn(() => false),
}));

vi.mock('@edifice.io/client', () => ({
  DocumentHelper: { getRole },
  odeServices: { workspace: () => ({ getThumbnailUrl }) },
}));

vi.mock('../../../hooks/useThumbnail', () => ({ useThumbnail }));

function doc(partial: Partial<WorkspaceElement> = {}): WorkspaceElement {
  return {
    _id: 'doc-id',
    name: 'rapport.pdf',
    ownerName: 'Pascal Saussier',
    eType: 'file',
    ...partial,
  } as unknown as WorkspaceElement;
}

const tile = () => document.querySelector('.file');

describe('FileCard', () => {
  beforeEach(() => {
    getRole.mockReturnValue('pdf');
    useThumbnail.mockReturnValue(false);
  });

  it('shows the document name and its owner', () => {
    render(<FileCard doc={doc()} />);

    expect(screen.getByText('rapport.pdf')).toBeInTheDocument();
    expect(screen.getByText('Pascal Saussier')).toBeInTheDocument();
  });

  describe('file type styling', () => {
    it.each([
      ['pdf', 'bg-red-200', '.PDF'],
      ['csv', 'bg-orange-200', '.CSV'],
      ['xls', 'bg-green-200', '.XLS'],
      ['doc', 'bg-blue-200', '.DOC'],
      ['txt', 'bg-blue-200', '.TXT'],
      ['ppt', 'bg-red-200', '.PPT'],
      ['zip', 'bg-gray-300', '.ZIP'],
      ['md', 'bg-blue-200', '.MD'],
    ])('labels a %s document', (role, color, label) => {
      getRole.mockReturnValue(role);

      render(<FileCard doc={doc()} />);

      expect(tile()).toHaveClass(color);
      expect(screen.getByText(label)).toBeInTheDocument();
    });

    it.each([
      ['audio', 'bg-red-200'],
      ['img', 'bg-green-200'],
      ['video', 'bg-purple-200'],
    ])('renders an icon for a %s document', (role, color) => {
      getRole.mockReturnValue(role);

      render(<FileCard doc={doc()} />);

      expect(tile()).toHaveClass(color);
      expect(tile()?.querySelector('svg')).not.toBeNull();
    });

    it('falls back to the unknown mapping for an unmapped role', () => {
      getRole.mockReturnValue('exotic');

      render(<FileCard doc={doc()} />);

      expect(tile()).toHaveClass('bg-gray-300');
    });

    it('falls back to the unknown mapping when the role cannot be read', () => {
      getRole.mockReturnValue(undefined);

      render(<FileCard doc={doc()} />);

      expect(tile()).toHaveClass('bg-gray-300');
    });
  });

  describe('custom appearance', () => {
    it('honors a custom icon and a custom color', () => {
      render(
        <FileCard
          doc={doc()}
          customIcon={<span data-testid="custom-icon" />}
          customColor="bg-purple-300"
        />,
      );

      expect(tile()).toHaveClass('bg-purple-300');
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('keeps a default icon when only the color is customised', () => {
      render(<FileCard doc={doc()} customColor="bg-purple-300" />);

      expect(tile()).toHaveClass('bg-purple-300');
      expect(tile()?.querySelector('svg')).not.toBeNull();
    });

    it('keeps a default color when only the icon is customised', () => {
      render(
        <FileCard
          doc={doc()}
          customIcon={<span data-testid="custom-icon" />}
        />,
      );

      expect(tile()).toHaveClass('bg-gray-300');
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('thumbnail', () => {
    it('asks the workspace for a thumbnail of an image', () => {
      getRole.mockReturnValue('img');

      render(<FileCard doc={doc()} />);

      expect(getThumbnailUrl).toHaveBeenCalled();
      expect(useThumbnail).toHaveBeenCalledWith(
        '/workspace/thumbnail/doc-id',
        expect.objectContaining({ ref: expect.anything() }),
      );
    });

    it('asks the workspace for a thumbnail of a video', () => {
      getRole.mockReturnValue('video');

      render(<FileCard doc={doc()} />);

      expect(getThumbnailUrl).toHaveBeenCalled();
    });

    it('asks for nothing on a document without preview', () => {
      getRole.mockReturnValue('pdf');

      render(<FileCard doc={doc()} />);

      expect(useThumbnail).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ ref: expect.anything() }),
      );
    });

    it('reads the thumbnail carried by a resource', () => {
      render(
        <FileCard
          doc={doc({
            eType: 'resource',
            thumbnail: '/resource/thumb',
          } as never)}
        />,
      );

      expect(useThumbnail).toHaveBeenCalledWith(
        '/resource/thumb',
        expect.anything(),
      );
      expect(getThumbnailUrl).not.toHaveBeenCalled();
    });

    it('paints the thumbnail as background once available', () => {
      getRole.mockReturnValue('img');
      useThumbnail.mockReturnValue(true);

      render(<FileCard doc={doc()} />);

      expect(tile()).toHaveStyle({ backgroundSize: 'cover' });
    });

    it('hides the file icon once an image thumbnail is displayed', () => {
      getRole.mockReturnValue('img');
      useThumbnail.mockReturnValue(true);

      render(<FileCard doc={doc()} />);

      expect(tile()?.querySelector('svg')).toBeNull();
    });

    it('keeps the icon on an image without thumbnail', () => {
      getRole.mockReturnValue('img');
      useThumbnail.mockReturnValue(false);

      render(<FileCard doc={doc()} />);

      expect(tile()?.querySelector('svg')).not.toBeNull();
    });

    it('keeps the icon on a video even with a thumbnail', () => {
      getRole.mockReturnValue('video');
      useThumbnail.mockReturnValue(true);

      render(<FileCard doc={doc()} />);

      expect(tile()?.querySelector('svg')).not.toBeNull();
    });
  });

  describe('card behaviour', () => {
    it('is clickable by default', async () => {
      const onClick = vi.fn();
      const { user } = render(<FileCard doc={doc()} onClick={onClick} />);

      await user.click(
        screen.getByRole('button', { name: 'card.open.resource' }),
      );

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('offers the selection menu when selectable', async () => {
      const onSelect = vi.fn();
      const { user } = render(
        <FileCard doc={doc()} isSelectable onSelect={onSelect} />,
      );

      await user.click(screen.getByRole('button', { name: 'card.open.menu' }));

      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('appends the custom classes to the card', () => {
      render(<FileCard doc={doc()} className="my-card" />);

      expect(document.querySelector('.card-file')).toHaveClass('my-card');
    });
  });
});
