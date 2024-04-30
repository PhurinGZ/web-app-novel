import React, { useState, ChangeEvent, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import novelContent from "../../data/dataContent";
import NavBar from "../navbar/navbar";
import dataCardNovel from "@/data/data";
import Footer from "../footer/footer";

interface Chapter {
  id: number;
  name: string;
  content: string;
}

function ReadNovel() {
  const { _id } = useParams<{ _id: string }>(); // Access _id from URL
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [dataNovel, setDataNovel] = useState<any>();

  useEffect(() => {
    // Convert _id to a number and set currentChapterIndex
    const id = parseInt(_id);
    if (!isNaN(id) && id >= 0 && id < novelContent.length) {
      setCurrentChapterIndex(id);
    }
  }, [_id]);

  const handlePreviousChapter = () => {
    setCurrentChapterIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextChapter = () => {
    setCurrentChapterIndex((prevIndex) =>
      Math.min(prevIndex + 1, novelContent.length - 1)
    );
  };

  const handleChapterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentChapterIndex(parseInt(e.target.value));
  };

  // Get the content of the current chapter
  const currentChapterContent: string =
    novelContent[currentChapterIndex]?.content || "";

  return (
    <div>
      <nav>
        <NavBar position={"relative"} />
      </nav>
      <main>
        <div className="bg-gray-200 ">
          <div className="container mx-auto px-4 py-8 items-center w-full lg:w-[898px] ">
            <div className="flex justify-between  bg-white rounded-t-lg p-3 border-b sticky top-0">
              <div className="relative">
                <select
                  value={currentChapterIndex}
                  onChange={handleChapterChange}
                  className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                >
                  {novelContent.map((chapter: Chapter, index: number) => (
                    <option key={chapter.id} value={index}>
                      {chapter.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.293 5.293a1 1 0 011.414 0L12 9.586V3a1 1 0 112 0v6.586l4.293-4.293a1 1 0 111.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex">
                <button
                  onClick={handlePreviousChapter}
                  disabled={currentChapterIndex === 0}
                  className={`${
                    currentChapterIndex === 0
                      ? "bg-gray-300 cursor-not-allowed opacity-50"
                      : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextChapter}
                  disabled={currentChapterIndex === novelContent.length - 1}
                  className={`${
                    currentChapterIndex === novelContent.length - 1
                      ? "bg-gray-300 cursor-not-allowed opacity-50"
                      : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
            <div className="bg-white shadow-md p-6 rounded-b-lg min-h-screen">
              {/* Display novel content */}
              <pre className="whitespace-pre-line text-lg">
                {currentChapterContent}
              </pre>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ReadNovel;
