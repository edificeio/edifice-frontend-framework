import { useEffect, useState } from 'react';

import { IResource } from '@edifice.io/client';

interface UseThumbProps {
  isUpdating: boolean;
  selectedResource?: IResource;
}

export const useThumb = ({ isUpdating, selectedResource }: UseThumbProps) => {
  const [thumbnail, setThumbnail] = useState<string | Blob | File>(
    isUpdating ? selectedResource?.thumbnail || '' : '',
  );

  useEffect(() => {
    setThumbnail(selectedResource?.thumbnail || '');
  }, [selectedResource]);

  const handleUploadImage = (file: File | string) => setThumbnail(file);
  const handleDeleteImage = () => setThumbnail('');

  return {
    thumbnail,
    handleDeleteImage,
    handleUploadImage,
  };
};
