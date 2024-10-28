import i18n from "i18next";
import Backend from "i18next-http-backend";

i18n
  .use(Backend) // lazy loads translations from /public/locales
  .init({
    backend: {
      parse: function (data: string) {
        return JSON.parse(data);
      },
    },
    resources: {
      en: {
        translation: {
          "comment.author.avatar": "Author avatar",
          "comment.publish.date": "Published [[date]]",
          "comment.update.date": "Modified [[date]]",
          "comment.placeholder": "Your comment",
          "comment.post": "Send",
          "comment.several": "[[number]] comments",
          "comment.little": "[[number]] comment",
          "comment.placeholder.textarea": "Your comment here",
          "comment.cancel": "Cancel",
          "comment.remove": "Delete",
          "comment.edit": "Update",
          "comment.save": "Save",
          "comment.more": "Read more",
          "comment.emptyscreen": "No comments yet, be the first to comment",
          "Personnel": "Guest",
          "Relative": "Relative",
          "Student": "Student",
          "Teacher": "Teacher",
          "blog": "Blog",
          "wiki": "Wiki",
          "bbm.linker.int.choose": "Choose an application",
          "search": "Search",
          "bbm.linker.int.no.results": "No results found",
          "bbm.linker.int.empty":
            "Select, at the top left, the application in which the resource you want to add is located!",
          "bbm.linker.int.notfound":
            "The resource you are looking for does not exist.",
        },
      },
    },
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
      prefix: "[[",
      suffix: "]]",
    },
  });

export default i18n;
