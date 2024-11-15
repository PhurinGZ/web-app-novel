import React from "react";
import { Button } from "@nextui-org/react";
import { PenSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  chapterId: string;
  novelId: string;
  isAuthor: boolean;
}

const EditChapterButton = ({ chapterId, novelId, isAuthor }: Props) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/chapter/${chapterId}/edit`);
  };

  if (!isAuthor) return null;

  return (
    <Button
      onClick={handleEdit}
      variant="bordered"
      size="sm"
      className="bg-blue-50 text-blue-600"
      startContent={<PenSquare className="w-4 h-4" />}
    >
      แก้ไขตอน
    </Button>
  );
};

export default EditChapterButton;
