"use client";
// app/chapter/[id]/edit/page.tsx
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "@/components/editor/richTextEditor/editor";
import { Input, Button } from "@nextui-org/react";
import useSWR from "swr";
// import MyEditor from "./editorTest/myEditor1"

const ChapterEditPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `/api/chapters/${id}`,
    fetcher
  );

  useEffect(() => {
    if(data){
      const chapterTitle = data?.chapter?.name;
      const chapterContent = data?.chapter?.content;
      setTitle(chapterTitle);
      setContent(chapterContent);
      setOriginalTitle(chapterTitle);
      setOriginalContent(chapterContent);
    }
  },[data]);

  // Check for changes whenever title or content updates
  useEffect(() => {
    const isChanged = 
      title !== originalTitle || 
      content !== originalContent;
    setHasChanges(isChanged);
  }, [title, content, originalTitle, originalContent]);

  const handleSubmit = async () => {
    try {
      await fetch(`/api/chapters/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: title, content }),
      });
      setOriginalTitle(title);
      setOriginalContent(content);
      setHasChanges(false);
      alert("success");
    } catch (error) {
      console.error("Error saving chapter:", error);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmCancel = window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.");
      if (confirmCancel) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  console.log("originalTitle",originalTitle)
  console.log("title",title)
  console.log("content",content)

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold mb-4">Edit Chapter</h1>
      <div className="mb-4">
        <span>Title</span>
        <Input
          type="text"
          placeholder="Chapter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-8">
        <span>Content</span>
        {/* <MyEditor value={content} onChange={setContent} /> */}
        <RichTextEditor value={content} onChange={setContent} />
      </div>
      <div className="flex gap-4">
        <Button 
          onClick={handleSubmit} 
          color="primary"
          isDisabled={!hasChanges}
        >
          Save Changes
        </Button>
        <Button onClick={handleCancel} color="default">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ChapterEditPage;