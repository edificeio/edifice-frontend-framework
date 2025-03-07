// one imports
import illuOneBlog from '@edifice.io/bootstrap/dist/images/one/illu-empty-search-blog.svg';
import illuOneCollaborativeWall from '@edifice.io/bootstrap/dist/images/one/illu-empty-search-collaborativewall.svg';
import illuOneCommunity from '@edifice.io/bootstrap/dist/images/one/illu-empty-search-community.svg';
import illuOneExercizer from '@edifice.io/bootstrap/dist/images/one/illu-empty-search-exercizer.svg';
import illuOneFormulaire from '@edifice.io/bootstrap/dist/images/one/illu-empty-search-formulaire.svg';
import illuOneForum from '@edifice.io/bootstrap/dist/images/one/illu-empty-search-forum.svg';
import illuOneHomeworks from '@edifice.io/bootstrap/dist/images/one/illu-empty-search-homeworks.svg';
import illuOneMagneto from '@edifice.io/bootstrap/dist/images/one/illu-empty-search-magneto.svg';
import illuOneWiki from '@edifice.io/bootstrap/dist/images/one/illu-empty-search-wiki.svg';
import illuOneEmpty from '@edifice.io/bootstrap/dist/images/one/illu-empty-search.svg';

// neo imports
import illuNeoBlog from '@edifice.io/bootstrap/dist/images/neo/illu-empty-search-blog.svg';
import illuNeoCollaborativeWall from '@edifice.io/bootstrap/dist/images/neo/illu-empty-search-collaborativewall.svg';
import illuNeoCommunity from '@edifice.io/bootstrap/dist/images/neo/illu-empty-search-community.svg';
import illuNeoExercizer from '@edifice.io/bootstrap/dist/images/neo/illu-empty-search-exercizer.svg';
import illuNeoFormulaire from '@edifice.io/bootstrap/dist/images/neo/illu-empty-search-formulaire.svg';
import illuNeoForum from '@edifice.io/bootstrap/dist/images/neo/illu-empty-search-forum.svg';
import illuNeoHomeworks from '@edifice.io/bootstrap/dist/images/neo/illu-empty-search-homeworks.svg';
import illuNeoMagneto from '@edifice.io/bootstrap/dist/images/neo/illu-empty-search-magneto.svg';
import illuNeoWiki from '@edifice.io/bootstrap/dist/images/neo/illu-empty-search-wiki.svg';
import illuNeoEmpty from '@edifice.io/bootstrap/dist/images/neo/illu-empty-search.svg';

export type AppKeys =
  | 'blog'
  | 'wiki'
  | 'empty'
  | 'collaborative-wall'
  | 'community'
  | 'exercizer'
  | 'formulaire'
  | 'forum'
  | 'homeworks'
  | 'magneto';

export interface ThemeMapping {
  one: Record<AppKeys, string>;
  neo: Record<AppKeys, string>;
}

export const emptyScreenMapping: ThemeMapping = {
  one: {
    'blog': illuOneBlog,
    'wiki': illuOneWiki,
    'empty': illuOneEmpty,
    'collaborative-wall': illuOneCollaborativeWall,
    'community': illuOneCommunity,
    'exercizer': illuOneExercizer,
    'formulaire': illuOneFormulaire,
    'forum': illuOneForum,
    'homeworks': illuOneHomeworks,
    'magneto': illuOneMagneto,
  },
  neo: {
    'blog': illuNeoBlog,
    'wiki': illuNeoWiki,
    'empty': illuNeoEmpty,
    'collaborative-wall': illuNeoCollaborativeWall,
    'community': illuNeoCommunity,
    'exercizer': illuNeoExercizer,
    'formulaire': illuNeoFormulaire,
    'forum': illuNeoForum,
    'homeworks': illuNeoHomeworks,
    'magneto': illuNeoMagneto,
  },
};
