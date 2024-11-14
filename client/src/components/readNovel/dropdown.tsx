import React from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectItem, Button } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useSWR from "swr";

const Dropdown = ({ novelId, id }) => {
  const router = useRouter();
  const [selectedChapterId, setSelectedChapterId] = React.useState(id);
  const [chapters, setChapters] = React.useState([]);
  
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `http://localhost:3001/api/novels/${novelId}`,
    fetcher
  );

  React.useEffect(() => {
    if (data?.chapters) {
      setChapters(data.chapters);
    }
  }, [data]);

  const currentIndex = chapters.findIndex(
    (chapter) => chapter._id === selectedChapterId
  );

  const handleChapterChange = (value) => {
    setSelectedChapterId(value);
    router.push(`/chapter/${value}`);
  };

  const handleNavigation = (direction) => {
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < chapters.length) {
      const targetChapter = chapters[newIndex];
      setSelectedChapterId(targetChapter._id);
      router.push(`/chapter/${targetChapter._id}`);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
        Error loading chapters
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
      <div className="flex-1 min-w-0">
        <Select
          label="Chapter"
          placeholder="Select chapter"
          selectedKeys={[selectedChapterId]}
          disabledKeys={[selectedChapterId]}
          onChange={(e) => handleChapterChange(e.target.value)}
          className="w-full"
          size="sm"
          variant="bordered"
        >
          {chapters.map((chapter) => (
            <SelectItem 
              key={chapter._id} 
              value={chapter._id}
              className="py-2 px-3"
            >
              {chapter.name}
            </SelectItem>
          ))}
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="bordered"
          size="sm"
          onClick={() => handleNavigation('prev')}
          isDisabled={currentIndex <= 0}
          className="min-w-[100px]"
          startContent={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>
        <Button
          variant="bordered"
          size="sm"
          onClick={() => handleNavigation('next')}
          isDisabled={currentIndex >= chapters.length - 1}
          className="min-w-[100px]"
          endContent={<ChevronRight className="w-4 h-4" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Dropdown;