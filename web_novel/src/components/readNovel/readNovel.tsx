import React, { useState, ChangeEvent, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import novelContent from "../../data/dataContent";
import NavBar from "@/components/navbar/navbar";
import dataCardNovel from "@/data/data";
import Footer from "../footer/footer";
import useSWR from "swr";
import Dropdown from "./dropdown";
import { Button } from "@nextui-org/button";
import { Skeleton } from "@nextui-org/react";
import Loading from "@/components/loading/loading";

interface Chapter {
  id: number;
  name: string;
  content: string;
}

function ReadNovel({ _id }) {
  const [dataNovel, setDataNovel] = useState<any>();
  const [name, setName] = useState<string | null>();

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `http://localhost:1337/api/chapters/${_id}?populate=*`,
    fetcher
  );

  // console.log(data?.data?.attributes.novel.data);

  useEffect(() => {
    if (data) {
      setDataNovel(data.data);
      setName(data?.data?.attributes.novel.data.attributes.name);
    }
  }, [data]);

  // console.log(dataNovel.attributes.name);

  if (error) return <div>error</div>;
  // if (!data) return <div>loading...</div>;

  return (
    <div>
      <head>
        {dataNovel?.attributes?.name && (
          <title>{dataNovel.attributes.name}</title>
        )}
      </head>
      <nav>
        <NavBar position={"relative"} />
      </nav>
      {!data ? (
        <Loading />
      ) : (
        <main>
          <div className="bg-gray-200 ">
            <div className="container mx-auto px-4 py-8 items-center w-full lg:w-[898px] ">
              {name && <Dropdown name={name} id={_id} />}
              <div className="bg-white shadow-md p-6 rounded-b-lg min-h-screen">
                {/* Display novel content */}
                <pre className="whitespace-pre-line text-lg">
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        dataNovel?.attributes?.content[0].children[0].text ||
                        "",
                    }}
                  />
                </pre>
              </div>
            </div>
          </div>
        </main>
      )}
     
    </div>
  );
}

export default ReadNovel;
