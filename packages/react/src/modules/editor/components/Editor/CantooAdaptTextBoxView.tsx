import { useEditorContext } from '../../hooks';

const CantooAdaptTextBoxView = () => {
  const { editor } = useEditorContext();

  const Cantoo = (window as any).Cantoo;

  const editorHTML = editor?.getHTML();
  const cantooHTML = Cantoo?.formatText(editorHTML) || editorHTML;

  return (
    <div className="card p-24 mt-8">
      <div dangerouslySetInnerHTML={{ __html: cantooHTML }} />
    </div>
  );
};

export default CantooAdaptTextBoxView;
