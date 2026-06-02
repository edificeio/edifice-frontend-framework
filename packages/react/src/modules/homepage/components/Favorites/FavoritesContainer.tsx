import { useBookmark } from '../../../../hooks/useBookmark';
import { Favorites, type FavoritesProps } from './Favorites';

type FavoritesContainerProps = Omit<FavoritesProps, 'apps'>;

export function FavoritesContainer(props: FavoritesContainerProps) {
  const apps = useBookmark() ?? [];
  return <Favorites {...props} apps={apps} />;
}
