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
import Focus from '@tiptap/extension-focus';
import FontFamily from '@tiptap/extension-font-family';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Table from '@tiptap/extension-table';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import { Content, Extensions, FocusPosition, useEditor } from '@tiptap/react';
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
  onContentChange?: ({ editor }: { editor: any }) => void,
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
      StarterKit,
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
      Underline,
      TextStyle,
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
    editor?.commands.setContent(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useEffect(() => {
    focus && editor?.commands.focus(focus);
  }, [editor, focus, editable]);

  return { editor, editable };
};
