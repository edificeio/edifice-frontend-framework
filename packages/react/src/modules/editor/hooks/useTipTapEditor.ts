import { useEffect } from 'react';

import { Alert } from '@edifice.io/tiptap-extensions/alert';
import { FontSize } from '@edifice.io/tiptap-extensions/font-size';
import { CustomHeading } from '@edifice.io/tiptap-extensions/heading';
import { CustomHighlight } from '@edifice.io/tiptap-extensions/highlight';
import { Hyperlink } from '@edifice.io/tiptap-extensions/hyperlink';
import { SpeechRecognition } from '@edifice.io/tiptap-extensions/speech-recognition';
import { SpeechSynthesis } from '@edifice.io/tiptap-extensions/speech-synthesis';
import { TableCell } from '@edifice.io/tiptap-extensions/table-cell';
import { Mathematics } from '@tiptap/extension-mathematics';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { Focus, Placeholder } from '@tiptap/extensions';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Table, TableHeader, TableRow } from '@tiptap/extension-table';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import {
  Content,
  Editor,
  Extensions,
  FocusPosition,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { useTranslation } from 'react-i18next';

import { WorkspaceVisibility } from '@edifice.io/client';
import { useUpload } from '../../../hooks';
import { useEdificeClient } from '../../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import {
  AttachmentNodeView,
  AttachmentRenderer,
  AudioNodeView,
  AudioRenderer,
  IframeNodeView,
  ImageNodeView,
  InformationPaneNodeView,
  InformationPaneRenderer,
  LinkerNodeView,
  LinkerRenderer,
  MediaRenderer,
  VideoNodeView,
} from '../components';

/**
 * Hook that creates a tiptap editor instance.
 *
 * @param editable truthy if the editor content should be editable
 * @param content default rich content
 * @param focus set focus position to the editor
 * @param placeholder editor placeholder content
 * @param onContentChange callback to be called on content change
 * @param visibility workspace visibility
 * @param extensions extensions to add to the editor
 * @returns the editor instance and the editable state
 */
export const useTipTapEditor = (
  editable: boolean,
  content: Content,
  focus?: FocusPosition,
  placeholder?: string,
  onContentChange?: ({ editor }: { editor: Editor }) => void,
  visibility: WorkspaceVisibility = 'protected',
  extensions?: Extensions,
) => {
  const { currentLanguage } = useEdificeClient();
  const { t } = useTranslation();

  const { uploadFile } = useUpload(visibility);
  const editor = useEditor({
    // fix WB-2534
    // TipTap editor must be instantiated in editable mode for table columns to be resizable.
    // It will then be set in the correct editable mode, by a useEffect below.
    editable: true,
    extensions: [
      // v3's StarterKit bundles its own heading/link nodes, which would compete with
      // CustomHeading/Hyperlink below for the same HTML tags. Disabled.
      // `underline` stays enabled (default) - same as the explicit Underline
      // extension it replaces, no custom one added below.
      StarterKit.configure({
        heading: false,
        link: false,
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
      Placeholder.configure({
        placeholder: t(placeholder || 'tiptap.placeholder'),
      }),
      CustomHighlight.configure({
        multicolor: true,
      }),
      // v3's TextStyleKit bundles its own color/fontFamily/fontSize, which would
      // duplicate the Color/FontFamily/FontSize added below. Disabled.
      // backgroundColor/lineHeight are also disabled: they're new in v3 (v2
      // stripped these inline styles), and lineHeight would otherwise collide
      // with our own @edifice.io/tiptap-extensions/line-height by name for
      // any caller that adds it via this hook's `extensions` param.
      TextStyleKit.configure({
        color: false,
        fontFamily: false,
        fontSize: false,
        backgroundColor: false,
        lineHeight: false,
      }),
      Color,
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'video', 'audio', 'iframe'],
      }),
      CustomHeading.configure({
        levels: [1, 2],
      }),
      Typography,
      FontSize,
      SpeechRecognition,
      SpeechSynthesis.configure({
        lang:
          currentLanguage?.length === 2
            ? `${currentLanguage}-${currentLanguage.toUpperCase()}` // FIXME very dirty hack for demo
            : 'fr-FR',
      }),
      Hyperlink,
      FontFamily,
      Mathematics,
      Alert,
      IframeNodeView(MediaRenderer),
      VideoNodeView(MediaRenderer),
      AudioNodeView(AudioRenderer),
      LinkerNodeView(LinkerRenderer),
      ImageNodeView(MediaRenderer, uploadFile),
      AttachmentNodeView(AttachmentRenderer),
      InformationPaneNodeView(InformationPaneRenderer),
      ...(extensions || []),
    ],
    content,
    // If the onContentChange callback is provided, we call it on every content change.
    ...(onContentChange
      ? {
          onUpdate: onContentChange,
        }
      : {}),
  });

  useEffect(() => {
    editor?.setEditable(editable, false); // Don't emit the update event, since content did not change.
  }, [editor, editable]);

  useEffect(() => {
    // v3's setContent emits the 'update' event by default (v2 didn't), which
    // would call onContentChange for this programmatic sync, not just real
    // user edits. Keep it silent, like setEditable above.
    editor?.commands.setContent(content, { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useEffect(() => {
    focus && editor?.commands.focus(focus);
  }, [editor, focus, editable]);

  return { editor, editable };
};
