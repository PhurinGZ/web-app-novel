// components/readNovel/readNovel.tsx
import React, { useState, useEffect } from "react";
import NavBar from "@/components/navbar/navbar";
import Footer from "../footer/footer";
import useSWR, { mutate } from "swr";
import Dropdown from "./dropdown";
import Loading from "@/components/loading/loading";
import Comments from "@/components/readNovel/comments/comments";

interface Chapter {
  id: string;
  name: string;
  content: string[];
  novel?: {
    _id: string;
    authorId: string;  // Add this field
  };
}

function ReadNovel({ _id }) {
  const [dataNovel, setDataNovel] = useState<any>(null);
  const [name, setName] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null); // Add this state for current user

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `http://localhost:3001/api/chapters/${_id}`,
    fetcher
  );
  const { 
    data: comments, 
    error: commentsError, 
    mutate: mutateComments 
  } = useSWR(`/api/comments/${_id}`, fetcher);

  // Fetch current user data
  const { data: userData } = useSWR('/api/auth/me', fetcher);

  useEffect(() => {
    if (data) {
      setDataNovel(data);
      setName(data.name);
    }
  }, [data]);

  useEffect(() => {
    if (userData) {
      setCurrentUser(userData);
    }
  }, [userData]);

  const handleNewComment = async (text: string) => {
    try {
      const response = await fetch(`/api/comments/${_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text,
          isAuthor: currentUser?._id === dataNovel?.novel?.createdBy // Add isAuthor flag
        }),
      });

      if (response.ok) {
        mutateComments();
      } else {
        console.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // Process comments to add isAuthor flag
  const processedComments = comments?.map(comment => ({
    ...comment,
    user: {
      ...comment.user,
      isAuthor: comment.user?._id === dataNovel?.novel?.createdBy
    }
    
  }));

  console.log(dataNovel)

  if (error) return <div>Error loading content</div>;

  return (
    <div>
      <head>{dataNovel?.name && <title>{dataNovel.name}</title>}</head>
      {!data ? (
        <Loading />
      ) : (
        <main>
          <div className="bg-gray-200">
            <div className="container mx-auto px-4 py-8 items-center w-full lg:w-[898px]">
              {name && dataNovel.novel && (
                <Dropdown novelId={dataNovel.novel._id} id={dataNovel._id} />
              )}
              <div className="bg-white shadow-md p-6 rounded-lg min-h-screen">
                <pre className="whitespace-pre-line text-lg">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: dataNovel?.content || "",
                    }}
                  />
                </pre>
              </div>
              
              {/* Comments Section */}
              <Comments 
                chapterId={_id}
                comments={processedComments || []}
                isLoading={!comments && !commentsError}
                onNewComment={handleNewComment}
                isAuthenticated={!!currentUser} // Use actual user auth state
              />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default ReadNovel;