//component/whriterPage/taps.tsx
import { useState } from "react";
import Image from "next/image";
import BookWhiter from "./bookWhiter";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="">
      <div className="flex relative ml-4">
        <button
          className={`py-2 px-4 relative z-10 ${
            activeTab === 0 ? "text-[#F5A524]" : "text-gray-500"
          }`}
          onClick={() => handleTabClick(0)}
        >
          ผลงาน
          {activeTab === 0 && (
            <span
              className="absolute bottom-0 left-0 bg-[#F5A524] h-1 w-full"
              aria-hidden="true"
            />
          )}
        </button>
        <button
          className={`py-2 px-4 relative z-10 ${
            activeTab === 1 ? "text-[#F5A524]" : "text-gray-500"
          } cursor-not-allowed`}
          // onClick={() => handleTabClick(1)}
        >
          ยอดขาย
          {activeTab === 1 && (
            <span
              className="absolute bottom-0 left-0 bg-[#F5A524] h-1 w-full "
              aria-hidden="true"
            />
          )}
        </button>
      </div>
      <section>
        <div className="">
          <div className="p-4 ">
            {activeTab === 0 && (
              <section>
                <div>
                  <div className="flex flex-col md:flex-wrap md:flex-row ">
                    <div className="flex space-x-7 border-solid border-2 border-gray-300 rounded-lg items-center p-4 h-fit mr-8 mb-8">
                      <div className="flex items-center ">
                        <Image
                          src={"/icon/view.svg"}
                          height={100}
                          width={100}
                          alt="view"
                          className="max-w-8 max-h-8 mr-2"
                        />
                        <span className="text-2xl font-bold ">ยอดดู</span>
                      </div>
                      <div>
                        <span className="text-2xl text-[#F5A524]">99999</span>
                      </div>
                    </div>
                    <div className="flex space-x-7 border-solid border-2 border-gray-300 rounded-lg items-center p-4 h-fit mr-8 mb-8">
                      <div className="flex items-center ">
                        <Image
                          src={"/icon/like.svg"}
                          height={100}
                          width={100}
                          alt="like"
                          className="max-w-8 max-h-8 mr-2"
                        />
                        <span className="text-2xl font-bold ">ไลค์</span>
                      </div>
                      <div>
                        <span className="text-2xl text-[#F5A524]">99999</span>
                      </div>
                    </div>
                    <div className="flex space-x-7 border-solid border-2 border-gray-300 rounded-lg  items-center p-4 h-fit mr-8 mb-8">
                      <div className="flex items-center ">
                        <Image
                          src={"/icon/bookshelf.svg"}
                          height={100}
                          width={100}
                          alt="bookshelf"
                          className="max-w-8 max-h-8 mr-2"
                        />
                        <span className="text-2xl font-bold ">ชั้นหนังสือ</span>
                      </div>
                      <div>
                        <span className="text-2xl text-[#F5A524]">99999</span>
                      </div>
                    </div>
                    <div className="flex space-x-7 border-solid border-2 border-gray-300 rounded-lg  items-center p-4 h-fit mr-8 mb-8">
                      <div className="flex items-center ">
                        <Image
                          src={"/icon/comment.svg"}
                          height={100}
                          width={100}
                          alt="comment"
                          className="max-w-8 max-h-8 mr-2"
                        />
                        <span className="text-2xl font-bold ">คอมมเมนต์</span>
                      </div>
                      <div>
                        <span className="text-2xl text-[#F5A524]">99999</span>
                      </div>
                    </div>
                  </div>
                </div>
                <BookWhiter />
              </section>
            )}
            {activeTab === 1 && (
              <div>
                <p className="text-lg font-semibold mb-2">Content of Tab 2</p>
                <p className="text-gray-600">
                  This is the content of Tab 2. You can add any content here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tabs;
