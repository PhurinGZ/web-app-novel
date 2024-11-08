"use client";
import CategoryPage from "@/components/category/categoryPage";
import { useParams } from "next/navigation";
import React from "react";

function page() {
  const params = useParams<{ name: string }>();

  // console.log(params.name)
  return (
    <div>
      <CategoryPage name={params.name} />
    </div>
  );
}

export default page;
