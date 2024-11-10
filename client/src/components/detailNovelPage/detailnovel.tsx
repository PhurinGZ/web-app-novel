import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import Image from "next/image";
import "@/components/detailNovelPage/style.scss";
import { Link } from "@nextui-org/react";
import useSWR from "swr";
import Loading from "@/components/loading/loading";
import { HeartIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Comment from "./review";

interface Props {
  id: Object;
}

interface NovelStats {
  likeCount: number;
  bookshelfCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface DataCardNovel {
  _id: string;
  category: object;
  chapters: object[];
  createdAt: string;
  description: object;
  detail: string;
  name: string;
  public: boolean;
  publishedAt: string;
  rate: object;
  rating: object;
  tags: object;
  updatedAt: string;
  createdBy: {
    username: string;
  };
}

function DetailNovel({ _id }: Props): JSX.Element {
  const { data: session, status } = useSession();
  const [dataNovel, setDataNovel] = useState<DataCardNovel | null>(null);
  const [novelStats, setNovelStats] = useState<NovelStats>({
    likeCount: 0,
    bookshelfCount: 0,
    isLiked: false,
    isBookmarked: false,
  });

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `http://localhost:3001/api/novels/${_id}`,
    fetcher
  );

  // Fetch initial stats
  useEffect(() => {
    const fetchStats = async () => {
      if (session && dataNovel?._id) {
        try {
          const response = await fetch(
            `/api/favorite?novelId=${dataNovel._id}`
          );
          if (response.ok) {
            const stats = await response.json();
            setNovelStats(stats);
          }
        } catch (error) {
          console.error("Error fetching novel stats:", error);
        }
      }
    };

    fetchStats();
  }, [session, dataNovel?._id]);

  useEffect(() => {
    if (data && _id) {
      setDataNovel(data);
    }
  }, [data]);

  const handleInteraction = async (action: "like" | "bookshelf") => {
    if (status === "unauthenticated") {
      alert("Please log in to interact with this novel.");
      return;
    }

    try {
      if (dataNovel?._id) {
        const response = await fetch("/api/favorite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            novelId: dataNovel._id,
            action: action,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setNovelStats(result);
        } else {
          console.error("Failed to update interaction status");
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  if (error) return <div>Failed to load</div>;
  if (!data) return <Loading />;

  return (
    <div>
      <div className="pb-12">
        <Grid container>
          <Grid item xs={12}>
            <div className="p-6 sm:pt-12">
              <div className="container">
                <div>
                  <h1 className="text-2xl font-bold">Detail Novel</h1>
                </div>

                <div>
                  <div className="flex items-center mt-4 space-x-4">
                    <Image
                      src="/image/imageBook1.png"
                      alt=""
                      className="max-w-24 max-h-32 object-cover"
                      width={100}
                      height={100}
                    />
                    <div className="w-full">
                      <h1 className="text-xl font-bold">{dataNovel?.name}</h1>
                      {dataNovel?.createdBy?.username ? (
                        <p>by: {dataNovel.createdBy.username}</p>
                      ) : (
                        <p>Author unknown</p>
                      )}
                      <p className="text-sm">{dataNovel?.detail}</p>
                    </div>
                    {/* Previous code remains the same... */}

                    <div className="w-full flex justify-end p-4 self-start">
                      <div className="flex space-x-4">
                        {/* Like Button */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => handleInteraction("like")}
                            className={`p-2 rounded-full transition-colors duration-200 ${
                              novelStats.isLiked
                                ? "text-red-500 bg-red-100"
                                : "text-gray-500 bg-gray-100"
                            } hover:bg-red-200 focus:outline-none`}
                            aria-label="Like Novel"
                          >
                            {novelStats.isLiked ? (
                              <HeartIconSolid className="w-6 h-6" />
                            ) : (
                              <HeartIcon className="w-6 h-6" />
                            )}
                          </button>
                          <span className="text-sm text-gray-600 mt-1">
                            {novelStats.likeCount} likes
                          </span>
                        </div>

                        {/* Bookmark Button */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => handleInteraction("bookshelf")}
                            className={`p-2 rounded-full transition-colors duration-200 ${
                              novelStats.isBookmarked
                                ? "text-blue-500 bg-blue-100"
                                : "text-gray-500 bg-gray-100"
                            } hover:bg-blue-200 focus:outline-none`}
                            aria-label="Add to Bookshelf"
                          >
                            {novelStats.isBookmarked ? (
                              <BookmarkIconSolid className="w-6 h-6" />
                            ) : (
                              <BookmarkIcon className="w-6 h-6" />
                            )}
                          </button>
                          <span className="text-sm text-gray-600 mt-1">
                            {novelStats.bookshelfCount} saved
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-solid border-2 border-gray-200 rounded-md p-4">
                    <h2 className="text-lg font-semibold">Chapters</h2>
                    <div className="mt-2 space-y-2">
                      {dataNovel?.chapters?.length ? (
                        dataNovel.chapters.map((chapter, index) => (
                          <Link
                            href={`/chapter/${chapter._id}`}
                            key={index}
                            className="chapter"
                          >
                            <h3 className="chapter-title">{chapter?.name}</h3>
                          </Link>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 mt-4 text-2xl">
                          ไม่มีตอน
                        </div>
                      )}
                    </div>
                  </div>

                  {dataNovel?._id ? (
                    <Comment novelId={dataNovel._id} />
                  ) : (
                    <div>Error loading comments</div>
                  )}
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default DetailNovel;
