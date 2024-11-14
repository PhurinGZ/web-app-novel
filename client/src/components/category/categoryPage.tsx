//component/categoryPage.tsx
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "../footer/footer";
import useSWR from "swr";
import Loading from "../loading/loading";
import Image from "next/image";
import NotFound404 from "../notFound/404NotFound";
import { Link } from "@nextui-org/react";

function CategoryPage({ name }) {
  const [data, setData] = useState();

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data: category, error: categoryError } = useSWR(
    `/api/categories/${name}`,
    fetcher
  );

  useEffect(() => {
    if (category) {
      setData(category.data);
    }
  }, [category]);

  if (category?.success === "false") return <NotFound404 />;
  if (!category) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
            หมวดหมู่: {data?.name}
          </h1>

          {data && data.novels && data.novels.length > 0 ? (
            <div className="space-y-6">
              {data.novels.map((novel) => (
                <Link
                  key={novel._id}
                  href={`/book/${novel._id}`}
                  className="flex items-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Assuming each novel has an image URL */}
                  <Image
                    src={novel.image || "/image/imageBook1.png"}
                    width={100}
                    height={100}
                    alt="Book cover"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {novel.name}
                    </h2>
                    <p className="text-gray-600">
                      {data?.name} · {novel?.rate?.name || "No Rating"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              ไม่มีนิยายในหมวดหมู่นี้
            </div>
          )}
        </div>

        {/* Filter Sidebar (for future use) */}
        <aside className="w-full lg:w-1/4 bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">ตัวกรอง</h2>
          <div className="space-y-4">
            {/* Placeholder for future sorting/filter options */}
            <div>
              <label className="block text-gray-600">จัดเรียงตาม</label>
              <select className="w-full mt-1 p-2 border rounded-md">
                <option>เทรนดิ้ง</option>
                <option>ล่าสุด</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600">เรตติ้ง</label>
              <select className="w-full mt-1 p-2 border rounded-md">
                <option>18+</option>
                <option>25+</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600">สถานะ</label>
              <select className="w-full mt-1 p-2 border rounded-md">
                <option>จบแล้ว</option>
                <option>อ่านฟรี</option>
              </select>
            </div>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}

export default CategoryPage;
