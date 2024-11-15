import React, { useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody, CardHeader } from "@nextui-org/react";

import Favorite from "./favorite";
import useSWR from "swr";
import Loading from "../loading/loading";
import { useSession } from "next-auth/react";

interface TabItem {
  id: string;
  label: string;
  content: string;
}

interface DataNovel {
  user: {
    novel_favorites: [];
  };
}

const App: React.FC = () => {
  const { data: session, status } = useSession();
  const [dataNovel, setDataNovel] = useState<DataNovel>();

  if (status === "loading") return <Loading />;
  // if (error) return <div>{error.message}</div>;

  // console.log(session);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const res = await fetch("http://localhost:3000/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch user info:", res.statusText);
        return;
      }

      const data = await res.json();
      console.log(data);
      setDataNovel(data);
    };
    // Call the function after logging in or during a user session
    fetchUserInfo();
  }, [session]);

  // console.log(dataNovel.user.novel_favorites[0]._id);

  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Dynamic tabs">
        <Tab title="Favorite">
          {dataNovel?.user?.novel_favorites?.length ? (
            dataNovel.user.novel_favorites.map(
              (fav: {
                id: React.Key | null | undefined;
                name: any;
                detail: any;
                _id: any;
              }) => (
                <Favorite
                  key={fav.id}
                  title={fav.name}
                  description={fav.detail}
                  imageUrl={"URL"}
                  id={fav._id}
                />
              )
            )
          ) : (
            <div>ไม่มีนิยายที่ชอบ</div>
          )}
        </Tab>
        <Tab title="อ่านล่าสุด" isDisabled>
          <Card>
            <CardBody></CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default App;
