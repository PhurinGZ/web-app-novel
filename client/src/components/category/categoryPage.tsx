import React from "react";
import Navber from "@/components/navbar/navbar";
import Footer from "../footer/footer";
import useSWR from "swr";
import Loading from "../loading/loading";
import Image from "next/image";
import NotFound404 from "../notFound/404NotFound";
import { Link } from "@nextui-org/react";

function CategoryPage({ name }) {
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data: novelData, error: novelError } = useSWR(
    "http://localhost:1337/api/novels?populate=*",
    fetcher
  );

  const { data: category, error: categoryError } = useSWR(
    `http://localhost:1337/api/categories?filters[name][$eq]=${name}&populate=*`,
    fetcher
  );

  //   console.log(novelData);

  if (category?.data.length === 0) return <NotFound404 />;

  if (!novelData) return <Loading />;
  if (novelError) return <div>{novelError.message}</div>;

  // console.log(category?.data.length === 0)
  //   console.log(category.data[0].attributes.nameThai);

  return (
    <>
      <nav className="relative z-[200] h-[50px] md:h-[60px]">
        <Navber position={"fixed"} />
      </nav>
      <main>
        <div className="container px-10 pb-32 sm:px-10 md:px-10 lg:px-0 mt-4">
          <h1 className="text-2xl font-bold md:ml-6">
            หมวดหมู่: {category?.data[0].attributes.nameThai}
          </h1>
          {novelData?.data.map((n) => {
            if (n.attributes.category.data.attributes.name === name) {
              return (
                <Link key={n.id} className="mt-4 md:m-8 flex" href={`/book/${n.attributes.name}`}>
                  <Image
                    src="/image/imageBook1.png"
                    width={100}
                    height={100}
                    alt="Book cover"
                  />
                  <div className="ml-4">
                    <h1 className="font-bold text-lg">{n.attributes.name}</h1>
                    <p className="text-gray-600">
                      {n.attributes.category.data.attributes.name} ·{" "}
                      {n.attributes.rate.data.attributes.name}
                    </p>
                    {/* <p className="text-gray-800">{n.desc}</p> */}
                  </div>
                </Link>
              );
            }
            return null;
          })}
        </div>
      </main>
    </>
  );
}

export default CategoryPage;
