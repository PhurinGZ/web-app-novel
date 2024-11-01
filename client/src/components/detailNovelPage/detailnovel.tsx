"use client";

import React, { useEffect, useState } from "react";
import { Typography, Grid } from "@mui/material";
import Rating from "@mui/material/Rating";
import { detailNovel, userReviews } from "../../data/dataDetailNovel"; // Assuming you have a type for userReviews

import NavBar from "@/components/navbar/navbar";

import Image from "next/image";
import "@/components/detailNovelPage/style.scss";
import dataCardNovel from "@/data/data";
import { Link } from "@nextui-org/react";
import Footer from "../footer/footer";

import useSWR from "swr";
import Loading from "@/components/loading/loading";
import { useChapter } from "@/context/dropdownReadNovelProvider";

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
  user_faverites: object;
}

function DetailNovel({ _id }: Props): JSX.Element {
  const [ratingValue, setRatingValue] = useState<number | null>(null); // Add type annotation for ratingValue
  const [ratingUser, setRatingUser] = useState<number | null>(); // Add type annotation for ratingUser
  const [dataNovel, setDataNovel] = useState<DataCardNovel | null>(null);
  // const { setId } = useChapter();

  const handleRatingChange = (
    event: React.ChangeEvent<{}>,
    newValue: number | null
  ) => {
    // Add type annotations for event and newValue
    setRatingValue(newValue);
  };

  // console.log(ratingUser)

  // console.log(_id)

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `http://localhost:3001/api/novels/${_id}`,
    fetcher
  );
  
  // console.log(data)
  useEffect(() => {
    if (data && _id) {
      setDataNovel(data);
      // setId(data._id)
    }
  }, [data]);

  // console.log(data?.data[0].attributes);

  if (error) return <div>Failed to load</div>;
  if (!data) return <Loading />;

  console.log(dataNovel);

  return (
    <div>
      <nav>
        <div className="relative z-[200] h-[50px] md:h-[60px] ">
          <NavBar position={"fixed"} />
        </div>
      </nav>
      <main>
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
                      <div>
                        <h1 className="text-xl font-bold">{dataNovel?.name}</h1>
                        <p>
                          by: gg{" "}
                          {/*{dataNovel?.user.data?.attributes?.username}*/}
                        </p>{" "}
                        {/* Display author */}
                        <p className="text-sm">{dataNovel?.detail}</p>
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
                              <h3 className="chapter-title">
                                {chapter?.name}
                              </h3>{" "}
                            </Link>
                          ))
                        ) : (
                          <div className="text-center text-gray-500 mt-4 text-2xl">
                            ไม่มีตอน
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="review mt-6 min-h-[300px]">
                      <div className="total-review h-[300px]">
                        <div className="h-full flex flex-col justify-center items-center">
                          <Rating
                            name="controlled-rating"
                            value={ratingUser}
                            onChange={handleRatingChange}
                            precision={0.5}
                            readOnly
                          />
                          <p className="text-sm">
                            Current Rating: {ratingUser}
                          </p>
                        </div>
                      </div>
                      <div className="review-user mt-4">
                        {/* {dt.rating.map((rat, index) => (
                          <div className="review-user mt-4" key={index}>
                            {console.log(index)}
                            <div className="mb-4">
                              <Rating
                                name={`controlled-rating-${index}`}
                                value={rat} // Assuming dt.rating is an average rating
                                readOnly
                                precision={0.5}
                              />
                              <p className="text-sm">Average Rating: {rat}</p>
                            </div>
                          </div>
                        ))} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </main>
    </div>
  );
}

export default DetailNovel;
