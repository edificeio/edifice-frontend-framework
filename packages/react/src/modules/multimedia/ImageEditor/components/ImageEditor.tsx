import { useState } from 'react';

import { Stage } from '@pixi/react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  FormControl,
  Input,
  Label,
  LoadingScreen,
  Modal,
} from '../../../../components';
import useImageEditor from '../hooks/useImageEditor';
import ImageEditorToolbar, { ImageEditorAction } from './ImageEditorToolbar';

interface ImageEditorProps {
  image: string;
  isOpen: boolean;
  legend?: string;
  altText?: string;
  onCancel(): void;
  onSave(arg: {
    blob: Blob;
    legend: string;
    altText: string;
  }): void | Promise<void>;
  onError?(err: string): void;
}
/**
 * This component display the Image Editor as a Modal
 *
 * @param param.altText the initial alternative text of the image
 * @param param.legend the initial title text of the image
 * @param param.image the URL of the image to edit
 * @param param.isOpen whether the modal is visible
 * @param param.onCancel callback when the modal is closed without saving
 * @param param.onError callback when the save action failed
 * @param param.onSave callback when the save action succeed and receive as params the new image as blob and also the new legend and alt
 * @returns A React Component
 */
const ImageEditor = ({
  altText: altTextParam,
  legend: legendParam,
  image: imageSrc,
  isOpen,
  onCancel,
  onError,
  onSave,
}: ImageEditorProps) => {
  const { t } = useTranslation();
  // Store the current operation in a state
  const [currentOperation, setCurrentOperation] = useState<
    ImageEditorAction | undefined
  >(undefined);
  // Whether we are saving or not
  const [isSaving, setSaving] = useState(false);
  // Store the alt text modofied by the input text
  const [altText, setAltText] = useState(altTextParam ?? '');
  // Store the legend text modofied by the input text
  const [legend, setLegend] = useState(legendParam ?? '');
  // Whether the image has been edited or the text has been changed
  const [dirty, setDirty] = useState<boolean>(false);
  // Load Image Editor action
  const {
    toBlob,
    setApplication,
    startBlur,
    stopBlur,
    restore,
    rotate,
    startCrop,
    stopCrop,
    startResize,
    stopResize,
    historyCount,
    loading,
  } = useImageEditor({
    imageSrc,
  });
  // A function to remove all opened controllers and backup changes if needed
  const stopAll = () => {
    stopBlur();
    stopCrop(currentOperation === 'CROP');
    stopResize(currentOperation === 'RESIZE');
  };
  // A handle to save edited image as Blob
  const handleSave = async () => {
    try {
      setSaving(true);
      stopAll();
      const blob = await toBlob();
      if (blob) {
        await onSave({ blob, legend, altText });
      }
    } catch (e) {
      onError?.(`${e}`);
    } finally {
      setSaving(false);
    }
  };
  // A handle to cancel without saving
  const handleCancel = () => {
    onCancel();
  };
  // A handle to trigger actions on toolbar action
  const handleOperation = async (operation: ImageEditorAction) => {
    // Stop Remove all previous graphical controllers
    stopAll();
    // Save the current operation
    setCurrentOperation(operation);
    // Update the dirty state because image is going to change
    setDirty(true);
    // Call action according to the selected operation
    switch (operation) {
      case 'ROTATE': {
        await rotate();
        break;
      }
      case 'UNDO': {
        await restore();
        break;
      }
      case 'CROP': {
        startCrop();
        break;
      }
      case 'RESIZE': {
        await startResize();
        break;
      }
      case 'BLUR': {
        await startBlur();
        break;
      }
    }
  };
  return (
    <Modal
      id="image-editor"
      isOpen={isOpen}
      onModalClose={handleCancel}
      size="lg"
    >
      <Modal.Header onModalClose={handleCancel}>
        <span className="h2">{t('imageeditor.title')}</span>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center">
        <div className="d-flex flex-column gap-12 w-100 flex-grow-1">
          <ImageEditorToolbar
            handle={handleOperation}
            historyCount={historyCount}
          />
          <div className="position-relative d-flex flex-column align-items-center justify-content-center flex-grow-1 w-100 image-editor">
            <Stage
              onMount={(app) => setApplication(app)}
              options={{
                preserveDrawingBuffer: true,
                backgroundAlpha: 0,
                resolution: 1,
              }}
            ></Stage>
            {!!loading && (
              <div className="position-absolute top-0 start-0 bottom-0 end-0 m-10 d-flex align-items-center justify-content-center bg-black opacity-25">
                <LoadingScreen />
              </div>
            )}
          </div>
          <div className="d-flex flex-column flex-md-row m-10 gap-12 w-100">
            <FormControl id="alt" className="flex-grow-1">
              <Label>{t('alttext')}</Label>
              <Input
                value={altText}
                onChange={(e) => {
                  setDirty(true);
                  setAltText(e.target.value);
                }}
                placeholder={t('alttext.help')}
                size="md"
                type="text"
              />
            </FormControl>
            <FormControl id="legend" className="flex-grow-1">
              <Label>{t('legend')}</Label>
              <Input
                value={legend}
                onChange={(e) => {
                  setDirty(true);
                  setLegend(e.target.value);
                }}
                placeholder={t('legend.help')}
                size="md"
                type="text"
              />
            </FormControl>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="tertiary"
          onClick={handleCancel}
          type="button"
          variant="ghost"
        >
          {t('imageeditor.cancel')}
        </Button>
        <Button
          color="primary"
          onClick={handleSave}
          type="button"
          variant="filled"
          isLoading={isSaving}
          disabled={isSaving || !dirty}
        >
          {t('imageeditor.save')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageEditor;
