import React, { useEffect, useState } from "react";
import NavBar from "@/components/navbar/navbar";
import SliderImage from "../sliderImage/sliderImage";
import Searchbar from "../searchbar/searchbar";
import "./homePage.scss";
import SliderBook from "../sliderbook/sliderBook";
import Footer from "../footer/footer";
import useSWR from "swr";
import Loading from "@/components/loading/loading";

function HomePage() {
  const [dataNovel, setDataNovel] = useState(null);

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data: novelData, error: novelError } = useSWR(
    "http://localhost:3001/api/novels",
    fetcher
  );

  const { data: listNovelsData, error: listNovelsError } = useSWR(
    "http://localhost:3001/api/list-novels",
    fetcher
  );
  console.log(novelData);

  useEffect(() => {
    if (novelData) {
      setDataNovel(novelData);
      // console.log(data);
    }
  }, [novelData]);

  if (listNovelsError)
    return <div>Failed to load, Error : {listNovelsError.message}</div>;
  if (!listNovelsData) return <Loading />;

  console.log(dataNovel);

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
            {listNovelsData?.map((l, index) => (
              <div key={index} className="content">
                <h1 className="text-3xl font-bold mb-4">{l.nameListTH}</h1>
                <div className="book-cover-home-page">
                  <SliderBook dataCardNovel={l.novels} />
                </div>
              </div>
            ))}

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
