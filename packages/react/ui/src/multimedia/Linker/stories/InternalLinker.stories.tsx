import { Meta, StoryObj } from "@storybook/react";

import InternalLinker from "../components/InternalLinker";

import { http, HttpResponse } from "msw";

const meta: Meta<typeof InternalLinker> = {
  title: "Multimedia/InternalLinker",
  component: InternalLinker,
  args: {
    appCode: "wiki",
  },
  parameters: {
    docs: {
      description: {
        component:
          "`InternalLinker` component is used to link to internal resources.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof InternalLinker>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: Story = {
  render: (args: any) => {
    return <InternalLinker {...args} />;
  },
  parameters: {
    msw: {
      handlers: {
        wiki: http.get("/wiki/listallpages", () => {
          return HttpResponse.json([
            {
              _id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
              title: "Sample Wiki",
              pages: [
                {
                  _id: "b2c3d4e5-f6a7-8901-bcde-f1234567890a",
                  title: "Page One",
                  contentPlain: "Sample content",
                  author: "c3d4e5f6-a7b8-9012-cdef-1234567890ab",
                  authorName: "Jane Doe",
                  modified: {
                    $date: 1700000000000,
                  },
                  contentVersion: 1,
                  jsonContent: {
                    type: "doc",
                    content: [
                      {
                        type: "paragraph",
                        attrs: {
                          textAlign: "left",
                        },
                        content: [
                          {
                            type: "text",
                            text: "This is a sample paragraph.",
                          },
                        ],
                      },
                    ],
                  },
                  position: 0,
                  parentId: null,
                },
                {
                  _id: "d4e5f6a7-b8c9-0123-def0-4567890abc12",
                  title: "Video Page",
                  contentPlain: "",
                  author: "e5f6a7b8-c9d0-1234-ef01-67890abc1234",
                  authorName: "John Smith",
                  modified: {
                    $date: 1700000001000,
                  },
                  contentVersion: 1,
                  jsonContent: {
                    type: "doc",
                    content: [
                      {
                        type: "video",
                        attrs: {
                          textAlign: "left",
                          src: "/workspace/document/abcdef12-3456-7890-abcd-ef1234567890",
                          controls: "true",
                          documentId: "abcdef12-3456-7890-abcd-ef1234567890",
                          isCaptation: "true",
                          videoResolution: "350x197",
                          width: "350",
                          height: "197",
                        },
                      },
                    ],
                  },
                  position: 3,
                  parentId: null,
                },
                {
                  _id: "f6a7b8c9-d0e1-2345-f012-34567890abcd",
                  title: "Content Page",
                  contentPlain: "Sample plain text content.",
                  author: "g7h8i9j0-k1l2-3456-m789-0123456789ab",
                  authorName: "Alice Brown",
                  modified: {
                    $date: 1700000002000,
                  },
                  contentVersion: 1,
                  jsonContent: {
                    type: "doc",
                    content: [
                      {
                        type: "paragraph",
                        attrs: {
                          textAlign: "left",
                        },
                        content: [
                          {
                            type: "text",
                            text: "More sample text.",
                          },
                        ],
                      },
                      {
                        type: "heading",
                        attrs: {
                          textAlign: "left",
                          level: 2,
                        },
                        content: [
                          {
                            type: "text",
                            text: "Sample Heading",
                          },
                        ],
                      },
                      {
                        type: "paragraph",
                        attrs: {
                          textAlign: "left",
                        },
                        content: [
                          {
                            type: "text",
                            marks: [
                              {
                                type: "textStyle",
                                attrs: {
                                  color: null,
                                  fontSize: "18px",
                                  lineHeight: null,
                                  fontFamily: null,
                                },
                              },
                            ],
                            text: "Stylized text.",
                          },
                        ],
                      },
                      {
                        type: "paragraph",
                        attrs: {
                          textAlign: "left",
                        },
                        content: [
                          {
                            type: "text",
                            marks: [
                              {
                                type: "textStyle",
                                attrs: {
                                  color: null,
                                  fontSize: "16px",
                                  lineHeight: null,
                                  fontFamily: null,
                                },
                              },
                            ],
                            text: "More ",
                          },
                          {
                            type: "text",
                            marks: [
                              {
                                type: "textStyle",
                                attrs: {
                                  color: "#7C2C96",
                                  fontSize: "16px",
                                  lineHeight: null,
                                  fontFamily: null,
                                },
                              },
                            ],
                            text: "important text",
                          },
                        ],
                      },
                    ],
                  },
                  position: 4,
                  parentId: null,
                },
                {
                  _id: "h8i9j0k1-l2m3-4567-n890-1234567890ab",
                  title: "Create Page",
                  contentPlain: "123456",
                  author: "i9j0k1l2-m3n4-5678-o901-234567890abc",
                  authorName: "Bob Green",
                  modified: {
                    $date: 1700000003000,
                  },
                  lastContributer: "j0k1l2m3-n4o5-6789-p012-34567890abcd",
                  lastContributerName: "Carol White",
                  contentVersion: 1,
                  jsonContent: {
                    type: "doc",
                    content: [
                      {
                        type: "paragraph",
                        attrs: {
                          textAlign: "left",
                        },
                        content: [
                          {
                            type: "text",
                            text: "123456",
                          },
                        ],
                      },
                    ],
                  },
                  position: 1,
                  parentId: "b2c3d4e5-f6a7-8901-bcde-f1234567890a",
                },
                {
                  _id: "k1l2m3n4-o5p6-7890-q123-4567890abcde",
                  title: "New Wiki",
                  author: "l2m3n4o5-p6q7-8901-r234-567890abcdef",
                  authorName: "Dave Black",
                  modified: {
                    $date: 1700000004000,
                  },
                  created: {
                    $date: 1700000004000,
                  },
                  contentVersion: 1,
                  jsonContent: {
                    type: "doc",
                    content: [
                      {
                        type: "paragraph",
                        attrs: {
                          textAlign: "left",
                        },
                      },
                    ],
                  },
                  contentPlain: "",
                  position: 5,
                  parentId: null,
                },
                {
                  _id: "m3n4o5p6-q7r8-9012-s345-67890abcdefg",
                  title: "Test Page",
                  author: "n4o5p6q7-r8s9-0123-t456-7890abcdefg1",
                  authorName: "Eve Grey",
                  modified: {
                    $date: 1700000005000,
                  },
                  created: {
                    $date: 1700000005000,
                  },
                  contentVersion: 1,
                  jsonContent: {
                    type: "doc",
                    content: [
                      {
                        type: "paragraph",
                        attrs: {
                          textAlign: "left",
                        },
                        content: [
                          {
                            type: "text",
                            text: "Sample test content.",
                          },
                        ],
                      },
                    ],
                  },
                  contentPlain: "Sample test content.",
                  position: 6,
                  parentId: null,
                },
                {
                  _id: "o5p6q7r8-s9t0-1234-u567-890abcdefghi",
                  title: "Another Page",
                  author: "p6q7r8s9-t0u1-2345-v678-90abcdefghi2",
                  authorName: "Frank Yellow",
                  modified: {
                    $date: 1700000006000,
                  },
                  created: {
                    $date: 1700000006000,
                  },
                  contentVersion: 1,
                  jsonContent: {
                    type: "doc",
                    content: [
                      {
                        type: "paragraph",
                        attrs: {
                          textAlign: "left",
                        },
                      },
                    ],
                  },
                  contentPlain: "",
                  position: 7,
                  parentId: null,
                },
              ],
              thumbnail:
                "/workspace/document/abcdef12-3456-7890-abcd-ef1234567890",
              modified: {
                $date: 1700000007000,
              },
              owner: {
                userId: "q7r8s9t0-u1v2-3456-w789-0123456789ab",
                displayName: "George Blue",
              },
              shared: [
                {
                  "userId": "r8s9t0u1-v2w3-4567-x890-1234567890ab",
                  "net-atos-entng-wiki-controllers-WikiController|getPage":
                    true,
                  "net-atos-entng-wiki-controllers-WikiController|listPages":
                    true,
                  "net-atos-entng-wiki-controllers-WikiController|getWiki":
                    true,
                  "net-atos-entng-wiki-controllers-WikiController|comment":
                    true,
                },
                {
                  "userId": "s9t0u1v2-w3x4-5678-y901-234567890abc",
                  "net-atos-entng-wiki-controllers-WikiController|listRevisions":
                    true,
                  "net-atos-entng-wiki-controllers-WikiController|getPage":
                    true,
                  "net-atos-entng-wiki-controllers-WikiController|listPages":
                    true,
                  "net-atos-entng-wiki-controllers-WikiController|createPage":
                    true,
                  "net-atos-entng-wiki-controllers-WikiController|getWiki":
                    true,
                  "net-atos-entng-wiki-controllers-WikiController|updatePage":
                    true,
                  "net-atos-entng-wiki-controllers-WikiController|comment":
                    true,
                  "net-atos-entng-wiki-controllers-WikiController|getRevisionById":
                    true,
                  "net-atos-entng-wiki-controllers-WikiController|updatePageList":
                    true,
                },
              ],
              description: "This is a sample description.",
            },
          ]);
        }),
        blog: http.get("/blog/linker", () => {
          return HttpResponse.json([
            {
              "_id": "abcdef12-3456-7890-abcd-ef1234567890",
              "title": "Sample Title",
              "description": "This is a sample description.",
              "visibility": "PUBLIC",
              "thumbnail":
                "/workspace/pub/document/abcdef12-3456-7890-abcd-ef1234567890",
              "publish-type": "RESTRAINT",
              "comment-type": "IMMEDIATE",
              "created": {
                $date: 1700000000000,
              },
              "modified": {
                $date: 1700000000000,
              },
              "author": {
                userId: "12345678-90ab-cdef-1234-567890abcdef",
                username: "John Doe",
                login: "john.doe",
              },
              "shared": [
                {
                  "userId": "87654321-fedc-ba09-8765-4321fedcba09",
                  "org-entcore-blog-controllers-BlogController|removeShare":
                    true,
                  "org-entcore-blog-controllers-PostController|delete": true,
                  "org-entcore-blog-controllers-BlogController|update": true,
                  "org-entcore-blog-controllers-BlogController|delete": true,
                  "org-entcore-blog-controllers-PostController|submit": true,
                  "org-entcore-blog-controllers-PostController|comment": true,
                  "org-entcore-blog-controllers-PostController|updateComment":
                    true,
                  "org-entcore-blog-controllers-PostController|publish": true,
                  "org-entcore-blog-controllers-PostController|unpublish": true,
                  "org-entcore-blog-controllers-PostController|publishComment":
                    true,
                  "org-entcore-blog-controllers-BlogController|shareJson": true,
                  "org-entcore-blog-controllers-BlogController|updatePublicBlog":
                    true,
                  "org-entcore-blog-controllers-BlogController|shareJsonSubmit":
                    true,
                  "org-entcore-blog-controllers-PostController|comments": true,
                  "org-entcore-blog-controllers-PostController|deleteComment":
                    true,
                  "org-entcore-blog-controllers-PostController|create": true,
                  "org-entcore-blog-controllers-PostController|update": true,
                  "org-entcore-blog-controllers-PostController|list": true,
                  "org-entcore-blog-controllers-BlogController|get": true,
                  "org-entcore-blog-controllers-BlogController|shareResource":
                    true,
                  "org-entcore-blog-controllers-PostController|get": true,
                },
              ],
              "ingest_job_state": "OK",
              "version": 1700000000000,
              "slug": "sample-slug-title",
              "trashed": false,
              "fetchPosts": [
                {
                  _id: "11223344-5566-7788-99aa-bbccddeeff00",
                  title: "First Post",
                  created: {
                    $date: 1700000000000,
                  },
                  modified: {
                    $date: 1700000000000,
                  },
                  author: {
                    userId: "12345678-90ab-cdef-1234-567890abcdef",
                    username: "John Doe",
                    login: "john.doe",
                  },
                  state: "PUBLISHED",
                  views: 24,
                  contentVersion: 1,
                  jsonContent: {
                    type: "doc",
                    content: [
                      {
                        type: "paragraph",
                        attrs: {
                          textAlign: "left",
                        },
                        content: [
                          {
                            type: "linker",
                            attrs: {
                              "href":
                                "/wiki#/view/abcdef12-3456-7890-abcd-ef1234567890/sample-id",
                              "class": null,
                              "target": null,
                              "title": "Home [Community Wiki]",
                              "data-id":
                                "abcdef12-3456-7890-abcd-ef1234567890#sample-id",
                              "data-app-prefix": "wiki",
                            },
                            content: [
                              {
                                type: "text",
                                text: "Home [Community Wiki]",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  firstPublishDate: {
                    $date: 1700000000000,
                  },
                },
                {
                  _id: "22334455-6677-8899-aabb-ccddeeff0011",
                  title: "Second Post",
                  created: {
                    $date: 1700000000000,
                  },
                  modified: {
                    $date: 1700000000000,
                  },
                  author: {
                    userId: "12345678-90ab-cdef-1234-567890abcdef",
                    username: "John Doe",
                    login: "john.doe",
                  },
                  state: "PUBLISHED",
                  views: 14,
                  contentVersion: 1,
                  jsonContent: {
                    type: "doc",
                    content: [
                      {
                        type: "paragraph",
                        attrs: {
                          textAlign: "left",
                        },
                        content: [
                          {
                            type: "custom-image",
                            attrs: {
                              textAlign: "left",
                              src: "/workspace/document/abcdef12-3456-7890-abcd-ef1234567890?timestamp=1700000000000",
                              alt: "",
                              title: "",
                              size: "medium",
                              width: "350",
                              height: null,
                              style: null,
                            },
                          },
                          {
                            type: "custom-image",
                            attrs: {
                              textAlign: "left",
                              src: "/workspace/document/abcdef12-3456-7890-abcd-ef1234567890",
                              alt: null,
                              title: null,
                              size: "medium",
                              width: "350",
                              height: null,
                              style: null,
                            },
                          },
                          {
                            type: "custom-image",
                            attrs: {
                              textAlign: "left",
                              src: "/workspace/document/abcdef12-3456-7890-abcd-ef1234567890?timestamp=1700000000000",
                              alt: "",
                              title: "",
                              size: "medium",
                              width: "350",
                              height: null,
                              style: null,
                            },
                          },
                          {
                            type: "text",
                            text: "Sample Text",
                          },
                        ],
                      },
                      {
                        type: "paragraph",
                        attrs: {
                          textAlign: "left",
                        },
                      },
                      {
                        type: "paragraph",
                        attrs: {
                          textAlign: "left",
                        },
                        content: [
                          {
                            type: "custom-image",
                            attrs: {
                              textAlign: "left",
                              src: "/workspace/document/abcdef12-3456-7890-abcd-ef1234567890?timestamp=1700000000000",
                              alt: "",
                              title: "",
                              size: "medium",
                              width: "350",
                              height: null,
                              style: null,
                            },
                          },
                        ],
                      },
                    ],
                  },
                  firstPublishDate: {
                    $date: 1700000000000,
                  },
                },
                {
                  _id: "33445566-7788-99aa-bbcc-ddeeff001122",
                  title: "Third Post",
                  created: {
                    $date: 1700000000000,
                  },
                  modified: {
                    $date: 1700000000000,
                  },
                  author: {
                    userId: "12345678-90ab-cdef-1234-567890abcdef",
                    username: "John Doe",
                    login: "john.doe",
                  },
                  state: "PUBLISHED",
                  views: 4,
                  contentVersion: 1,
                  jsonContent: {
                    type: "doc",
                    content: [
                      {
                        type: "paragraph",
                        attrs: {
                          textAlign: "left",
                        },
                        content: [
                          {
                            type: "custom-image",
                            attrs: {
                              textAlign: "left",
                              src: "/workspace/document/abcdef12-3456-7890-abcd-ef1234567890?timestamp=1700000000000",
                              alt: "",
                              title: "",
                              size: "medium",
                              width: "350",
                              height: null,
                              style: null,
                            },
                          },
                        ],
                      },
                    ],
                  },
                  firstPublishDate: {
                    $date: 1700000000000,
                  },
                },
                {
                  _id: "44556677-8899-aabb-ccdd-eeff00112233",
                  title: "Fourth Post",
                  created: {
                    $date: 1700000000000,
                  },
                  modified: {
                    $date: 1700000000000,
                  },
                  author: {
                    userId: "12345678-90ab-cdef-1234-567890abcdef",
                    username: "John Doe",
                    login: "john.doe",
                  },
                  state: "PUBLISHED",
                  views: 141,
                  contentVersion: 1,
                  jsonContent: {
                    type: "doc",
                    content: [
                      {
                        type: "paragraph",
                        attrs: {
                          textAlign: "left",
                        },
                        content: [
                          {
                            type: "custom-image",
                            attrs: {
                              textAlign: "left",
                              src: "/workspace/document/abcdef12-3456-7890-abcd-ef1234567890",
                              alt: null,
                              title: null,
                              size: "medium",
                              width: "350",
                              height: null,
                              style: null,
                            },
                          },
                          {
                            type: "custom-image",
                            attrs: {
                              textAlign: "left",
                              src: "/workspace/document/abcdef12-3456-7890-abcd-ef1234567890?timestamp=1700000000000",
                              alt: "",
                              title: "",
                              size: "medium",
                              width: "350",
                              height: null,
                              style: null,
                            },
                          },
                        ],
                      },
                      {
                        type: "paragraph",
                        attrs: {
                          textAlign: "left",
                        },
                      },
                      {
                        type: "paragraph",
                        attrs: {
                          textAlign: "left",
                        },
                        content: [
                          {
                            type: "text",
                            text: "Sample OK Text",
                          },
                        ],
                      },
                    ],
                  },
                  firstPublishDate: {
                    $date: 1700000000000,
                  },
                },
              ],
            },
          ]);
        }),
      },
    },
  },
};

export const SingleSelection: Story = {
  render: (args: any) => {
    return <InternalLinker {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "When `multiple` is set to `false`, only one resource can be selected.",
      },
    },
  },
  args: {
    multiple: false,
    defaultAppCode: "wiki",
  },
};

export const NoResourceFound: Story = {
  render: (args: any) => {
    return <InternalLinker {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story: "When no resource is found, the component displays a message.",
      },
    },
    msw: {
      handlers: {
        wiki: http.get("/wiki/listallpages", () => HttpResponse.json([])),
        blog: http.get("/blog/linker", () => HttpResponse.json(null)),
      },
    },
  },
  args: {
    multiple: false,
    defaultAppCode: "wiki",
  },
};
