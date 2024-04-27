"use client";

import React from "react";
import ReadNovel from "@/components/readNovel/readNovel";
import { useParams } from "next/navigation";

function page() {
  const params = useParams<{ uniqeName: string }>();

  return <div></div>;
}

export default page;
