import { Button, Select, SelectItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface DropdownProps {
  novelId: string; // Updated type
  id: String;
}

const Dropdown = ({ novelId, id }: DropdownProps) => {
  const router = useRouter();
  const [selectedChapterId, setSelectedChapterId] = useState(id);
  const [dataDrop, setDataDrop] = useState<any[]>([]);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `http://localhost:3001/api/novels/${novelId}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      console.log("Data received:", data);
      if (data.chapters) {
        setDataDrop(data?.chapters);
      }
    }
  }, [data]);

  console.log(dataDrop);

  if (error) return <div>Error loading data</div>;
  if (!data) return <div>Loading...</div>;

  const currentChapterIndex = dataDrop.findIndex(
    (chapter) => chapter._id === selectedChapterId
  );
  const isPreviousDisabled = currentChapterIndex <= 0;
  const isNextDisabled = currentChapterIndex >= dataDrop.length - 1;

  const handleSelectChange = (value: string) => {
    const selected = dataDrop[currentChapterIndex]
    setSelectedChapterId(selected._id);
    router.push(`/chapter/${value}`);
    console.log(selected._id)
  };

  const handlePrevious = () => {
    if (!isPreviousDisabled) {
      const previousChapter = dataDrop[currentChapterIndex - 1];
      setSelectedChapterId(previousChapter._id);
      router.push(`/chapter/${previousChapter._id}`);
    }
  };

  const handleNext = () => {
    if (!isNextDisabled) {
      const nextChapter = dataDrop[currentChapterIndex + 1];
      setSelectedChapterId(nextChapter._id);
      router.push(`/chapter/${nextChapter._id}`);
    }
  };

  return (
    <div className="bg-white rounded-t-lg p-3 border-b sticky top-0 z-10 h-18">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-auto mb-2 md:mb-0">
          <Select
            label="Chapter"
            placeholder="Select chapter"
            className="w-full md:w-96"
            selectedKeys={[selectedChapterId]}
            disabledKeys={[selectedChapterId]}
            onChange={e => handleSelectChange(e.target.value)}
            size="sm"
          >
            {dataDrop.map((chapter) => (
              <SelectItem key={chapter._id} value={chapter._id}>
                {chapter.name}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex w-full md:w-auto justify-between md:justify-end space-x-2">
          <Button
            onClick={handlePrevious}
            disabled={isPreviousDisabled}
            className="w-full md:w-auto"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={isNextDisabled}
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
