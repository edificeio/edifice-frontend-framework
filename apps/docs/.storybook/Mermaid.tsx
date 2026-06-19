import mermaid from 'mermaid';
import { useEffect, useRef, useState } from 'react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  flowchart: { htmlLabels: true, curve: 'basis' },
});

// Unique id per rendered diagram (mermaid.render requires a unique DOM id).
let diagramCount = 0;

/**
 * Renders a Mermaid diagram from a chart definition string.
 * Used inside MDX documentation pages to draw flows and sequences.
 */
export const Mermaid = ({ chart }: { chart: string }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(`mermaid-diagram-${diagramCount++}`);

  useEffect(() => {
    let active = true;
    mermaid
      .render(idRef.current, chart.trim())
      .then(({ svg }) => {
        if (active) {
          setSvg(svg);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      active = false;
    };
  }, [chart]);

  if (error) {
    return (
      <pre style={{ color: '#b00020', whiteSpace: 'pre-wrap' }}>
        Mermaid error: {error}
      </pre>
    );
  }

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default Mermaid;
