import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import Image from "next/image";
import { Link } from "@nextui-org/react";
import useSWR from "swr";
import Loading from "@/components/loading/loading";
import {
  HeartIcon,
  BookmarkIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
    _id: string;
    username: string;
  };
}

function DetailNovel({ _id }: Props): JSX.Element {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [dataNovel, setDataNovel] = useState<DataCardNovel | null>(null);
  const [isOwner, setIsOwner] = useState(false);
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

  // Check if current user is the owner
  useEffect(() => {
    if (session?.user?.id && dataNovel?.createdBy?._id) {
      setIsOwner(session.user.id === dataNovel.createdBy._id);
    }
  }, [session, dataNovel]);

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
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleEdit = () => {
    router.push(`/novel/edit/${dataNovel?._id}`);
  };

  const handleAddChapter = () => {
    router.push(`/novel/${dataNovel?._id}/add-chapter`);
  };

  if (error) return <div>Failed to load</div>;
  if (!data) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Detail Novel</h1>
                {isOwner && (
                  <div className="flex gap-4">
                    <button
                      onClick={handleEdit}
                      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Edit Novel
                    </button>
                    <button
                      onClick={handleAddChapter}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      Add Chapter
                    </button>
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-col md:flex-row items-start md:items-center mt-4 space-y-4 md:space-y-0 md:space-x-4">
                  <Image
                    src={"/image/imageBook1.png"}
                    alt=""
                    className="max-w-24 max-h-32 object-cover rounded-md"
                    width={100}
                    height={100}
                  />
                  <div className="flex-grow">
                    <h1 className="text-xl font-bold">{dataNovel?.name}</h1>
                    {dataNovel?.createdBy?.username ? (
                      <p className="text-gray-600">
                        by: {dataNovel.createdBy.username}
                      </p>
                    ) : (
                      <p className="text-gray-600">Author unknown</p>
                    )}
                    <p className="text-sm mt-2">{dataNovel?.detail}</p>
                    {dataNovel?.status && (
                      <span
                        className={`mt-2 inline-block px-2 py-1 text-sm rounded ${
                          dataNovel.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : dataNovel.status === "ongoing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {dataNovel.status.charAt(0).toUpperCase() +
                          dataNovel.status.slice(1)}
                      </span>
                    )}
                  </div>

                  <div className="flex md:justify-end space-x-4 md:self-start">
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

                <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Chapters</h2>
                    {isOwner && (
                      <button
                        onClick={handleAddChapter}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        + Add New Chapter
                      </button>
                    )}
                  </div>
                  <div className="mt-2 space-y-2">
                    {dataNovel?.chapters?.length ? (
                      dataNovel.chapters.map((chapter, index) => (
                        <Link
                          href={`/chapter/${chapter._id}`}
                          key={index}
                          className="block p-3 bg-white hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <h3 className="text-gray-800 hover:text-blue-600">
                            {chapter?.name}
                          </h3>
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
                  <div className="mt-6">
                    <Comment novelId={dataNovel._id} />
                  </div>
                ) : (
                  <div>Error loading reviews</div>
                )}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default DetailNovel;
