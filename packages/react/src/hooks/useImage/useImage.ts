import { useCallback, useEffect, useState } from 'react';

interface useImageProps {
  src: string;
  placeholder: string;
}

export default function useImage({ src, placeholder }: useImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || placeholder);

  const onError = useCallback(() => {
    setImgSrc(placeholder);
  }, [placeholder]);

  // Force initial value imgSrc to src. If we use the value returned by useState it is wrong the second time the hook is called
  useEffect(() => {
    setImgSrc(src);
  }, [src]);
  return { imgSrc, onError };
}
