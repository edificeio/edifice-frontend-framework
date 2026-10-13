// Resolved to a static asset path at lib build time, so consumer bundlers/dep
// optimizers never need to re-derive it from import.meta.url at runtime.
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

export const pdfWorkerSrc: string = pdfWorkerUrl;
