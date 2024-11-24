import React, { useEffect, useState } from "react";
import SliderImage from "../sliderImage/sliderImage";
import "./homePage.scss";
import SliderBook from "../sliderbook/sliderBook";
import useSWR from "swr";
import Loading from "@/components/loading/loading";
import { useSession } from "next-auth/react";

interface Novel {
  id: number;
  name: string;
  desc: string;
  category: { name: string };
  rate: { name: string };
  rating: number[];
  detail: string;
  tag: string;
  chapter: { id: number; name: string; content: string }[];
  createdBy: { username: string };
  public: boolean;
  updateAt: string;
  createAt: string;
}

interface NovelList {
  nameListTH: string;
  novels: Novel[];
}

function HomePage() {
  const [dataNovel, setDataNovel] = useState<Novel[] | null>(null);
  const { data: session, status } = useSession();

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data: novelData, error: novelError } = useSWR("/api/novels", fetcher);
  const { data: listNovelsData, error: listNovelsError } = useSWR<NovelList[]>(
    "/api/list-novels",
    fetcher
  );

  useEffect(() => {
    if (novelData) {
      setDataNovel(novelData.novels);
    }
  }, [novelData]);

  if (listNovelsError) {
    return <div>Failed to load, Error: {listNovelsError.message}</div>;
  }

  if (!listNovelsData || !novelData) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="slider-container-home-page">
          <SliderImage />
        </div>

        {/* Novel Lists Section */}
        {listNovelsData.map((list, index) => (
          <section key={index} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{list.nameListTH}</h2>
            <SliderBook dataCardNovel={list.novels} />
          </section>
        ))}

        {/* All Novels Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">นิยายทั้งหมด</h2>
          {dataNovel && <SliderBook dataCardNovel={dataNovel} />}
        </section>
      </main>
    </div>
  );
}

export default HomePage;
