// components/profile/favorite.tsx
import React from "react";
import { Link } from "@nextui-org/react";
import Image from "next/image";

interface FavoriteProps {
  title: string;
  description: string;
  imageUrl: string;
  id: string;
}

const Favorite: React.FC<FavoriteProps> = ({ title, description, imageUrl, id }) => {
  const defaultImage = "/image/imageBook1.png";

  return (
    <Link
      href={`/book/${id}`}
      className="block w-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-start p-4">
        <div className="min-w-32 w-32 relative">
          <Image
            src={imageUrl.startsWith("http") ? imageUrl : defaultImage}
            height={200}
            width={200}
            alt={title}
            className="rounded-lg object-cover"
            priority={false}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = defaultImage;
            }}
          />
        </div>
        <div className="px-6 py-4 flex-1">
          <h3 className="font-bold text-xl mb-2 line-clamp-2">{title}</h3>
          <p className="text-gray-700 text-base line-clamp-3">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default Favorite;