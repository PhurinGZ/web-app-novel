import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
  image: string;
  name: string;
  updateDate: string;
  episodeCount: number;
  status: string;
  views: number;
  bookshelfCount: number;
  commentCount: number;
}

function BookCard({
  id,
  name,
  updateDate,
  episodeCount,
  status,
  views,
  bookshelfCount,
  commentCount,
  image,
}: Props) {
  const router = useRouter()

  // console.log(id)
  return (
    <div className="w-full ">
      <div className="mt-4 border border-gray-300 rounded-md p-4 md:border-0 flex  flex-col md:flex-row md:justify-between">
        <Link href={"#"} className="flex w-full md:1/2">
          <div className="mr-4 h-fit">
            <Image
              src={"/image/imageBook1.png"}
              height={50}
              width={50}
              alt="book_cover"
              className="w-full h-24"
            />
          </div>
          <div>
            <div>
              <span className="text-lg font-bold">{name}</span>
            </div>
            <div className="text-sm text-gray-600 flex flex-col ">
              <span>
                อัปเดตล่าสุด <span>{updateDate}</span>
              </span>
              <span className="">เผยแพร่ไปแล้ว : {episodeCount}</span>
              <span className="">
                สถานะเรื่อง : <span>{status}</span>
              </span>
            </div>
          </div>
        </Link>
        <div className="flex md:justify-between flex-col md:flex-row ">
          <div className="mt-3 flex items-center md:mr-24  ">
            <div className="mr-2">
              <div className="flex md:w-16">
                <Image
                  src={"/icon/view.svg"}
                  width={15}
                  height={15}
                  alt="view"
                  className="mr-2"
                />

                <span className="text-sm">ยอดดู</span>
              </div>
              <span className="ml-1">{views}</span>
            </div>
            <div className="border-l-2 border-gray-300 pl-2 mr-2">
              <div className="flex md:w-24">
                <Image
                  src={"/icon/bookshelf.svg"}
                  width={15}
                  height={15}
                  alt="bookshelf"
                  className="mr-2"
                />

                <span className="text-sm">ชั้นหนังสือ</span>
              </div>
              <span className="ml-1">{bookshelfCount}</span>
            </div>
            <div className=" border-l-2 border-gray-300 pl-2">
              <div className="flex md:w-24">
                <Image
                  src={"/icon/comment.svg"}
                  width={15}
                  height={15}
                  alt="comment"
                  className="mr-2"
                />

                <span className="text-sm">ความคิดเห็น</span>
              </div>
              <span className="ml-1">{commentCount}</span>
            </div>
          </div>
          <div className="flex items-end justify-end mt-4 md:ml-8">
            <Button color="warning" size="sm" className="mr-2" onClick={() => router.push(`/book/${id}`)}>
              <Image src={"/icon/edit.svg"} width={15} height={15} alt="edit" />
            </Button>
            <Button color="danger" size="sm" className="mr-2">
              <Image
                src={"/icon/delete.svg"}
                width={15}
                height={15}
                alt="delete"
              />
            </Button>
            <Button color="primary" size="sm">
              <Image
                src={"/icon/share.svg"}
                width={15}
                height={15}
                alt="share"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
