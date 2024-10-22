"use client";

import React from "react";
import ReadNovel from "@/components/readNovel/readNovel";
import { useParams } from "next/navigation";
import Profile from "@/components/profile/profile";

import { getCookie } from "cookies-next";
import UserProvider from "@/context/UserProvider";


function page() {
  const params = useParams<{ uniqeName: string }>();

  return (
    <UserProvider>
      <Profile />
    </UserProvider>

  );
}

export default page;
