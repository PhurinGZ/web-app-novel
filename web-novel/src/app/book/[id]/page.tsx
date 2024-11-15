"use client";

import { useParams } from "next/navigation";
import DetailNovel from "@/components/detailNovelPage/detailnovel";
import { NextUIProvider } from "@nextui-org/react";

export default function ExampleClientComponent() {
  const params = useParams<{ id: string }>();

  // Route -> /shop/[tag]/[item]
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  console.log(params);

  return (
    <NextUIProvider>
      <div>
        <DetailNovel _id={params.id} />
      </div>
    </NextUIProvider>
  );
}
