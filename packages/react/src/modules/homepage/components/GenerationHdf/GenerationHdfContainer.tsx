import GenerationHdf from './GenerationHdf';
import { useGenerationHdf } from './useGenerationHdf';

export function GenerationHdfContainer() {
  const generationHdf = useGenerationHdf();

  const handleActionClick = (): void => {
    window.open(
      'https://generation.hautsdefrance.fr',
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <GenerationHdf handleActionClick={handleActionClick} {...generationHdf} />
  );
}

GenerationHdfContainer.displayName = 'GenerationHdfContainer';
