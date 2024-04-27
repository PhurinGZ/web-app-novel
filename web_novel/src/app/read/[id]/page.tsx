'use client'

import React from "react";
import ReadNovel from "@/components/readNovel/readNovel";
import { useParams } from "next/navigation";

function page() {
    const params = useParams<{ id: string }>();

  return (
    <div>
      <ReadNovel _id={Number(params.id)}/>
    </div>
  );
}

export default page;
