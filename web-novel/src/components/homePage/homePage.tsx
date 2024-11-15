import React, { useEffect, useState } from "react";
import NavBar from "@/components/navbar/navbar";
import SliderImage from "../sliderImage/sliderImage";
import Searchbar from "../searchbar/searchbar";
import "./homePage.scss";
import SliderBook from "../sliderbook/sliderBook";
import Footer from "../footer/footer";
import useSWR from "swr";
import Loading from "@/components/loading/loading";
import { useSession } from "next-auth/react";

function HomePage() {
  const [dataNovel, setDataNovel] = useState(null);
  const { data: session, status } = useSession();

  const fetcher = (url: string | Request | URL) =>
    fetch(url).then((res) => res.json());

  const { data: novelData, error: novelError } = useSWR("/api/novels", fetcher);

  // console.log(novelData)

  const { data: listNovelsData, error: listNovelsError } = useSWR(
    "/api/list-novels",
    fetcher
  );
  // console.log(novelData);

  useEffect(() => {
    if (novelData) {
      setDataNovel(novelData.novels);
      // console.log(data);
    }
  }, [novelData]);

  if (listNovelsError)
    return <div>Failed to load, Error : {listNovelsError.message}</div>;

  if (!session) return <Loading />;
  if (!listNovelsData) return <Loading />;
  if (!novelData) return <Loading />;

  // console.log(dataNovel);

  return (
    <>
      <main>
        <div className="pb-24">
          <div className="slider-container-home-page">
            <SliderImage />
          </div>
          {/* <div className="searchbar-container-home-page">
            <Searchbar />
          </div> */}
          <div className="content-home">
            {listNovelsData?.map(
              (
                l: {
                  nameListTH:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<React.AwaitedReactNode>
                    | null
                    | undefined;
                  novels: {
                    id: number;
                    name: string;
                    desc: string;
                    category: { name: String };
                    rate: { name: String };
                    rating: number[];
                    detail: string;
                    tag: string;
                    chapter: { id: number; name: string; content: string }[];
                    createdBy: { username: String };
                    public: boolean;
                    updateAt: string;
                    createAt: string;
                  }[];
                },
                index: React.Key | null | undefined
              ) => (
                <div key={index} className="content">
                  <h1 className="text-3xl font-bold mb-4">{l.nameListTH}</h1>
                  <div className="book-cover-home-page">
                    <SliderBook dataCardNovel={l.novels} />
                  </div>
                </div>
              )
            )}

            <div className="content">
              <h1 className="text-3xl font-bold mb-4">นิยายทั้งหมด</h1>

              {dataNovel && (
                <div className="book-cover-home-page">
                  <SliderBook dataCardNovel={dataNovel} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default HomePage;
