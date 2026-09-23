import { MediaLibraryType } from '../../modules/multimedia';
import { render, screen } from '~/setup';
import { MediaWrapper } from './MediaWrapper';

// The PDF viewer relies on react-pdf, already neutralised by the test setup.
// MediaWrapper loads it through React.lazy, so it resolves asynchronously here.
vi.mock('./PdfViewer', () => ({
  default: ({ mediaUrl }: { mediaUrl: string }) => (
    <div data-testid="pdf-viewer">{mediaUrl}</div>
  ),
}));

const renderMedia = (
  mediaType: MediaLibraryType,
  {
    mimeType,
    mediaUrl = '/media/file',
  }: { mimeType?: string; mediaUrl?: string } = {},
) =>
  render(
    <MediaWrapper
      mediaType={mediaType}
      mediaUrl={mediaUrl}
      mimeType={mimeType}
    />,
  );

describe('MediaWrapper', () => {
  it('renders an image', () => {
    renderMedia('image');

    expect(screen.getByRole('img')).toHaveAttribute('src', '/media/file');
  });

  describe('attachment', () => {
    it('delegates a PDF to the dedicated viewer', async () => {
      renderMedia('attachment', { mimeType: 'application/pdf' });

      expect(await screen.findByTestId('pdf-viewer')).toHaveTextContent(
        '/media/file',
      );
    });

    it('offers a download link for any other mime type', () => {
      renderMedia('attachment', { mimeType: 'application/msword' });

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/media/file');
      expect(link).toHaveAttribute('download');
      expect(screen.getByText('Download')).toBeInTheDocument();
    });

    it('offers a download link when the mime type is unknown', () => {
      renderMedia('attachment');

      expect(screen.getByRole('link')).toHaveAttribute('download');
    });
  });

  describe('hyperlink', () => {
    it('opens the link instead of downloading it', () => {
      renderMedia('hyperlink');

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).not.toHaveAttribute('download');
      expect(screen.getByText('Open link')).toBeInTheDocument();
    });

    it('delegates a PDF hyperlink to the dedicated viewer', async () => {
      renderMedia('hyperlink', { mimeType: 'application/pdf' });

      expect(await screen.findByTestId('pdf-viewer')).toBeInTheDocument();
    });
  });

  it('renders nothing for an unsupported media type', () => {
    const { container } = renderMedia('unknown' as MediaLibraryType);

    expect(container).toBeEmptyDOMElement();
  });
});
