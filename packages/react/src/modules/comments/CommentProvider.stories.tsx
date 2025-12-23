import { Meta, StoryObj } from '@storybook/react';
import { CommentProvider } from '.';

import { Dispatch, SetStateAction, useState } from 'react';
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

const defaultComment: CommentProps = {
  id: 'a2b1-cdf3',
  comment: 'This is my first comment',
  authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
  authorName: 'John Doe',
  createdAt: 1726757643336,
  updatedAt: 1726757643336,
};

export const Base: Story = {
  render: (_args) => {
    const [comments, setComments] = useState<CommentProps[]>([
      defaultComment,
      {
        id: 'a2b1-cd2f',
        comment: 'I am so glad I can now add a comment! ❤️',
        authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4b',
        authorName: 'Catherine Bailly',
        createdAt: 1726757643337,
        updatedAt: 1726757643337,
      },
    ]);

    return (
      <CommentProvider
        type="edit"
        comments={comments}
        options={{
          maxCommentLength: 800,
          maxReplyLength: 200,
          maxComments: 5,
          additionalComments: 10,
          maxReplies: 2,
          additionalReplies: 10,
        }}
        callbacks={getCallbacks(setComments)}
      />
    );
  },
};

export const CreateComment: Story = {
  render: (_args) => {
    const [comments, setComments] = useState<CommentProps[]>([]);

    return (
      <CommentProvider
        type="edit"
        comments={comments}
        callbacks={getCallbacks(setComments)}
      />
    );
  },
};

export const UpdateComment: Story = {
  render: (_args) => {
    const [comments, setComments] = useState<CommentProps[]>([defaultComment]);

    return (
      <CommentProvider
        type="edit"
        comments={comments}
        callbacks={getCallbacks(setComments)}
      />
    );
  },
};

export const DeleteComment: Story = {
  render: (_args) => {
    const [comments, setComments] = useState<CommentProps[]>([defaultComment]);

    return (
      <CommentProvider
        type="edit"
        comments={comments}
        callbacks={getCallbacks(setComments)}
      />
    );
  },
};

export const HideCommentButton: Story = {
  render: (_args) => {
    const [comments, setComments] = useState<CommentProps[]>([defaultComment]);
    return (
      <CommentProvider
        type="edit"
        comments={comments}
        callbacks={getCallbacks(setComments)}
        options={{ allowReplies: false }}
      />
    );
  },
};

export const ReplyComment: Story = {
  render: (_args) => {
    const [comments, setComments] = useState<CommentProps[]>([
      {
        id: 'a2b1-cdf3',
        comment: 'This component is amazing!! 🔥',
        authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
        authorName: 'John Doe',
        createdAt: 1726757643336,
      },
      {
        id: 'a2b1-cdg3',
        comment: 'Good job! 👏',
        authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
        authorName: 'John Doe',
        createdAt: 1726757643337,
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
        deleted: true,
      },
      {
        id: 'a2b1-cdf6',
        comment: "You're right! @John Doe",
        authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4f',
        authorName: 'Andres Iniesta',
        createdAt: 1726069313285,
        updatedAt: 1726069313285,
        replyTo: 'a2b1-cdf3',
        deleted: true,
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
        deleted: true,
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
    ]);

    return (
      <CommentProvider
        type="edit"
        comments={comments}
        options={{
          maxCommentLength: 800,
          maxReplyLength: 200,
          maxComments: 5,
          maxReplies: 2,
          additionalComments: 10,
          additionalReplies: 10,
        }}
        callbacks={getCallbacks(setComments)}
      />
    );
  },
};

export const ReadComments: Story = {
  render: (_args) => {
    return <CommentProvider type="read" comments={[defaultComment]} />;
  },
};

export const OptionsComments: Story = {
  render: (_args) => {
    const [comments, setComments] = useState<CommentProps[]>([defaultComment]);

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
        comments={comments}
        callbacks={getCallbacks(setComments)}
      />
    );
  },
};

export const ReadMoreComments: Story = {
  render: (_args) => {
    const [comments, setComments] = useState([
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
        comment: 'I disagree with some points, but overall it was a good read.',
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
    ]);

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
        comments={comments}
        callbacks={getCallbacks(setComments)}
      />
    );
  },
};

const getCallbacks = (
  setComments: Dispatch<SetStateAction<CommentProps[]>>,
) => {
  return {
    post: async (comment: string, replyTo?: string) =>
      await handleOnPostComment(comment, setComments, replyTo),
    put: async ({
      comment,
      commentId,
    }: {
      comment: string;
      commentId: string;
    }) =>
      await handleOnPutComment({
        comment,
        commentId,
        setComments,
      }),
    delete: async (commentId: string) =>
      await handleDeleteComment(commentId, setComments),
  };
};

const handleOnPostComment = async (
  comment: string,
  setComments: Dispatch<SetStateAction<CommentProps[]>>,
  replyTo?: string,
) => {
  const currentTimestamp = Date.now();
  setComments((prevComments) => {
    return [
      ...prevComments,
      {
        id: currentTimestamp.toString(),
        comment,
        authorId: '91c22b66-ba1b-4fde-a3fe-95219cc18d4a',
        authorName: 'John Doe',
        createdAt: currentTimestamp,
        replyTo,
      },
    ];
  });
};

const handleOnPutComment = async ({
  comment,
  commentId,
  setComments,
}: {
  comment: string;
  commentId: string;
  setComments: Dispatch<SetStateAction<CommentProps[]>>;
}) => {
  setComments((prevComments) => {
    return prevComments.map((prevComment) => {
      if (prevComment.id === commentId) {
        return {
          ...prevComment,
          comment,
          updatedAt: Date.now(),
        };
      }
      return prevComment;
    });
  });
};

const handleDeleteComment = async (
  commentId: string,
  setComments: Dispatch<SetStateAction<CommentProps[]>>,
) => {
  setComments((prevComments) => {
    const updatedComments = prevComments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          deleted: true,
          comment: '',
          authorId: '',
          authorName: '',
        };
      }
      return comment;
    });
    return updatedComments;
  });
};
