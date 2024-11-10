"use client";
// app/chapter/[id]/edit/page.tsx
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "@/components/editor/editor";
import { Input, Button } from "@nextui-org/react";
import useSWR from "swr";

const ChapterEditPage = () => {
  const router = useRouter();
  const { id } = useParams(); // Corrected to use useParams() for dynamic routing in App Router
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `/api/chapters/${id}`,
    fetcher
  );

  // console.log(data?.chapter?.content)

  useEffect(() => {
    if(data){
      setTitle(data?.chapter?.name)
      setContent(data?.chapter?.content)
    }
  },[data])

  const handleSubmit = async () => {
    try {
      await fetch(`/api/chapters/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: title, content }),
      });
      // router.push("/novels"); // Redirect after save
      alert("success")
    } catch (error) {
      console.error("Error saving chapter:", error);
    }
  };

  // console.log(content);

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
        <RichTextEditor value={content} onChange={setContent} />
      </div>
      <Button onClick={() => handleSubmit()} color="primary">
        Save Changes
      </Button>
    </div>
  );
};

export default ChapterEditPage;
