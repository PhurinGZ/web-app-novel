"use client";

import React from "react";
import ReadNovel from "@/components/readNovel/readNovel";
import { useParams } from "next/navigation";
import Profile from "@/components/profile/profile";

function page() {
  const params = useParams<{ uniqeName: string }>();

  return (
    <div>
      <Profile />
    </div>
  );
}

export default page;
