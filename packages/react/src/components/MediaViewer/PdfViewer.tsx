import { useEffect, useRef, useState } from 'react';
import { DocumentProps, PageProps } from 'react-pdf';
import { LoadingScreen } from '../LoadingScreen';

export default function PdfViewer({
  mediaUrl,
  scale,
}: {
  mediaUrl: string;
  scale?: number;
}) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [Document, setDocument] =
    useState<React.ComponentType<DocumentProps> | null>(null);
  const [Page, setPage] = useState<React.ComponentType<PageProps> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const pagesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Dynamic import of react-pdf to avoid DOMMatrix issues in test environments
    const loadReactPdf = async () => {
      try {
        const reactPdf = await import('react-pdf');
        setDocument(() => reactPdf.Document);
        setPage(() => reactPdf.Page);
      } catch (error) {
        console.error('Failed to load react-pdf:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReactPdf();
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  if (isLoading || !Document || !Page) {
    return <LoadingScreen />;
  }

  return (
    <div
      style={{
        width: `calc(600px * ${scale})`,
        height: 'calc(100vh - 52px)',
        overflowY: 'auto',
        marginTop: '20px',
      }}
    >
      <Document
        file={mediaUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<LoadingScreen />}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <div
            key={index}
            ref={(el) => (pagesRef.current[index] = el!)}
            style={{ marginBottom: 32, transformOrigin: 'top center' }}
          >
            <Page
              className="pdf-page"
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={600 * (scale ?? 1)}
              loading={<LoadingScreen />}
            />
          </div>
        ))}
      </Document>
    </div>
  );
}
