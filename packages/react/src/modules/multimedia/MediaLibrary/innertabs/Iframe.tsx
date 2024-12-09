import { Embed } from '../../Embed';
import { useMediaLibraryContext } from '../MediaLibraryContext';

export const Iframe = () => {
  const { setResult } = useMediaLibraryContext();

  const handleOnSuccess = (ressource?: string) => {
    ressource = ressource?.replace(/<p /g, '<div ').replace(/\/p>/g, '/div>');
    setResult(ressource);
  };

  return <Embed onSuccess={handleOnSuccess} />;
};
