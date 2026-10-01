import Qwant from './Qwant';

export function QwantContainer() {
  const handleActionClick = (): void => {
    window.open('https://www.qwant.com', '_blank', 'noopener,noreferrer');
  };

  return <Qwant handleActionClick={handleActionClick} />;
}
