import { LoadingScreen } from "@edifice.io/react";
import { useRef, useState } from "react";
import { Document, Page } from "react-pdf";

export default function PdfViewer({
  mediaUrl,
  scale,
}: {
  mediaUrl: string;
  scale?: number;
}) {
  const [numPages, setNumPages] = useState<number | null>(null);

  const pagesRef = useRef<HTMLDivElement[]>([]);

  /* useEffect(() => {
    let timer: number | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisible = null;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisible = entry.target;
          }
        });

        if (mostVisible) {
          const index = pagesRef.current.indexOf(mostVisible as HTMLDivElement);

          if (timer) clearTimeout(timer);

          timer = window.setTimeout(() => {
            setCurrentPage(index + 1);
          }, 50); // 0.5 sec
        }
      },
      {
        root: null,
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      },
    );

    pagesRef.current.forEach((el) => el && observer.observe(el));

    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [numPages]); */

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };
  return (
    <div
      style={{
        width: `calc(600px * ${scale})`,
        height: "calc(100vh - 52px)",
        overflowY: "auto",
        marginTop: "20px",
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
            style={{ marginBottom: 32, transformOrigin: "top center" }}
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
