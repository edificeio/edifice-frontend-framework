export const getBestSupportedMimeType = (): string => {
  if (MediaRecorder.isTypeSupported) {
    // SAFARI TEST
    return (
      [
        'video/webm;codecs=vp9',
        'video/mp4; codecs="avc1.424028, mp4a.40.2"',
        'video/webm;codecs=vp8,opus',
        'video/webm',
      ].find((type) => {
        if (!MediaRecorder.isTypeSupported(type)) {
          console.error(`${type} is not Supported`);
          return false;
        }
        return true;
      }) || 'video/ogg'
    );
  } else {
    return 'video/webm;codecs=vp8,opus';
  }
};
