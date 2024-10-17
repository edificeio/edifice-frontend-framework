import VideoEmbed from '../../VideoEmbed/VideoEmbed';
import { useMediaLibraryContext } from '../MediaLibraryContext';

export const VideoEmbedder = () => {
  const { setResult } = useMediaLibraryContext();

  const handleOnSuccess = (ressource?: string) => {
    setResult(ressource);
  };

  return <VideoEmbed onSuccess={handleOnSuccess}></VideoEmbed>;
};
