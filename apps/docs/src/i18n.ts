// src/i18n.js

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend) // lazy loads translations from /public/locales
  .use(LanguageDetector) // detect user language
  .init({
    backend: {
      parse: function (data: string) {
        return JSON.parse(data);
      },
    },
    resources: {
      en: {
        translation: {
          'comment.author.avatar': 'Author avatar',
          'comment.publish.date': 'Published [[date]]',
          'comment.update.date': 'Modified [[date]]',
          'comment.placeholder': 'Your comment',
          'comment.post': 'Send',
          'comment.several': '[[number]] comments',
          'comment.little': '[[number]] comment',
          'comment.placeholder.textarea': 'Your comment here',
          'comment.cancel': 'Cancel',
          'comment.remove': 'Delete',
          'comment.edit': 'Update',
          'comment.save': 'Save',
          'comment.reply': 'Reply',
          'comment.more': 'Read more',
          'comment.more.replies': 'Read more replies',
          'comment.emptyscreen': 'No comments yet, be the first to comment',
          'Personnel': 'Guest',
          'Relative': 'Relative',
          'Student': 'Student',
          'Teacher': 'Teacher',
          'blog': 'Blog',
        },
      },
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
      prefix: '[[',
      suffix: ']]',
    },
  });

export default i18n;
