import Qwant from './Qwant';

export const QWANT_URL = 'https://www.qwant.com';

export function QwantContainer() {
  const handleActionClick = (): void => {
    window.open(QWANT_URL, '_blank', 'noopener,noreferrer');
  };

  const handleSearch = (query: string): void => {
    const params = new URLSearchParams({ q: query, l: 'fr' });
    window.open(
      `${QWANT_URL}/?${params.toString()}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <Qwant handleActionClick={handleActionClick} handleSearch={handleSearch} />
  );
}
