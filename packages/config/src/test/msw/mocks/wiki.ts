import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/wiki/listallpages', ({ request }) => {
    const url = new URL(request.url);
    const visibility = url.searchParams.get('visible');

    if (!visibility) return new HttpResponse(null, { status: 404 });

    return HttpResponse.json([
      {
        _id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        title: 'Sample Wiki',
        pages: [
          {
            _id: 'b2c3d4e5-f6a7-8901-bcde-f1234567890a',
            title: 'Page One',
            contentPlain: 'Sample content',
            author: 'c3d4e5f6-a7b8-9012-cdef-1234567890ab',
            authorName: 'Jane Doe',
            modified: {
              $date: 1700000000000,
            },
            contentVersion: 1,
            jsonContent: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    textAlign: 'left',
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'This is a sample paragraph.',
                    },
                  ],
                },
              ],
            },
            position: 0,
            parentId: null,
          },
          {
            _id: 'd4e5f6a7-b8c9-0123-def0-4567890abc12',
            title: 'Video Page',
            contentPlain: '',
            author: 'e5f6a7b8-c9d0-1234-ef01-67890abc1234',
            authorName: 'John Smith',
            modified: {
              $date: 1700000001000,
            },
            contentVersion: 1,
            jsonContent: {
              type: 'doc',
              content: [
                {
                  type: 'video',
                  attrs: {
                    textAlign: 'left',
                    src: '/workspace/document/abcdef12-3456-7890-abcd-ef1234567890',
                    controls: 'true',
                    documentId: 'abcdef12-3456-7890-abcd-ef1234567890',
                    isCaptation: 'true',
                    videoResolution: '350x197',
                    width: '350',
                    height: '197',
                  },
                },
              ],
            },
            position: 3,
            parentId: null,
          },
          {
            _id: 'f6a7b8c9-d0e1-2345-f012-34567890abcd',
            title: 'Content Page',
            contentPlain: 'Sample plain text content.',
            author: 'g7h8i9j0-k1l2-3456-m789-0123456789ab',
            authorName: 'Alice Brown',
            modified: {
              $date: 1700000002000,
            },
            contentVersion: 1,
            jsonContent: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    textAlign: 'left',
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'More sample text.',
                    },
                  ],
                },
                {
                  type: 'heading',
                  attrs: {
                    textAlign: 'left',
                    level: 2,
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'Sample Heading',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  attrs: {
                    textAlign: 'left',
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            color: null,
                            fontSize: '18px',
                            lineHeight: null,
                            fontFamily: null,
                          },
                        },
                      ],
                      text: 'Stylized text.',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  attrs: {
                    textAlign: 'left',
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            color: null,
                            fontSize: '16px',
                            lineHeight: null,
                            fontFamily: null,
                          },
                        },
                      ],
                      text: 'More ',
                    },
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            color: '#7C2C96',
                            fontSize: '16px',
                            lineHeight: null,
                            fontFamily: null,
                          },
                        },
                      ],
                      text: 'important text',
                    },
                  ],
                },
              ],
            },
            position: 4,
            parentId: null,
          },
          {
            _id: 'h8i9j0k1-l2m3-4567-n890-1234567890ab',
            title: 'Create Page',
            contentPlain: '123456',
            author: 'i9j0k1l2-m3n4-5678-o901-234567890abc',
            authorName: 'Bob Green',
            modified: {
              $date: 1700000003000,
            },
            lastContributer: 'j0k1l2m3-n4o5-6789-p012-34567890abcd',
            lastContributerName: 'Carol White',
            contentVersion: 1,
            jsonContent: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    textAlign: 'left',
                  },
                  content: [
                    {
                      type: 'text',
                      text: '123456',
                    },
                  ],
                },
              ],
            },
            position: 1,
            parentId: 'b2c3d4e5-f6a7-8901-bcde-f1234567890a',
          },
          {
            _id: 'k1l2m3n4-o5p6-7890-q123-4567890abcde',
            title: 'New Wiki',
            author: 'l2m3n4o5-p6q7-8901-r234-567890abcdef',
            authorName: 'Dave Black',
            modified: {
              $date: 1700000004000,
            },
            created: {
              $date: 1700000004000,
            },
            contentVersion: 1,
            jsonContent: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    textAlign: 'left',
                  },
                },
              ],
            },
            contentPlain: '',
            position: 5,
            parentId: null,
          },
          {
            _id: 'm3n4o5p6-q7r8-9012-s345-67890abcdefg',
            title: 'Test Page',
            author: 'n4o5p6q7-r8s9-0123-t456-7890abcdefg1',
            authorName: 'Eve Grey',
            modified: {
              $date: 1700000005000,
            },
            created: {
              $date: 1700000005000,
            },
            contentVersion: 1,
            jsonContent: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    textAlign: 'left',
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'Sample test content.',
                    },
                  ],
                },
              ],
            },
            contentPlain: 'Sample test content.',
            position: 6,
            parentId: null,
          },
          {
            _id: 'o5p6q7r8-s9t0-1234-u567-890abcdefghi',
            title: 'Another Page',
            author: 'p6q7r8s9-t0u1-2345-v678-90abcdefghi2',
            authorName: 'Frank Yellow',
            modified: {
              $date: 1700000006000,
            },
            created: {
              $date: 1700000006000,
            },
            contentVersion: 1,
            jsonContent: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    textAlign: 'left',
                  },
                },
              ],
            },
            contentPlain: '',
            position: 7,
            parentId: null,
          },
        ],
        thumbnail: '/workspace/document/abcdef12-3456-7890-abcd-ef1234567890',
        modified: {
          $date: 1700000007000,
        },
        owner: {
          userId: 'q7r8s9t0-u1v2-3456-w789-0123456789ab',
          displayName: 'George Blue',
        },
        shared: [
          {
            'userId': 'r8s9t0u1-v2w3-4567-x890-1234567890ab',
            'net-atos-entng-wiki-controllers-WikiController|getPage': true,
            'net-atos-entng-wiki-controllers-WikiController|listPages': true,
            'net-atos-entng-wiki-controllers-WikiController|getWiki': true,
            'net-atos-entng-wiki-controllers-WikiController|comment': true,
          },
          {
            'userId': 's9t0u1v2-w3x4-5678-y901-234567890abc',
            'net-atos-entng-wiki-controllers-WikiController|listRevisions':
              true,
            'net-atos-entng-wiki-controllers-WikiController|getPage': true,
            'net-atos-entng-wiki-controllers-WikiController|listPages': true,
            'net-atos-entng-wiki-controllers-WikiController|createPage': true,
            'net-atos-entng-wiki-controllers-WikiController|getWiki': true,
            'net-atos-entng-wiki-controllers-WikiController|updatePage': true,
            'net-atos-entng-wiki-controllers-WikiController|comment': true,
            'net-atos-entng-wiki-controllers-WikiController|getRevisionById':
              true,
            'net-atos-entng-wiki-controllers-WikiController|updatePageList':
              true,
          },
        ],
        description: 'This is a sample description.',
      },
    ]);
  }),
];
