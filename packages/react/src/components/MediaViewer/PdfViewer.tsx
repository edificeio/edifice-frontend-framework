import { useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { LoadingScreen } from '../LoadingScreen';

export default function PdfViewer({
  mediaUrl,
  scale,
}: {
  mediaUrl: string;
  scale?: number;
}) {
  const [numPages, setNumPages] = useState<number | null>(null);

  const pagesRef = useRef<HTMLDivElement[]>([]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };
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
