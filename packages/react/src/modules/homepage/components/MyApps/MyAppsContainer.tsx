import { MyAppsList } from './MyAppsList';
import { useMyApps } from './useMyApps';

export function MyAppsContainer() {
  const { apps, error } = useMyApps();

  return error ? error.message : apps ? <MyAppsList apps={apps} /> : null;
}

MyAppsContainer.displayName = 'MyAppsContainer';
