// components/comments/Comments.tsx
import React from 'react';
import { MessageCircle } from "lucide-react";
import CommentForm from './commentForm';
import CommentList from './commentList';

interface CommentsProps {
  chapterId: string;
  comments: any[];
  isLoading: boolean;
  onNewComment: (text: string) => Promise<void>;
  isAuthenticated?: boolean;
}

const Comments: React.FC<CommentsProps> = ({ 
  chapterId, 
  comments,
  isLoading,
  onNewComment,
  isAuthenticated = true
}) => {
  return (
    <div className="mt-6 bg-white rounded-lg shadow-md">
      <div className="border-b p-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <MessageCircle className="h-5 w-5" />
          Comments
        </h2>
      </div>
      <div className="p-6">
        <CommentForm 
          isAuthenticated={isAuthenticated}
          onSubmit={onNewComment}
        />
        <hr className="my-6 border-t border-gray-200" />
        <CommentList 
          comments={comments}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Comments;
