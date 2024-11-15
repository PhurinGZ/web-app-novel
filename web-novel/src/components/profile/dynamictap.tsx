// components/profile/dynamictap.tsx
import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import Favorite from "./favorite";
import { useSession } from "next-auth/react";
import Loading from "../loading/loading";

interface NovelFavorite {
  id: string;
  name: string;
  detail: string;
  _id: string;
  imageUrl?: string;
}

interface DataNovel {
  user: {
    novel_favorites: NovelFavorite[];
  };
}

const DynamicTap: React.FC = () => {
  const { data: session, status } = useSession();
  const [dataNovel, setDataNovel] = useState<DataNovel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch user info: ${res.statusText}`);
        }

        const data = await res.json();
        setDataNovel(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchUserInfo();
    }
  }, [status]);

  if (status === "loading" || isLoading) return <Loading />;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Dynamic tabs" className="w-full">
        <Tab key="favorites" title="Favorite">
          <div className="space-y-4">
            {dataNovel?.user?.novel_favorites?.length ? (
              dataNovel.user.novel_favorites.map((fav) => (
                <Favorite
                  key={fav._id}
                  title={fav.name}
                  description={fav.detail}
                  imageUrl={fav.imageUrl || "/image/imageBook1.png"}
                  id={fav._id}
                />
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">ไม่มีนิยายที่ชอบ</div>
            )}
          </div>
        </Tab>
        <Tab key="recent" title="อ่านล่าสุด" isDisabled>
          <div className="p-4">
            <p className="text-center text-gray-500">Coming soon</p>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default DynamicTap;