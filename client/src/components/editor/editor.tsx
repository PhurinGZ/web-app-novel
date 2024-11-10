// components/RichTextEditor.tsx
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import "./style.scss";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [editorHtml, setEditorHtml] = useState(value);

  // Update editor content when `value` prop changes
  useEffect(() => {
    setEditorHtml(value);
  }, [value]);

  const handleChange = (html: string) => {
    setEditorHtml(html);
    onChange(html);
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <div className="min-h-[500px]">
      <ReactQuill
        theme="snow"
        value={editorHtml}
        onChange={handleChange}
        modules={modules}
        formats={[
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "bullet",
          "indent",
          "link",
          "image",
          "video",
        ]}
      />
    </div>
  );
};

export default RichTextEditor;
