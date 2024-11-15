import React from "react";
import EditNovel from "@/components/editNovel/editNovel";

function page({ params }: { params: { id: string } }) {
  return <EditNovel id={params.id} />;
}

export default page;
