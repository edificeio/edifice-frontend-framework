import { useBookmark } from '../../../../hooks/useBookmark';
import { FavoritesWidget, type FavoritesWidgetProps } from './FavoritesWidget';

type FavoritesWidgetContainerProps = Omit<FavoritesWidgetProps, 'apps'>;

export function FavoritesWidgetContainer(props: FavoritesWidgetContainerProps) {
  const apps = useBookmark() ?? [];
  return <FavoritesWidget {...props} apps={apps} />;
}
