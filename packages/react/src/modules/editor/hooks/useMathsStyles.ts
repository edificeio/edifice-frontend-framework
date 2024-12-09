import { useEffect } from 'react';

// Import Katex CSS without bundling it.
export const useMathsStyles = () => {
  useEffect(() => {
    const katexURL =
      'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css';
    let hasKatexLink = false;
    const links = document.head.getElementsByTagName('link');

    for (const link of links) {
      if (link.href === katexURL) {
        hasKatexLink = true;
        return;
      }
    }

    if (!hasKatexLink) {
      const link = document.createElement('link');
      link.href = katexURL;
      link.rel = 'stylesheet';
      link.type = 'text/css';

      document.links;
      document.head.appendChild(link);
    }
  }, []);
};
