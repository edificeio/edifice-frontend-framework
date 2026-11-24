import { Masonry } from '../../../../components';
import { Agenda } from '../Agenda';
import BriefMe from '../BriefMe/BriefMe';
import Cantine from '../Cantine/Cantine';
import { Favorites } from '../Favorites';
import { LastInfosList } from '../LastInfos/LastInfosList';
import { Rss } from '../Rss';
import SchoolSpace from '../SchoolSpace/SchoolSpace';
import { Tools } from '../Tools';
import UserSpace from '../UserSpace/UserSpace';

const noop = () => {};

export interface HomepageSkeletonProps {
  /** Number of columns of the widgets area, as on the real homepage. */
  columns: number;
}

/**
 * Fixed widgets shown while the user's actual widgets are unknown: the list
 * depends on the session, so it cannot be guessed before it is loaded.
 */
export function WidgetsSkeleton({ columns }: HomepageSkeletonProps) {
  return (
    <Masonry columns={columns} gap="16">
      <Masonry.Item>
        <Agenda events={[]} isLoading />
      </Masonry.Item>
      <Masonry.Item>
        <BriefMe
          status="loading"
          category=""
          articles={[]}
          handleActionClick={noop}
          onCategoryChange={noop}
          isLoading
        />
      </Masonry.Item>
      <Masonry.Item>
        <Rss
          feeds={[]}
          selectedIndex={0}
          onSelectFeed={noop}
          articles={[]}
          articlesStatus="loading"
          onEditClick={noop}
          isLoading
        />
      </Masonry.Item>
      <Masonry.Item>
        <Cantine
          status="loading"
          sections={[]}
          handleFullScreenClick={noop}
          isLoading
        />
      </Masonry.Item>
    </Masonry>
  );
}

WidgetsSkeleton.displayName = 'WidgetsSkeleton';

/** Left sidebar of the homepage while the client is not initialized. */
export function HomepageSidebarSkeleton() {
  return (
    <div className="d-flex flex-column py-16 gap-16">
      <SchoolSpace selectedSchool={undefined} isLoading />
      <LastInfosList infos={[]} isLoading />
    </div>
  );
}

HomepageSidebarSkeleton.displayName = 'HomepageSidebarSkeleton';

/** Main column of the homepage while the client is not initialized. */
export function HomepageContentSkeleton({ columns }: HomepageSkeletonProps) {
  return (
    <div className="d-flex flex-column py-16 gap-16">
      {/* The customize callback only makes the skeleton show its button */}
      <UserSpace
        name=""
        avatar=""
        profile="Personnel"
        onCustomizeWidgetsClick={noop}
        isLoading
      >
        <div
          className="d-grid gap-16"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          <Favorites apps={[]} isLoading />
          <Tools isLoading />
        </div>
      </UserSpace>
      <WidgetsSkeleton columns={columns} />
    </div>
  );
}

HomepageContentSkeleton.displayName = 'HomepageContentSkeleton';
