import {
  AbstractBehaviourService,
  ILinkedResource,
} from './AbstractBehaviourService';

type MongoDate = {
  $date: number;
};
type PostData = {
  _id: string;
  created: MongoDate;
  modified: MongoDate;
  firstPublishDate: MongoDate;
  title: string;
};
type BlogData = {
  _id: string;
  thumbnail: string;
  created: MongoDate;
  title: string;
  visibility: 'PUBLIC' | 'OWNER';
  modified: MongoDate;
  author: { userId: string; username: string };
  trashed?: boolean;
  shared?: any;
  fetchPosts: Array<PostData>;
};

export class BlogBehaviour extends AbstractBehaviourService {
  APP = 'blog';
  RESOURCE = 'blog';

  loadResources() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<ILinkedResource[]>(async (resolve, reject) => {
      try {
        const datas = await this.httpGet<BlogData[]>('/blog/linker');
        const resources: ILinkedResource[] = [];
        datas.forEach((data) => {
          if (data.thumbnail) {
            data.thumbnail = data.thumbnail + '?thumbnail=48x48';
          } else {
            data.thumbnail = '/img/illustrations/blog.svg';
          }

          const addedPosts = data.fetchPosts.map((post) => {
            return this.dataToResource({
              owner: data.author.userId,
              ownerName: data.author.username,
              title: post.title + ' [' + data.title + ']',
              _id: `${data._id}#${post._id}`,
              icon: data.thumbnail,
              path: `/blog/id/${data._id}/post/${post._id}`,
              shared: data.shared && data.shared.length >= 0 ? true : false,
              modified: data.modified,
            });
          });
          resources.push(...addedPosts);
        });
        resolve(resources);
      } catch (error) {
        reject(error);
      }
    });
  }
}
