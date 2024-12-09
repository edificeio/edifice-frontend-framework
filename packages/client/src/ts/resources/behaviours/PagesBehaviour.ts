import {
  AbstractBehaviourService,
  ILinkedResource,
} from './AbstractBehaviourService';

type PagesData = {
  _id: string;
  title: string;
  thumbnail?: string;
  pages?: Array<{
    title: string;
    titleLink: string;
    //    href: string;
    //    rows: [];
    published: boolean;
    owner: string;
  }>;
  owner: {
    userId: string;
    displayName: string;
  };
  created: {
    $date: number;
  };
  modified: {
    $date: number;
  };
  icon: string;
  description: string;
  landingPage: string;
  shared?: [];
};

export class PagesBehaviour extends AbstractBehaviourService {
  APP = 'pages';
  RESOURCE = 'pages';

  async loadResources() {
    const websites = await this.httpGet<PagesData[]>('/pages/list/all');
    const pages: Array<ILinkedResource> = [];
    websites.forEach((website) => {
      const icon = website.thumbnail
        ? website.thumbnail + '?thumbnail=48x48'
        : '/img/illustrations/pages.svg';

      pages.push(
        this.dataToResource({
          title: website.title,
          owner: website.owner.userId,
          ownerName: website.owner.displayName,
          icon: icon,
          path: '/pages#/website/' + website._id,
          _id: website._id,
          shared: typeof website.shared !== 'undefined',
          modified: website.modified,
        }),
      );

      website.pages?.forEach((page) => {
        pages.push(
          this.dataToResource({
            title: page.title,
            owner: website.owner.userId,
            ownerName: website.owner.displayName,
            icon: icon,
            path: '/pages#/website/' + website._id + '/' + page.titleLink,
            _id: website._id + '/' + page.titleLink,
            shared: typeof website.shared !== 'undefined',
            modified: website.modified,
          }),
        );
      });
    });
    return pages;
  }
}
