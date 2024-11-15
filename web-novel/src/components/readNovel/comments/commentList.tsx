// components/comments/CommentList.tsx
import React from "react";

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  user?: {
    username?: string;
    image?: string;
    isAuthor?: Boolean;
  };
}

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
}

interface User {
  _id: string;
  name?: string;
  image?: string;
  isAuthor?: boolean; // Add this field to identify authors
}

const CommentSkeleton = () => (
  <div className="flex justify-center py-8">
    <div className="animate-pulse flex space-x-4">
      <div className="rounded-full bg-slate-200 h-10 w-10"></div>
      <div className="flex-1 space-y-6 py-1">
        <div className="h-2 bg-slate-200 rounded"></div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AuthorBadge = () => (
  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
    Author
  </span>
);

const CommentList: React.FC<CommentListProps> = ({ comments, isLoading }) => {
  if (isLoading) {
    return <CommentSkeleton />;
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No comments yet. Be the first to share your thoughts!
      </div>
    );
  }

//   console.log(comments);

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment._id} className="flex gap-4">
          <div className="flex-shrink-0">
            {comment.user?.image ? (
              <img
                src={comment.user.image}
                alt={comment.user.username || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                {comment.user?.username?.[0] || "U"}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">
                {comment.user?.username || "Anonymous"}
              </span>
              {comment.user?.isAuthor && <AuthorBadge />}
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
