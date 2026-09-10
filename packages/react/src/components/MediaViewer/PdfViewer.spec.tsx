import { render, screen, waitFor } from '~/setup';
import { pdfWorkerSrc } from '../../pdfWorkerSrc';
import PdfViewer from './PdfViewer';

/**
 * Security regression tests for the react-pdf integration (#PEDAGO-4292).
 *
 * The last changes on this component moved the pdf.js worker from a remote CDN
 * (`https://unpkg.com/pdfjs-dist@.../pdf.worker.min.mjs`) to a bundled local
 * asset, and keep the text / annotation layers of every page disabled. Both are
 * defence-in-depth measures against a hostile PDF; these tests lock them in.
 */

const captured = vi.hoisted(() => ({
  documentProps: [] as Array<Record<string, unknown>>,
  pageProps: [] as Array<Record<string, unknown>>,
  workerOptions: {} as { workerSrc?: string },
}));

vi.mock('react-pdf', async () => {
  const React = await import('react');
  return {
    pdfjs: { GlobalWorkerOptions: captured.workerOptions },
    Document: ({ children, onLoadSuccess, file }: Record<string, unknown>) => {
      captured.documentProps.push({ file });
      React.useEffect(() => {
        (onLoadSuccess as (r: { numPages: number }) => void)?.({ numPages: 3 });
      }, [onLoadSuccess]);
      return React.createElement(
        'div',
        { 'data-testid': 'pdf-document' },
        children as React.ReactNode,
      );
    },
    Page: (props: Record<string, unknown>) => {
      captured.pageProps.push(props);
      return React.createElement('div', { 'data-testid': 'pdf-page' });
    },
  };
});

describe('PdfViewer — sécurité', () => {
  beforeEach(() => {
    captured.documentProps.length = 0;
    captured.pageProps.length = 0;
    delete captured.workerOptions.workerSrc;
  });

  it('sert le worker pdf.js depuis un asset local, jamais depuis un CDN tiers', async () => {
    render(<PdfViewer mediaUrl="/workspace/document/abc" />);

    await waitFor(() =>
      expect(captured.workerOptions.workerSrc).toBe(pdfWorkerSrc),
    );

    // The worker path is resolved from the bundled `pdfjs-dist` package...
    expect(pdfWorkerSrc).toEqual(expect.stringContaining('pdf.worker'));
    // ...and must never point at a remote origin (supply-chain / availability).
    expect(pdfWorkerSrc).not.toMatch(/^https?:\/\//i);
    expect(pdfWorkerSrc).not.toMatch(
      /unpkg\.com|jsdelivr|cdnjs|cloudflare|googleapis/i,
    );
  });

  it('désactive les couches texte et annotation sur chaque page (durcissement PDF malveillant)', async () => {
    render(<PdfViewer mediaUrl="/workspace/document/abc" />);

    await screen.findByTestId('pdf-document');
    await waitFor(() => expect(captured.pageProps.length).toBeGreaterThan(0));

    for (const props of captured.pageProps) {
      expect(props.renderTextLayer).toBe(false);
      expect(props.renderAnnotationLayer).toBe(false);
    }
  });

  it("transmet l'URL du média à <Document> sans la réinterpréter", async () => {
    const hostileUrl = '/workspace/doc?x="><img src=x onerror=alert(1)>';
    const { container } = render(<PdfViewer mediaUrl={hostileUrl} />);

    await screen.findByTestId('pdf-document');

    expect(captured.documentProps.at(-1)?.file).toBe(hostileUrl);
    // The URL is only ever handed to react-pdf as a prop, never injected as markup.
    expect(container.querySelector('img[onerror]')).toBeNull();
    expect(container.querySelector('script')).toBeNull();
  });

  it('affiche un écran de chargement tant que react-pdf n’est pas résolu (import paresseux)', async () => {
    const { container } = render(
      <PdfViewer mediaUrl="/workspace/document/abc" />,
    );

    // Synchronously, before the dynamic import() settles, no Document is mounted.
    expect(container.querySelector('[data-testid="pdf-document"]')).toBeNull();

    // Let the lazy import resolve so the state update flushes inside the test.
    await screen.findByTestId('pdf-document');
  });
});
