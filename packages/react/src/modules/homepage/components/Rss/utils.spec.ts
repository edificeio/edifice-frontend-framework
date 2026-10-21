import { htmlToText, isValidRssFeedUrl } from './utils';

describe('isValidRssFeedUrl', () => {
  it.each([
    'https://www.lemonde.fr/rss/une.xml',
    'http://example.com/feed.rss',
    'https://example.com/feed.atom',
    'https://example.com/feed.rdf',
    'https://example.com/news.feed',
    'https://feeds.leparisien.fr/leparisien/rss',
    'https://example.com',
    '  https://example.com/rss.xml  ',
  ])('accepts %s', (url) => {
    expect(isValidRssFeedUrl(url)).toBe(true);
  });

  it.each([
    'example.com/rss.xml',
    'ftp://example.com/rss.xml',
    'https://example.com/page.html',
    'https://example.com/image.png',
    '',
  ])('rejects %s', (url) => {
    expect(isValidRssFeedUrl(url)).toBe(false);
  });
});

describe('htmlToText', () => {
  it('keeps only the text of an HTML description', () => {
    expect(htmlToText('<p>Un <strong>extrait</strong></p><img src="x">')).toBe(
      'Un extrait',
    );
  });
});
