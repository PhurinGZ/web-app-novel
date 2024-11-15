"use client";
// app/novel/[id]/add-chapter/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/editor/richTextEditor/editor";
import { Input, Button } from "@nextui-org/react";

interface props {
  id: string;
}

const AddChapterPage = ({ id }: props) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

//   console.log("id", id);
//   console.log("title", title);
//   console.log("content", content);
//   console.log("isSubmitting", isSubmitting);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/chapters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: title,
          content: content,
          novelId: id,
        }),
      });

      const data = await response.json();

      if (data.status >= 400) {
        throw new Error(data.message || "Failed to create chapter");
      }

      alert(data.message);
      router.push(`/book/${id}`);
    } catch (error) {
      console.error("Error creating chapter:", error);
      alert(error instanceof Error && error.message || "Failed to create chapter. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      const confirmCancel = window.confirm(
        "Are you sure you want to cancel? Your changes will be lost."
      );
      if (confirmCancel) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Chapter</h1>
        <p className="text-gray-600 mt-2">
          Create a new chapter for your novel
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chapter Title
          </label>
          <Input
            type="text"
            placeholder="Enter chapter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chapter Content
          </label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            color="primary"
            onClick={handleSubmit}
            isDisabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Chapter"}
          </Button>
          <Button
            color="default"
            onClick={handleCancel}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddChapterPage;
