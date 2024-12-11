import VideoEmbed from '../../VideoEmbed/VideoEmbed';
import { useMediaLibraryContext } from '../MediaLibraryContext';

export const VideoEmbedder = () => {
  const { switchType, setResult } = useMediaLibraryContext();

  const handleOnSuccess = (ressource?: string) => {
    setResult(ressource);
  };

  return <VideoEmbed switchType={switchType} onSuccess={handleOnSuccess} />;
};
