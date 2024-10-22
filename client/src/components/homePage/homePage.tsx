
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
    "http://localhost:1337/api/novels?populate=*",
    fetcher
  );

  const { data: listNovelsData, error: listNovelsError } = useSWR(
    "http://localhost:1337/api/list-novels?populate=*",
    fetcher
  );

  useEffect(() => {
    if (novelData) {
      setDataNovel(novelData.data);
      // console.log(data);
    }
  }, [novelData]);

  if (novelError) return <div>Failed to load, Error : {novelError.message}</div>;
  if (!dataNovel) return <Loading />;

  // console.log(dataNovel[1].attributes.list_novels.data[0].attributes.name);
  // dataNovel.forEach((novel) => {
  //   console.log(novel);
  //   console.log(
  //     novel.attributes?.list_novels?.data?.map((l) => l?.attributes?.name)
  //   );
  // });

  // console.log(listNovelsData);
  // console.log(dataNovel);


  return (
    <>
      <nav>
        <div className="relative z-[200] h-[50px] md:h-[60px] ">

          <NavBar position={"fixed"} />
        </div>
      </nav>
      <main>
        <div className="pb-24">
          <div className="slider-container-home-page">

            <SliderImage />
          </div>
          <div className="searchbar-container-home-page">
            <Searchbar />
          </div>
          <div className="content-home">

            {listNovelsData?.data?.map((l) => (
              <div key={l.id} className="content">
                <h1 className="text-3xl font-bold mb-4">{l.attributes.name}</h1>
                <div className="book-cover-home-page">
                  <SliderBook
                    dataCardNovel={dataNovel.filter((novel) =>
                      l.attributes.novels.data.some(
                        (data) => data.attributes.name === novel.attributes.name
                      )
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      

    </>
  );
}

export default HomePage;
