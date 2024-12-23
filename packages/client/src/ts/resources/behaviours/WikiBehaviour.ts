import { AbstractBehaviourService } from './AbstractBehaviourService';

type WikiData = {
  _id: string;
  title: string;
  pages: Array<{
    _id: string;
    title: string;
    author: string;
    authorName: string;
    modified: {
      $date: number;
    };
    contentPlain: string;
  }>;
  owner: {
    userId: string;
    displayName: string;
  };
  modified: {
    $date: number;
  };
  thumbnail: string;
  shared: [];
};

export class WikiBehaviour extends AbstractBehaviourService {
  APP = 'wiki';
  RESOURCE = 'wiki';

  async loadResources() {
    const wikis = await this.httpGet<WikiData[]>(
      '/wiki/listallpages?visible=true',
    );
    return wikis
      .map((wiki) => {
        return wiki.pages.map((page) => {
          let wikiIcon;
          if (typeof wiki.thumbnail === 'undefined' || wiki.thumbnail === '') {
            wikiIcon = '/img/icons/glyphicons_036_file.png';
          } else {
            wikiIcon = wiki.thumbnail + '?thumbnail=48x48';
          }

          return this.dataToResource({
            title: page.title + ' [' + wiki.title + ']',
            ownerName: wiki.owner.displayName,
            owner: wiki.owner.userId,
            icon: wikiIcon,
            path: '/wiki#/view/' + wiki._id + '/' + page._id,
            _id: `${wiki._id}#${page._id}`,
            shared: typeof wiki.shared !== 'undefined',
            modified: page.modified,
          });
        });
      })
      .flat();
  }
}
