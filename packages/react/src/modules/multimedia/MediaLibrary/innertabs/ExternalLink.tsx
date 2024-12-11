import {
  ExternalLinker,
  IExternalLink,
} from '../../Linker/ExternalLinker/ExternalLinker';
import { useMediaLibraryContext } from '../MediaLibraryContext';

export type ExternalLinkTabProps = {
  multiNodeSelected?: boolean;
  link?: Partial<IExternalLink>;
};

export const ExternalLink = ({
  link,
  multiNodeSelected = false,
}: ExternalLinkTabProps) => {
  const { setResult } = useMediaLibraryContext();

  const handleLinkChange = (link?: IExternalLink) => {
    setResult(link);
  };

  return (
    <ExternalLinker
      link={link}
      onChange={handleLinkChange}
      multiNodeSelected={multiNodeSelected}
    />
  );
};
