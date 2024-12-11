import { IWebApp } from '@edifice.io/client';
import { AppIcon } from '../../../components';

const BookmarkedApps = ({ data }: { data: IWebApp[] }) => {
  if (data.length > 0) {
    return data.slice(0, 6).map((app, index) => {
      return (
        <a key={index} href={app.address} className="bookmarked-app">
          <AppIcon app={app} size="32" />
        </a>
      );
    });
  }
  return (
    <div className="text-dark mx-auto">
      <a href="/welcome">Sélectionner vos applications favorites</a>
    </div>
  );
};

BookmarkedApps.displayName = 'BookmarkedApps';

export default BookmarkedApps;
