import React, { useEffect, useState } from "react";
import Navber from "@/components/navbar/navbar";
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
    <>
      <div>
        <div className="container px-10 pb-32 sm:px-10 md:px-10 lg:px-0 mt-4">
          <h1 className="text-2xl font-bold md:ml-6">หมวดหมู่: {data?.name}</h1>
          {data?.novels?.map((n) => (
            <Link
              key={n._id}
              className="mt-4 md:m-8 flex"
              href={`/book/${n._id}`}
            >
              <Image
                src="/image/imageBook1.png"
                width={100}
                height={100}
                alt="Book cover"
                className="w-36 h-36 object-cover rounded-lg"
              />
              <div className="ml-4">
                <h1 className="font-bold text-lg">{n.name}</h1>
                <p className="text-gray-600">
                {data?.name} · {n.rate.name}
                </p>
                {/* <p className="text-gray-800">{n.desc}</p> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default CategoryPage;
