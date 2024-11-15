// components/comments/CommentForm.tsx
import React from 'react';
import { Send } from "lucide-react";

interface CommentFormProps {
  isAuthenticated: boolean;
  onSubmit: (text: string) => Promise<void>;
}

const CommentForm: React.FC<CommentFormProps> = ({ isAuthenticated, onSubmit }) => {
  const [commentText, setCommentText] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && isAuthenticated) {
      await onSubmit(commentText);
      setCommentText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col gap-4">
        <textarea
          placeholder={isAuthenticated ? "Share your thoughts..." : "Please sign in to comment"}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={!isAuthenticated}
          className="w-full min-h-24 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={!commentText.trim() || !isAuthenticated}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            Post Comment
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;