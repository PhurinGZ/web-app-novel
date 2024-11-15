import React from "react";
import { Link } from "@nextui-org/react";
import Image from "next/image";

function Favorite({ title, description, imageUrl, id }) {
  return (
    <Link
      href={`/book/${id}`}
      className="w-full rounded-lg overflow-hidden shadow-lg flex items-start p-4"
    >
      <div className="min-w-32 w-32">
        <Image
          src={imageUrl || "/image/imageBook1.png"}
          height={200}
          alt={title}
          width={200}
          className="rounded-lg"
        />
      </div>
      <div className="px-6 py-4 flex flex-col ">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
    </Link>
  );
}

export default Favorite;
