import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

// Create a context for managing chapter data and navigation
const ChapterContext = createContext();

// Provider component to wrap the Dropdown component and provide context values
export const ChapterProvider = ({ children }) => {
  const router = useRouter();
  const [dataDrop, setDataDrop] = useState([]);
  
//   const [currentChapterIndex, setCurrentChapterIndex] = useState(() => {
//     // Retrieve currentChapterIndex from localStorage if available, otherwise default to 0
//     return localStorage.getItem("currentChapterIndex")
//       ? parseInt(localStorage.getItem("currentChapterIndex"))
//       : 0;
//   });
  const [name, setName] = useState();

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `http://localhost:1337/api/novels?filters[name][$eq]=${name}&populate=*`,
    fetcher
  );

  console.log(dataDrop)

  useEffect(() => {
    if (data) {
      setDataDrop(data?.data[0]?.attributes?.chapters.data);
    }
  }, [data]);

 

  // useEffect(() => {
  //   // Store currentChapterIndex in localStorage whenever it changes
  //   // localStorage.setItem("currentChapterIndex", currentChapterIndex.toString());
  // }, [currentChapterIndex]);

  // if (!data) return <div>Loading...</div>;

  return (
    <ChapterContext.Provider
      value={{
        dataDrop,
        setName
      }}
    >
      {children}
    </ChapterContext.Provider>
  );
};

// Custom hook to consume the ChapterContext
export const useChapter = () => useContext(ChapterContext);
