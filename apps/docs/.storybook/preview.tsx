import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";
import { initialize, mswLoader } from "msw-storybook-addon";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { OdeClientProvider } from "../../../packages/react/ui/src/core/OdeClientProvider";

import "../../../packages/bootstrap/dist/index.css";

import i18n from "../src/i18n";

// Initialize MSW
initialize({
  onUnhandledRequest: "bypass",
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const preview = {
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      name: "theme",
      description: "Select theming",
      defaultValue: "one",
      toolbar: {
        icon: "switchalt",
        items: ["one", "neo", "side-by-side"],
      },
    },
    app: {
      defaultValue: "wiki",
    },
  },
  parameters: {
    viewMode: "docs",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "Introduction",
          ["Welcome", "*"],
          "Design Tokens",
          "Icons",
          "Components",
          "Modules",
          ["Base", "*"],
          "Layouts",
        ],
      },
    },
    msw: {
      handlers: {
        config: [
          http.get("/blog/conf/public", () => {
            return HttpResponse.json({
              ID_SERVICE: {
                default: 2,
              },
              LIBELLE_SERVICE: {
                default: "PRODUCTION_COLLABORATIVE",
              },
            });
          }),
          http.get(`/wiki/conf/public`, () => {
            return HttpResponse.json({
              ID_SERVICE: {
                default: 2,
              },
              LIBELLE_SERVICE: {
                default: "PRODUCTION_COLLABORATIVE",
              },
            });
          }),
        ],
        userbook: [
          http.get("/userbook/preference/rgpdCookies", () => {
            return HttpResponse.json({ preference: '{"showInfoTip":false}' });
          }),
          http.get("/userbook/api/person", () => {
            return HttpResponse.json({
              status: "ok",
              result: [
                {
                  id: "f6c5ea40",
                  login: "user.name",
                  displayName: "user.name",
                  type: ["Teacher"],
                  visibleInfos: [],
                  schools: [
                    {
                      exports: null,
                      classes: [],
                      name: "School",
                      id: "bfaac2c1",
                      UAI: null,
                    },
                  ],
                  relatedName: null,
                  relatedId: null,
                  relatedType: null,
                  userId: "f6c5ea40",
                  motto: "",
                  photo: "/userbook/avatar/f6c5ea40",
                  mood: "default",
                  health: "",
                  address: "",
                  email: "",
                  tel: null,
                  mobile: "",
                  birthdate: "2023-09-25",
                  hobbies: [],
                },
              ],
            });
          }),
          http.get("/userbook/preference/language", () => {
            return HttpResponse.json({
              preference: { "default-domaine": "en" },
            });
          }),
          http.get("/userbook/preference/apps", () => {
            return HttpResponse.json({
              preference: '{"bookmarks":[],"applications":["Blog"]}',
            });
          }),
        ],
        theme: [
          http.get("/theme", () => {
            return HttpResponse.json({
              template: "/public/template/portal.html",
              logoutCallback: "",
              skin: "/assets/themes/cg77/skins/default/",
              themeName: "cg77",
              skinName: "default",
            });
          }),
          http.get("/assets/theme-conf.js", () => {
            return HttpResponse.json({
              overriding: [
                {
                  parent: "theme-open-ent",
                  child: "cg77",
                  skins: ["default", "dyslexic"],
                  help: "/help-2d",
                  bootstrapVersion: "ode-bootstrap-one",
                  edumedia: {
                    uri: "https://www.edumedia-sciences.com",
                    pattern: "uai-token-hash-[[uai]]",
                    ignoreSubjects: ["n-92", "n-93"],
                  },
                },
                {
                  parent: "panda",
                  child: "cg771d",
                  skins: [
                    "circus",
                    "desert",
                    "neutre",
                    "ocean",
                    "panda-food",
                    "sparkly",
                    "default",
                    "monthly",
                  ],
                  help: "/help-1d",
                  bootstrapVersion: "ode-bootstrap-one",
                  edumedia: {
                    uri: "https://junior.edumedia-sciences.com",
                    pattern: "uai-token-hash-[[uai]]",
                  },
                },
              ],
            });
          }),
        ],
        directory: [
          http.get("/directory/userbook/f6c5ea40", () => {
            return HttpResponse.json({
              mood: "default",
              health: "",
              alertSize: false,
              storage: 27683216,
              type: "USERBOOK",
              userid: "f6c5ea40",
              picture: "/userbook/avatar/f6c5ea40",
              quota: 104857600,
              motto: "",
              theme: "default",
              hobbies: [],
            });
          }),
        ],
        workspace: [
          http.get("/workspace/quota/user/f6c5ea40", () => {
            return HttpResponse.json({ quota: 104857600, storage: 27683216 });
          }),
        ],
        default: [
          http.get("/resources-applications", () => {
            return HttpResponse.json(["blog", "wiki"]);
          }),

          http.get("/locale", () => {
            return HttpResponse.json({ locale: "en" });
          }),

          http.get("/auth/oauth2/userinfo", () => {
            return HttpResponse.json({
              classNames: null,
              level: "",
              login: "user.admc",
              lastName: "admc",
              firstName: "user",
              externalId: "e4cc33f4-0ad0-444f-8bee-bad0b11c4c9a",
              federated: null,
              birthDate: "2023-09-25",
              forceChangePassword: null,
              needRevalidateTerms: false,
              deletePending: false,
              username: "user.name",
              type: "PERSEDUCNAT",
              hasPw: true,
              functions: {
                SUPER_ADMIN: {
                  code: "SUPER_ADMIN",
                  scope: null,
                },
              },
              groupsIds: ["326573-1707401228471", "326427-1690981921280"],
              federatedIDP: null,
              optionEnabled: [],
              userId: "f6c5ea40",
              structures: ["bfaac2c1"],
              structureNames: ["School"],
              uai: [],
              hasApp: false,
              ignoreMFA: true,
              classes: [],
              authorizedActions: [
                {
                  name: "org.entcore.blog.controllers.FoldersController|add",
                  displayName: "blog.createFolder",
                  type: "SECURED_ACTION_WORKFLOW",
                },
                {
                  name: "org.entcore.blog.controllers.FoldersController|list",
                  displayName: "blog.listFolders",
                  type: "SECURED_ACTION_WORKFLOW",
                },
                {
                  name: "org.entcore.blog.controllers.BlogController|print",
                  displayName: "blog.print",
                  type: "SECURED_ACTION_WORKFLOW",
                },
                {
                  name: "org.entcore.blog.controllers.BlogController|blog",
                  displayName: "blog.view",
                  type: "SECURED_ACTION_WORKFLOW",
                },
                {
                  name: "org.entcore.blog.controllers.FoldersControllerProxy|list",
                  displayName: "blog.listFolders",
                  type: "SECURED_ACTION_WORKFLOW",
                },
                {
                  name: "org.entcore.blog.controllers.BlogController|list",
                  displayName: "blog.list",
                  type: "SECURED_ACTION_WORKFLOW",
                },
                {
                  name: "org.entcore.blog.controllers.FoldersControllerProxy|add",
                  displayName: "blog.createFolder",
                  type: "SECURED_ACTION_WORKFLOW",
                },
                {
                  name: "org.entcore.workspace.controllers.WorkspaceController|listDocuments",
                  displayName: "workspace.documents.list",
                  type: "SECURED_ACTION_WORKFLOW",
                },
                {
                  name: "org.entcore.workspace.controllers.WorkspaceController|listFolders",
                  displayName: "workspace.document.list.folders",
                  type: "SECURED_ACTION_WORKFLOW",
                },
              ],
              apps: [
                {
                  name: "Blog",
                  address: "/blog",
                  icon: "blog-large",
                  target: "",
                  displayName: "blog",
                  display: true,
                  prefix: "/blog",
                  casType: null,
                  scope: [""],
                  isExternal: false,
                },
                {
                  name: "Wiki",
                  address: "/wiki",
                  icon: "wiki-large",
                  target: "",
                  displayName: "wiki",
                  display: true,
                  prefix: "/wiki",
                  casType: null,
                  scope: [""],
                  isExternal: false,
                },
              ],
              childrenIds: [],
              children: {},
              widgets: [],
              sessionMetadata: {},
            });
          }),
          http.get("/applications-list", () => {
            return HttpResponse.json({
              apps: [
                {
                  name: "Blog",
                  address: "/blog",
                  icon: "blog-large",
                  target: "",
                  displayName: "blog",
                  display: true,
                  prefix: "/blog",
                  casType: null,
                  scope: [""],
                  isExternal: false,
                },
                {
                  name: "Wiki",
                  address: "/wiki",
                  icon: "wiki-large",
                  target: "",
                  displayName: "wiki",
                  display: true,
                  prefix: "/wiki",
                  casType: null,
                  scope: [""],
                  isExternal: false,
                },
              ],
            });
          }),
        ],
      },
    },
  },
  // Provide the MSW addon loader globally
  loaders: [mswLoader],
  decorators: [
    (Story, context) => {
      /**
       * App value default to "one"
       */
      const theme = context.globals.theme;
      /**
       * App value default to "blog"
       */
      const app = context.globals.app;

      const StoryTheme = ({ themePath }: { themePath: string }) => {
        return (
          <div data-product={themePath} className="my-12">
            <Story />
          </div>
        );
      };

      const renderStoryTheme = () => {
        switch (theme) {
          case "side-by-side": {
            return (
              <>
                <StoryTheme themePath="one" />
                <StoryTheme themePath="neo" />
              </>
            );
          }
          case "one": {
            return <StoryTheme themePath="one" />;
          }
          case "neo": {
            return <StoryTheme themePath="neo" />;
          }
          case "default": {
            return <StoryTheme themePath={theme} />;
          }
        }
      };

      return (
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <OdeClientProvider
              params={{
                app,
              }}
            >
              <ThemeProvider defaultTheme={theme}>
                {renderStoryTheme()}
              </ThemeProvider>
            </OdeClientProvider>
          </I18nextProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;
