import React from "react";
import { useRouter } from "next/navigation";
import { Select, SelectItem, Button } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useSWR from "swr";

interface Props {
  novelId: string;
  id: string;
}

const Dropdown = ({ novelId, id }: Props) => {
  const router = useRouter();
  const [selectedChapterId, setSelectedChapterId] = React.useState(id);
  const [chapters, setChapters] = React.useState([]);

  const fetcher = (url: string | URL | Request) =>
    fetch(url).then((res) => res.json());
  const { data, error } = useSWR(`/api/novels/${novelId}`, fetcher);

  React.useEffect(() => {
    if (data?.novel?.chapters) {
      setChapters(data.novel.chapters);
    }
  }, [data]);

  const currentIndex = chapters.findIndex(
    (chapter: { _id: any }) => chapter._id === selectedChapterId
  );

  const handleChapterChange = (value: React.SetStateAction<string>) => {
    setSelectedChapterId(value);
    router.push(`/chapter/${value}`);
  };

  const handleNavigation = (direction: string) => {
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < chapters.length) {
      const targetChapter: { _id: any } = chapters[newIndex];
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
    <div className="w-full space-y-4 md:space-y-0">
      {/* Navigation Buttons for Mobile - Top */}
      <div className="flex justify-between gap-2 md:hidden">
        <Button
          variant="bordered"
          size="sm"
          onClick={() => handleNavigation("prev")}
          isDisabled={currentIndex <= 0}
          className="flex-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden xs:inline ml-1">Previous</span>
        </Button>
        <Button
          variant="bordered"
          size="sm"
          onClick={() => handleNavigation("next")}
          isDisabled={currentIndex >= chapters.length - 1}
          className="flex-1"
        >
          <span className="hidden xs:inline mr-1">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Dropdown */}
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
            {chapters.map((chapter: { _id: string; name: string }) => (
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

        {/* Navigation Buttons for Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="bordered"
            size="sm"
            onClick={() => handleNavigation("prev")}
            isDisabled={currentIndex <= 0}
            className="min-w-[100px]"
            startContent={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>
          <Button
            variant="bordered"
            size="sm"
            onClick={() => handleNavigation("next")}
            isDisabled={currentIndex >= chapters.length - 1}
            className="min-w-[100px]"
            endContent={<ChevronRight className="w-4 h-4" />}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;