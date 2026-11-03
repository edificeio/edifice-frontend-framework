import Mediacentre from './Mediacentre';
import { useMediacentre } from './hooks/useMediacentre';

export function MediacentreContainer() {
  const mediacentre = useMediacentre();

  const handleActionClick = (): void => {
    window.open('/mediacentre', '_self');
  };

  return <Mediacentre handleActionClick={handleActionClick} {...mediacentre} />;
}

MediacentreContainer.displayName = 'MediacentreContainer';
