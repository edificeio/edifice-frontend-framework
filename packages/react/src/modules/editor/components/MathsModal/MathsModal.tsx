import { useEffect, useState } from 'react';

import Mathematics from '@tiptap/extension-mathematics';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from '../../../../components';

interface ModalProps {
  isOpen: boolean;
  onSuccess?: (formulaEditor: string) => void;
  onCancel?: () => void;
}

const MathsModal = ({ isOpen, onSuccess, onCancel }: ModalProps) => {
  const FORMULA_PLACEHOLDER = '\\frac{-b + \\sqrt{b^2 - 4ac}}{2a}';
  const [formulaEditor, setFormulaEditor] = useState<string>(
    `$${FORMULA_PLACEHOLDER}$`,
  );

  const { t } = useTranslation();

  const editor: Editor | null = useEditor({
    extensions: [StarterKit, Mathematics],
    content: ``,
    editable: false,
  });

  useEffect(() => {
    editor?.commands.setContent(formulaEditor);
    editor?.commands.enter();
    return;
  }, [editor, formulaEditor]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newFormulaTextarea: string = event.target.value;
    const newFormulaEditor = newFormulaTextarea.replaceAll('\n', '$<br/>$');
    // replace editor content
    if (newFormulaEditor) {
      editor?.commands.setContent(`$${newFormulaEditor}$`);
      setFormulaEditor(`$${newFormulaEditor}$`);
    } else {
      editor?.commands.setContent('');
      setFormulaEditor('');
    }
    editor?.commands.enter();
  };

  const handleOnCancel = () => {
    onCancel?.();
  };

  return (
    <Modal id="MathsModal" isOpen={isOpen} onModalClose={handleOnCancel}>
      <Modal.Header onModalClose={handleOnCancel}>
        {t('tiptap.maths.title')}
      </Modal.Header>
      <Modal.Subtitle>
        {t('tiptap.maths.subtitle.1')}
        <a
          href={t(
            'https://fr.wikibooks.org/wiki/LaTeX/%C3%89crire_des_math%C3%A9matiques',
          )}
          target="_blank"
        >
          {t('tiptap.maths.subtitle.2')}
        </a>
      </Modal.Subtitle>
      <Modal.Body>
        <textarea
          id="formulaTextArea"
          name="formula"
          rows={4}
          cols={50}
          onChange={handleChange}
          placeholder={`Exemple : ${FORMULA_PLACEHOLDER}`}
          className="border rounded-3 w-100 px-16 py-12"
        ></textarea>
        <EditorContent
          editor={editor}
          className="pt-24 pb-0 text-center fs-1"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="tertiary"
          onClick={onCancel}
          type="button"
          variant="ghost"
        >
          {t('tiptap.maths.cancel')}
        </Button>
        <Button
          color="primary"
          onClick={() => onSuccess?.(formulaEditor)}
          type="button"
          variant="filled"
        >
          {t('tiptap.maths.add')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MathsModal;
