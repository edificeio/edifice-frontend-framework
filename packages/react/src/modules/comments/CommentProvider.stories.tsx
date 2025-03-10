import { Meta, StoryObj } from '@storybook/react';
import { CommentProvider } from '.';

import { useState } from 'react';
import { CommentProps } from './types';

const meta: Meta<typeof CommentProvider> = {
  title: 'Modules/Comments',
  component: CommentProvider,
  parameters: {
    docs: {
      description: {
        component:
          'CommentProvider component allows you to manage and display comments in a structured way. It supports various options for comment length, reply length, and the number of comments and replies. You can also provide callbacks for posting, updating, and deleting comments.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CommentProvider>;

export const Base: Story = {
  render: (_args) => {
    return (
      <CommentProvider
        type="edit"
        comments={[
          {
            id: 'a2b1-cdf3',
            comment: 'This is my first comment',
            authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
            authorName: 'John Doe',
            createdAt: 1726757643336,
          },
          {
            id: 'a2b1-cd2f',
            comment: 'This is my own comment',
            authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4b',
            authorName: 'Catherine Bailly',
            createdAt: 1726069313281,
            updatedAt: 1726069313281,
          },
        ]}
        options={{
          maxCommentLength: 800,
          maxReplyLength: 200,
          maxComments: 10,
          maxReplies: 5,
          additionalComments: 5,
        }}
        callbacks={{
          post: async (comment) => console.log(comment),
          put: async ({ comment, commentId }) =>
            console.log({ comment, commentId }),
          delete: async (commentId) => console.log(commentId),
        }}
      />
    );
  },
};

export const CreateComment: Story = {
  render: (_args) => {
    const [comments, setComments] = useState<CommentProps[]>([]);

    const handleOnPostComment = async (comment: string) => {
      setComments([
        {
          id: 'a2b1-cdf3',
          comment,
          authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
          authorName: 'John Doe',
          createdAt: 1726757643336,
          updatedAt: 1726757643336,
        },
      ]);
    };

    return (
      <CommentProvider
        type="edit"
        comments={comments}
        callbacks={{
          post: (comment) => handleOnPostComment(comment),
          put: async ({ comment, commentId }) =>
            console.log({ comment, commentId }),
          delete: async (commentId) => console.log(commentId),
        }}
      />
    );
  },
};

export const UpdateComment: Story = {
  render: (_args) => {
    const [comments, setComments] = useState<CommentProps[]>([
      {
        id: 'a2b1-cdf3',
        comment: 'This is my first comment',
        authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
        authorName: 'John Doe',
        createdAt: 1726757643336,
        updatedAt: 1726757643336,
      },
    ]);

    const handleOnPutcomment = async ({
      comment,
      commentId,
    }: {
      comment: string;
      commentId: string;
    }) => {
      const updateComment = comments.find(
        (comment) => comment.id === commentId,
      );
      if (!updateComment) return;
      updateComment.comment = comment;
      setComments([updateComment]);
    };

    return (
      <CommentProvider
        type="edit"
        comments={comments}
        callbacks={{
          post: async (comment) => console.log(comment),
          put: async ({ comment, commentId }) =>
            handleOnPutcomment({ comment, commentId }),
          delete: async (commentId) => console.log(commentId),
        }}
      />
    );
  },
};

export const DeleteComment: Story = {
  render: (_args) => {
    const [comments, setComments] = useState<CommentProps[]>([
      {
        id: 'a2b1-cdf3',
        comment: 'This is my first comment',
        authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
        authorName: 'John Doe',
        createdAt: 1726757643336,
        updatedAt: 1726757643336,
      },
    ]);

    const handleOnDeleteComment = async () => {
      setComments([]);
    };

    return (
      <CommentProvider
        type="edit"
        comments={comments}
        callbacks={{
          post: async (comment) => console.log(comment),
          put: async ({ comment, commentId }) =>
            console.log({ comment, commentId }),
          delete: () => handleOnDeleteComment(),
        }}
      />
    );
  },
};

export const ReadComments: Story = {
  render: (_args) => {
    return (
      <CommentProvider
        type="read"
        comments={[
          {
            id: 'a2b1-cdf3',
            comment: 'This is my first comment',
            authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
            authorName: 'John Doe',
            createdAt: 1726757643336,
            updatedAt: 1726757643336,
          },
        ]}
      />
    );
  },
};

export const OptionsComments: Story = {
  render: (_args) => {
    return (
      <CommentProvider
        type="edit"
        options={{
          maxCommentLength: 200,
          maxReplyLength: 100,
          maxComments: 10,
          maxReplies: 5,
          additionalComments: 5,
        }}
        comments={[
          {
            id: 'a2b1-cdf3',
            comment: 'This is my first comment',
            authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
            authorName: 'John Doe',
            createdAt: 1726757643336,
            updatedAt: 1726757643336,
          },
        ]}
        callbacks={{
          post: async (comment) => console.log(comment),
          put: async ({ comment, commentId }) =>
            console.log({ comment, commentId }),
          delete: async (commentId) => console.log(commentId),
        }}
      />
    );
  },
};

export const ReadMoreComments: Story = {
  render: (_args) => {
    return (
      <CommentProvider
        type="edit"
        options={{
          maxCommentLength: 200,
          maxReplyLength: 100,
          maxComments: 4,
          maxReplies: 5,
          additionalComments: 2,
        }}
        comments={[
          {
            id: 'b3c2-efe4',
            comment: 'Amazing post! Really insightful.',
            authorId: '82d13c77-bb2d-4fce-b4ef-86219de28c5b',
            authorName: 'Jane Smith',
            createdAt: 1726757654450,
          },
          {
            id: 'd4e5-ghf6',
            comment: 'I completely agree with your points.',
            authorId: '73f24d88-cc3f-5adf-c5fe-97229ff39e6c',
            authorName: 'Alice Johnson',
            createdAt: 1726757665567,
          },
          {
            id: 'f6g7-ihj8',
            comment: 'Thanks for sharing this information!',
            authorId: '94g35e99-dd4g-6beg-d6ff-18230gg40f7d',
            authorName: 'Bob Williams',
            createdAt: 1726757676678,
          },
          {
            id: 'h8i9-jkl0',
            comment: 'I found this really helpful for my project.',
            authorId: 'a5h46f00-ee5h-7cfh-e7gg-29341hh51g8e',
            authorName: 'Emily Davis',
            createdAt: 1726757687789,
          },
          {
            id: 'j1k2-lmn3',
            comment: 'Can you elaborate more on this topic?',
            authorId: 'b6i57g11-ff6i-8dgi-f8hh-3a452ii62h9f',
            authorName: 'Chris Brown',
            createdAt: 1726757698900,
          },
          {
            id: 'm2n3-opq4',
            comment: 'This really cleared up a lot of confusion for me.',
            authorId: 'c7j68h22-gg7j-9ejj-g9ii-4b563jj73i0g',
            authorName: 'Sarah Miller',
            createdAt: 1726757710012,
          },
          {
            id: 'o3p4-qrt5',
            comment: 'I had the same question. Glad you brought it up!',
            authorId: 'd8k79i33-hh8k-akjj-h0jj-5c674kk84j1h',
            authorName: 'Michael Wilson',
            createdAt: 1726757721123,
          },
          {
            id: 'r4s5-uvw6',
            comment: 'Your post made me think about this in a new way.',
            authorId: 'e9l80j44-ii9l-bllj-i1kk-6d785ll95k2i',
            authorName: 'Jessica Garcia',
            createdAt: 1726757732234,
          },
          {
            id: 't6u7-wxy8',
            comment:
              'I disagree with some points, but overall it was a good read.',
            authorId: 'f0m91k55-jj0m-cmmk-j2ll-7e896mm06l3j',
            authorName: 'David Martinez',
            createdAt: 1726757743345,
          },
          {
            id: 'v7w8-yza9',
            comment: 'I’ve been looking for something like this. Thank you!',
            authorId: 'g1n02l66-kk1n-dnnl-k3mm-8f907nn17m4k',
            authorName: 'Laura Lee',
            createdAt: 1726757754456,
          },
        ]}
        callbacks={{
          post: async (comment) => console.log(comment),
          put: async ({ comment, commentId }) =>
            console.log({ comment, commentId }),
          delete: async (commentId) => console.log(commentId),
        }}
      />
    );
  },
};

export const Replies: Story = {
  render: (_args) => {
    const [comments, setComments] = useState([
      {
        id: 'a2b1-cdf3',
        comment: 'This component is amazing!! 🔥',
        authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
        authorName: 'John Doe',
        createdAt: 1726757643336,
      },
      {
        id: 'a2b1-cdf4',
        comment: '@John Doe, Yes I agree with you bro',
        authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4d',
        authorName: 'Leo Messi',
        createdAt: 1726069313283,
        updatedAt: 1726069313283,
        replyTo: 'a2b1-cdf3',
      },
      {
        id: 'a2b1-cdf5',
        comment: 'True!!',
        authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4e',
        authorName: 'Luis Suarez',
        createdAt: 1726069313284,
        updatedAt: 1726069313284,
        replyTo: 'a2b1-cdf3',
      },
      {
        id: 'a2b1-cdf6',
        comment: "You're right! @John Doe",
        authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4f',
        authorName: 'Andres Iniesta',
        createdAt: 1726069313285,
        updatedAt: 1726069313285,
        replyTo: 'a2b1-cdf3',
      },
      {
        id: 'a2b1-cdf7',
        comment:
          '@John Doe, yeah one of the best component of this amazing lib!',
        authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4g',
        authorName: 'Neymar Jr',
        createdAt: 1726069313286,
        updatedAt: 1726069313286,
        replyTo: 'a2b1-cdf3',
      },
      {
        id: 'a2b1-cdf8',
        comment: 'Amazing component yeaaaah!',
        authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4g',
        authorName: 'Ronaldo Nazario',
        createdAt: 1726069313286,
        updatedAt: 1726069313286,
        replyTo: 'a2b1-cdf3',
      },
      {
        id: 'a2b1-cdf9',
        comment: '@John Doe, for sure!!!',
        authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4g',
        authorName: 'Iker Casillas',
        createdAt: 1726069313286,
        updatedAt: 1726069313286,
        replyTo: 'a2b1-cdf3',
      },
      {
        id: 'a2b1-cd2f',
        comment: "I'm so glad I can now add a comment! ❤️",
        authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4b',
        authorName: 'Catherine Bailly',
        createdAt: 1726069313281,
        updatedAt: 1726069313281,
      },
      {
        id: 'a2b1-cd3f',
        comment: 'Yes me too @Catherine!',
        authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4c',
        authorName: 'David Caudeli',
        createdAt: 1726069313282,
        updatedAt: 1726069313282,
        replyTo: 'a2b1-cd2f',
      },
    ]);

    // Function to generate unique IDs
    const generateUniqueId = () => {
      return (
        '_' +
        Math.random().toString(36).substring(2, 11) +
        '-' +
        new Date().getTime().toString(36)
      );
    };

    const handlePostAnswer = async (comment: string, replyTo?: string) => {
      const currentTimestamp = Date.now();
      console.log('currentTimestamp', currentTimestamp);

      setComments([
        ...comments,
        {
          id: generateUniqueId(),
          comment,
          authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
          authorName: 'John Doe',
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp,
          replyTo,
        },
      ]);
    };

    const handlePutComment = async ({
      comment,
      commentId,
    }: {
      comment: string;
      commentId: string;
    }) => {
      const updateComment = comments.find(
        (comment) => comment.id === commentId,
      );
      if (!updateComment) return;
      updateComment.comment = comment;
      setComments(comments);
    };

    const handleDeleteComment = async (commentId: string) => {
      setComments(comments.filter((comment) => comment.id !== commentId));
    };

    return (
      <CommentProvider
        type="edit"
        comments={comments}
        options={{
          maxCommentLength: 800,
          maxReplyLength: 200,
          maxComments: 10,
          maxReplies: 2,
          additionalComments: 5,
          additionalReplies: 2,
        }}
        callbacks={{
          post: async (comment, replyTo) =>
            await handlePostAnswer(comment, replyTo),
          put: async ({ comment, commentId }) =>
            await handlePutComment({ comment, commentId }),
          delete: async (commentId) => await handleDeleteComment(commentId),
        }}
      />
    );
  },
};
