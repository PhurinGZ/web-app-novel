// app/component/detailNovelPage/detailnovel.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";

import Image from "next/image";
import "@/components/detailNovelPage/style.scss";
import { Link } from "@nextui-org/react";

import useSWR from "swr";
import Loading from "@/components/loading/loading";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react"; // Import useSession to get session data
import Comment from "./review";

interface Props {
  id: Object;
}

interface DataCardNovel {
  category: object;
  chapters: object;
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
  user: object;
  user_favorites: object;
}

function DetailNovel({ _id }: Props): JSX.Element {
  const { data: session, status } = useSession(); // Get session data
  const [dataNovel, setDataNovel] = useState<DataCardNovel | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  // console.log(ratingUser)

  // console.log(_id)

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `http://localhost:3001/api/novels/${_id}`,
    fetcher
  );

  // console.log(dataNovel?.user_faverites?.length);

  // console.log(data)
  useEffect(() => {
    if (data && _id) {
      setDataNovel(data);
    }
  }, [data]);

  const toggleFavorite = async () => {
    if (status === "unauthenticated") {
      alert("Please log in to favorite this novel.");
      return;
    }

    // Optimistically update the favorite state locally
    const updatedFavorites = isFavorited
      ? dataNovel.user_favorites.filter((user) => user._id !== session.user.id)
      : [...dataNovel.user_favorites, { _id: session.user.id }]; // Add user object with ID

    setDataNovel((prev) => ({
      ...prev,
      user_favorites: updatedFavorites,
    }));

    setIsFavorited(!isFavorited);

    try {
      // Rest of your code remains the same
      if (dataNovel && dataNovel._id) {
        const response = await fetch("/api/favorite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ novelId: dataNovel._id }),
        });

        const result = await response.json();

        if (response.ok) {
          setIsFavorited(result.isFavorited);
        } else {
          console.error("Failed to update favorite status:", result.message);
        }
      }
    } catch (error) {
      console.error("An error occurred while updating favorite status:", error);
    }
  };

  useEffect(() => {
    if (data && session) {
      setDataNovel(data);
      setIsFavorited(
        data.user_favorites.map((user) => user._id).includes(session?.user.id)
      ); // Check if the user has favorited the novel
    }
  }, [data, session]);

  // console.log(data?.data[0].attributes);

  if (error) return <div>Failed to load</div>;
  if (!data) return <Loading />;

  console.log(dataNovel);

  console.log("isFavorite", session?.user?.id);
  // console.log("user favorite", data.user_favorites.includes(session?.user?.id));

  return (
    <div>
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
                      {/* Image */}
                      <Image
                        src="/image/imageBook1.png"
                        alt=""
                        className="max-w-24 max-h-32 object-cover"
                        width={100}
                        height={100}
                      />
                      {/* Text */}
                      <div className="w-full">
                        <h1 className="text-xl font-bold">{dataNovel?.name}</h1>
                        {dataNovel &&
                        dataNovel.createdBy &&
                        dataNovel.createdBy.username ? (
                          <p>by: {dataNovel?.createdBy.username} </p>
                        ) : (
                          <p>error data</p>
                        )}
                        {/* Display author */}
                        <p className="text-sm">{dataNovel?.detail}</p>
                      </div>
                      <div className="w-full flex flex-col items-end p-4 self-start">
                        <button
                          onClick={toggleFavorite}
                          className={`p-2 rounded-full transition-colors duration-200 ${
                            isFavorited
                              ? "text-red-500 bg-red-100"
                              : "text-gray-500 bg-gray-100"
                          } hover:bg-red-200 focus:outline-none`}
                          aria-label="Favorite Novel"
                        >
                          {isFavorited ? (
                            <HeartIconSolid className="w-6 h-6" />
                          ) : (
                            <HeartIconOutline className="w-6 h-6" />
                          )}
                        </button>

                        {/* Display the number of users who have favorited this novel */}
                        <p className="text-sm text-gray-600 mt-2">
                          {dataNovel && dataNovel.user_favorites ? (
                            dataNovel.user_favorites.length > 0 ? (
                              <span>
                                {dataNovel.user_favorites.length} users
                                favorited this novel
                              </span>
                            ) : (
                              <span>No users have favorited this novel.</span>
                            )
                          ) : (
                            <span>Error: Data not available.</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 border-solid border-2 border-gray-200 rounded-md p-4">
                      <h2 className="text-lg font-semibold">Chapters</h2>{" "}
                      {/* Corrected heading */}
                      <div className="mt-2 space-y-2">
                        {dataNovel && dataNovel.chapters.length !== 0 ? (
                          dataNovel.chapters.map((chapter, index) => (
                            <Link
                              href={`/chapter/${chapter._id}`}
                              key={index}
                              className="chapter"
                            >
                              <h3 className="chapter-title">{chapter?.name}</h3>{" "}
                            </Link>
                          ))
                        ) : (
                          <div className="text-center text-gray-500 mt-4 text-2xl">
                            ไม่มีตอน
                          </div>
                        )}
                      </div>
                    </div>
                    {/* comment and rating */}
                    {dataNovel && dataNovel._id ? (
                      <Comment novelId={dataNovel?._id} />
                    ) : (
                      <>Error to fetch data</>
                    )}
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default DetailNovel;
