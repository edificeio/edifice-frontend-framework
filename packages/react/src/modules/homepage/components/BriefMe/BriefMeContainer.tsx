import BriefMe from './BriefMe';
import { BriefMeCategory, useBriefMe } from './useBriefMe';

export function BriefMeContainer() {
  const { category, setCategory, articles, status } = useBriefMe();

  const handleActionClick = (): void => {
    window.open('https://brief.me', '_blank', 'noopener,noreferrer');
  };

  return (
    <BriefMe
      handleActionClick={handleActionClick}
      status={status}
      category={category}
      onCategoryChange={(value) => setCategory(value as BriefMeCategory)}
      articles={articles}
    />
  );
}

BriefMeContainer.displayName = 'BriefMeContainer';
