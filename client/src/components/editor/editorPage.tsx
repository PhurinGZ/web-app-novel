"use client";
// pages/index.tsx
import React, { useState } from "react";
import RichTextEditor from "@/components/editor/editor";
import NavBar from "@/components/navbar/navbar";
import { Input } from "@nextui-org/react";
import Footer from "@/components/footer/footer";


const editorPage = () => {
  const [content, setContent] = useState<string>("");

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };

  console.log(content)

  return (
    <div>
      <nav>
        <div className="relative z-[200] h-[50px] md:h-[60px] ">
          <NavBar position={"fixed"} />
        </div>
      </nav>
      <main>
        <div className="mx-auto max-w-4xl p-8">
          <h1 className="text-3xl font-bold mb-4">Rich Text Editor</h1>
        </div>
        <div className="mx-auto max-w-4xl p-8 ">
          <div className="">
            <span>ชื่อเรื่อง</span>
            <Input type="text" placeholder="ชื่อเรื่อง" />
          </div>
          <div className=" mt-8 ">
            <div><span>เนื้อหา</span></div>
            <div className="h-fit overflow-hidden ">
              <RichTextEditor value={content} onChange={handleEditorChange} />
            </div>
          </div>
        </div>
      </main>
     
    </div>
  );
};

export default editorPage;
