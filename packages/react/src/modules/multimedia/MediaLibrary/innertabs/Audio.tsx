import { useRef } from 'react';

import { WorkspaceElement } from '@edifice.io/client';

import { AudioRecorder } from '../../AudioRecorder';
import { AudioRecorderRef } from '../../AudioRecorder/AudioRecorder';
import { useMediaLibraryContext } from '../MediaLibraryContext';

export const Audio = () => {
  const { setResult, setPreSuccess, visibility } = useMediaLibraryContext();
  const ref = useRef<AudioRecorderRef>(null);

  const handleOnUpdateRecord = (recordURL?: string) => {
    if (recordURL) {
      setResult(recordURL);
      setPreSuccess(() => ref.current!.save);
    } else {
      setResult();
    }
  };

  const handleOnSaveSuccess = (audioRessource?: WorkspaceElement) => {
    if (audioRessource) {
      setResult(audioRessource);
    }
  };

  return (
    <AudioRecorder
      ref={ref}
      onRecordUpdated={handleOnUpdateRecord}
      onSaveSuccess={handleOnSaveSuccess}
      hideSaveAction={true}
      visibility={visibility}
    />
  );
};
