
"use client";


import React from "react";
import ReadNovel from "@/components/readNovel/readNovel";
import { useParams } from "next/navigation";
import { ChapterProvider } from "@/context/dropdownReadNovelProvider";

function page() {
  const params = useParams<{ id: string }>();
  // console.log(params.id)

  return (
    <div>
      <ChapterProvider>
        <ReadNovel _id={Number(params.id)} />
      </ChapterProvider>

    </div>
  );
}

export default page;
