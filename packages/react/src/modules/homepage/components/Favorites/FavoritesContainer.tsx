import { useBookmark } from '../../../../hooks';
import { Favorites, type FavoritesProps } from './Favorites';

type FavoritesContainerProps = Omit<FavoritesProps, 'apps'>;

export function FavoritesContainer(props: FavoritesContainerProps) {
  const apps = useBookmark() ?? [];
  return <Favorites {...props} apps={apps} />;
}
