import React from "react";
import AddChapter from "@/components/add-chapter/addChapter";

function page({ params }: { params: { id: string } }) {
  return <AddChapter id={params.id} />;
}

export default page;
