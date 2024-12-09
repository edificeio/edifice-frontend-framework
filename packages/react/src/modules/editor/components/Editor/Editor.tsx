import {
  Ref,
  Suspense,
  forwardRef,
  lazy,
  useId,
  useImperativeHandle,
} from 'react';

import { WorkspaceVisibility } from '@edifice.io/ts-client';
import {
  Content,
  EditorContent,
  FocusPosition,
  JSONContent,
} from '@tiptap/react';
import clsx from 'clsx';

import {
  BubbleMenuEditImage,
  EditorContext,
  EditorToolbar,
  LinkToolbar,
  TableToolbar,
  useImageModal,
  useLinkToolbar,
  useMathsModal,
  useMediaLibraryEditor,
  useSpeechSynthetisis,
  useTipTapEditor,
} from '../..';
import { LoadingScreen } from '../../../../components';
import { useEdificeClient } from '../../../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import { MediaLibrary } from '../../../multimedia';
import { useMathsStyles } from '../../hooks/useMathsStyles';

const MathsModal = lazy(async () => await import('./MathsModal'));
const ImageEditor = lazy(
  async () =>
    await import('../../../multimedia/ImageEditor/components/ImageEditor'),
);

export interface EditorRef {
  /** Get the current content. */
  getContent: (
    as: 'html' | 'json' | 'plain',
  ) => undefined | string | JSONContent;

  /** Get speech synthetisis current state */
  isSpeeching: () => boolean;
  /** [De]activate speech synthetisis */
  toogleSpeechSynthetisis: () => boolean;
}

/**
 * Editor component properties
 */
export interface EditorProps {
  /**
   * (Optional) id of the HTML element.
   * Useful with an external `<FormControl id=...><Label/>`.
   */
  id?: string;
  /** Rich content to render. */
  content: Content;
  /**
   * Rendering mode : `edit` to allow content modifications, or `read` (default)
   * Switching to `edit` mode will also render the toolbar
   * (unless `toolbar` property is `none`).
   */
  mode?: 'edit' | 'read' /* | "preview" */;
  /** Toolbar to display in `edit` mode. */
  toolbar?: 'full' | 'none';
  /** Display with or without a border */
  variant?: 'outline' | 'ghost';
  /** Set focus position to the editor */
  focus?: FocusPosition;
  /** Editor placeholder content */
  placeholder?: string;
  /** Visibility of the content created
   *  this will impact where the uploaded files will be upload and the availability of the public media files  */
  visibility?: WorkspaceVisibility;
  /** Function to listen if content change */
  onContentChange?: ({ editor }: { editor: any }) => void;
}

const Editor = forwardRef(
  (
    {
      id,
      content,
      mode = 'read',
      toolbar = 'full',
      variant = 'outline',
      focus = 'start',
      placeholder = '',
      visibility = 'protected',
      onContentChange,
    }: EditorProps,
    ref: Ref<EditorRef>,
  ) => {
    const editorId = useId();
    const { appCode } = useEdificeClient();
    const { editor, editable } = useTipTapEditor(
      mode === 'edit',
      content,
      focus,
      placeholder,
      onContentChange,
      visibility,
    );
    const { ref: mediaLibraryModalRef, ...mediaLibraryModalHandlers } =
      useMediaLibraryEditor(editor);
    const { toggle: toggleMathsModal, ...mathsModalHandlers } =
      useMathsModal(editor);
    const imageModal = useImageModal(editor, 'media-library', visibility);
    const linkToolbarHandlers = useLinkToolbar(editor, mediaLibraryModalRef);
    const speechSynthetisis = useSpeechSynthetisis(editor);

    useMathsStyles();

    //----- Editor API
    useImperativeHandle(ref, () => ({
      getContent: (as: 'html' | 'json' | 'plain') => {
        switch (as) {
          case 'html':
            return editor?.getHTML();
          case 'json':
            return editor?.getJSON();
          case 'plain':
            return editor?.getText();
          default:
            throw `[Editor] Unknown content format ${as}`;
        }
      },
      toogleSpeechSynthetisis: speechSynthetisis.toggle,
      isSpeeching: () => speechSynthetisis.isActivated,
    }));

    if (!editor) return null;

    const borderClass = clsx(variant === 'outline' && 'border rounded-3');
    const contentClass = clsx(variant === 'outline' && 'py-12 px-16');

    return (
      <EditorContext.Provider
        value={{
          id: id ?? editorId,
          appCode,
          editor,
          editable,
        }}
      >
        <div className={borderClass}>
          {toolbar !== 'none' && editable && (
            <EditorToolbar
              {...{
                mediaLibraryRef: mediaLibraryModalRef,
                toggleMathsModal: toggleMathsModal,
              }}
            />
          )}
          <EditorContent
            id={id ?? editorId}
            editor={editor}
            className={contentClass}
          />
        </div>

        <LinkToolbar editor={editor} {...linkToolbarHandlers} />

        <TableToolbar editor={editor} />

        {editor && (
          <BubbleMenuEditImage
            editor={editor}
            onEditImage={imageModal.handleEdit}
            openEditImage={imageModal.isOpen}
            editable={editable}
          />
        )}

        <Suspense fallback={<LoadingScreen />}>
          {editable && (
            <MediaLibrary
              appCode={appCode}
              visibility={visibility}
              multiple={true}
              ref={mediaLibraryModalRef}
              {...mediaLibraryModalHandlers}
            />
          )}

          {editable && mathsModalHandlers.isOpen && (
            <MathsModal {...mathsModalHandlers} />
          )}

          {editable && imageModal?.isOpen && imageModal?.currentImage && (
            <ImageEditor
              altText={imageModal?.currentImage.alt}
              legend={imageModal?.currentImage.title}
              image={imageModal?.currentImage.src}
              isOpen={imageModal.isOpen}
              onCancel={imageModal.handleCancel}
              onSave={imageModal.handleSave}
              onError={console.error}
            />
          )}
        </Suspense>
      </EditorContext.Provider>
    );
  },
);

export default Editor;
