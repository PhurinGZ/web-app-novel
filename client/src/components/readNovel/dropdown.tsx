//dropdown.tsx
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useChapter } from "@/context/dropdownReadNovelProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Dropdown = ({ name, id }) => {
  const { dataDrop, setName } = useChapter();
  const router = useRouter();

  // Initialize currentChapterIndex based on the provided id prop
  useEffect(() => {
    if (dataDrop && id) {
      const index = dataDrop.findIndex((chapter) => chapter.id === id);
      setCurrentChapterIndex(index !== -1 ? index : 0);
    }
  }, [id, dataDrop]);

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  const handleChapterChange = (index) => {
    if (dataDrop) {
      const chapterId = parseInt(index);
      router.push(`/chapter/${chapterId}`);
    }
  };

  const handlePreviousChapter = () => {
    const prevIndex = currentChapterIndex - 1;
    setCurrentChapterIndex(prevIndex);
    if (prevIndex >= 0 && dataDrop[prevIndex]) {
      const prevId = dataDrop[prevIndex].id;
      router.push(`/chapter/${prevId}`);
    }
  };

  const handleNextChapter = () => {
    const nextIndex = currentChapterIndex + 1;
    setCurrentChapterIndex(nextIndex);
    if (nextIndex < dataDrop.length && dataDrop[nextIndex]) {
      const nextId = dataDrop[nextIndex].id;
      router.push(`/chapter/${nextId}`);
    }
  };

  useEffect(() => {
    if (name) {
      setName(name);
    }
  });

  // Render the component
  return (
    <div className="bg-white rounded-t-lg p-3 border-b sticky top-0 z-10 h-18">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-auto mb-2 md:mb-0">
          {dataDrop && (
            <Select
              label="Chapter"
              placeholder="Select chapter"
              className="w-full md:w-96"
              value={id}
              onChange={(e) => handleChapterChange(parseInt(e.target.value))}
              selectedKeys={[id]}
              size="sm"
            >
              {dataDrop.map((chapter, index) => (
                <SelectItem
                  key={chapter.id}
                  value={index}
                  style={{
                    backgroundColor: chapter.id === id ? "orange" : "white",
                    cursor: chapter.id === id ? "context-menu" : "pointer",
                  }}
                >
                  {chapter.attributes.name}
                </SelectItem>
              ))}
            </Select>
          )}
        </div>
        <div className="flex w-full md:w-auto justify-between md:justify-end space-x-2">
          <Button
            onClick={handlePreviousChapter}
            disabled={currentChapterIndex === 0}
            style={{
              background: currentChapterIndex === 0 ? "#e5e7eb" : "",
              cursor: currentChapterIndex === 0 ? "not-allowed" : "pointer",
            }}
            className="w-full md:w-auto"
          >
            Previous
          </Button>
          <Button
            onClick={handleNextChapter}
            disabled={currentChapterIndex === dataDrop?.length - 1}
            style={{
              background:
                currentChapterIndex === dataDrop?.length - 1 ? "#e5e7eb" : "",
              cursor:
                currentChapterIndex === dataDrop?.length - 1
                  ? "not-allowed"
                  : "pointer",
            }}
            className="w-full md:w-auto"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
