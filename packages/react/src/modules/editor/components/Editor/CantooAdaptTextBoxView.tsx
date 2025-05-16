import { useEffect, useRef } from 'react';
import { useEditorContext } from '../../hooks';

const CantooAdaptTextBoxView = ({
  openPosition,
}: {
  openPosition?: { right: boolean; bottom: boolean };
}) => {
  const { editor } = useEditorContext();
  const containerRef = useRef<HTMLDivElement>(null);

  const Cantoo = (window as any).Cantoo;

  const editorHTML = editor?.getHTML();
  const cantooHTML = Cantoo?.formatText(editorHTML) || editorHTML;

  useEffect(() => {
    if (openPosition?.bottom) {
      containerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, []);

  return (
    <>
      {openPosition?.right && (
        <div
          style={{
            width: '1px',
            backgroundColor: '#e0e0e0',
            margin: '0 3px',
          }}
        />
      )}
      <div
        style={{ flex: 1, marginTop: openPosition?.bottom ? '16px' : '0px' }}
      >
        <div
          ref={containerRef}
          className={`${openPosition?.bottom ? 'card' : ''} py-12 px-16`}
        >
          <div dangerouslySetInnerHTML={{ __html: cantooHTML }} />
        </div>
      </div>
    </>
  );
};

export default CantooAdaptTextBoxView;
