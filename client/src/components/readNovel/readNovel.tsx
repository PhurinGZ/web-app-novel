import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Select } from "@nextui-org/react";
import Loading from "@/components/loading/loading";
import Comments from "@/components/readNovel/comments/comments";
import EditChapterButton from "./editChapterButton";
import Dropdown from "./dropdown";
import { processNovelContent } from "./contentProcessor";

const ReadNovel = ({ _id }) => {
  const [dataNovel, setDataNovel] = useState(null);
  const [name, setName] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `http://localhost:3001/api/chapters/${_id}`,
    fetcher
  );
  const {
    data: comments,
    error: commentsError,
    mutate: mutateComments,
  } = useSWR(`/api/comments/${_id}`, fetcher);
  const { data: userData } = useSWR("/api/auth/me", fetcher);

  useEffect(() => {
    if (data) {
      setDataNovel(data);
      setName(data.name);
    }
  }, [data]);

  console.log(dataNovel?.content);

  useEffect(() => {
    if (userData) {
      setCurrentUser(userData);
    }
  }, [userData]);

  const handleNewComment = async (text) => {
    try {
      const response = await fetch(`/api/comments/${_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          isAuthor: currentUser?.user?.id === dataNovel?.novel?.createdBy,
        }),
      });

      if (response.ok) {
        mutateComments();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const processedComments = comments?.map((comment) => ({
    ...comment,
    user: {
      ...comment.user,
      isAuthor: comment.user?._id === dataNovel?.novel?.createdBy,
    },
  }));

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Error loading content. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {dataNovel?.name && (
        <head>
          <title>{dataNovel.name}</title>
        </head>
      )}

      {!data ? (
        <Loading />
      ) : (
        <main className="pb-16">
          <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="container mx-auto px-4 py-3">
              <div className="max-w-4xl mx-auto">
                {name && dataNovel.novel && (
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <Dropdown
                        novelId={dataNovel.novel._id}
                        id={dataNovel._id}
                      />
                    </div>
                    <EditChapterButton
                      chapterId={_id}
                      novelId={dataNovel.novel._id}
                      isAuthor={
                        currentUser?.user?.id === dataNovel?.novel?.createdBy
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-8">
                  <h1 className="text-2xl font-semibold mb-6">
                    {dataNovel?.name}
                  </h1>
                  <div
                    className="prose prose-neutral max-w-full break-words overflow-hidden whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: dataNovel?.content }}
                  />
                </div>
              </div>

              <div className="mt-8">
                <Comments
                  chapterId={_id}
                  comments={processedComments || []}
                  isLoading={!comments && !commentsError}
                  onNewComment={handleNewComment}
                  isAuthenticated={!!currentUser}
                />
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default ReadNovel;
