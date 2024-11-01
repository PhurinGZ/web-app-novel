
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "@/components/navbar/navbar";
import Footer from "../footer/footer";
import useSWR from "swr";
import Dropdown from "./dropdown";
import Loading from "@/components/loading/loading";

interface Chapter {
  id: string;
  name: string;
  content: string[];
}

function ReadNovel({ _id }) {
  const [dataNovel, setDataNovel] = useState<any>(null);
  const [name, setName] = useState<string | null>(null);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `http://localhost:3001/api/chapters/${_id}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setDataNovel(data);
      setName(data.name);
    }
  }, [data]);

  // console.log(dataNovel)

  if (error) return <div>Error loading content</div>;

  return (
    <div>
      <head>{dataNovel?.name && <title>{dataNovel.name}</title>}</head>
      <nav>
        <NavBar position={"relative"} />
      </nav>
      {!data ? (
        <Loading />
      ) : (
        <main>
          <div className="bg-gray-200">
            <div className="container mx-auto px-4 py-8 items-center w-full lg:w-[898px]">
              {/* Dropdown chapter novel */}
              {name && dataNovel.novel && (
                <Dropdown
                  novelId={dataNovel.novel._id}
                  id={dataNovel._id}
                />
              )}
              <div className="bg-white shadow-md p-6 rounded-b-lg min-h-screen">
                <pre className="whitespace-pre-line text-lg">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: dataNovel?.content || "",
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
