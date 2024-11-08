// components/Category.tsx

import useSWR from "swr";
import Skeleton from "./skeleton"

const Category = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data: category, error: categoryError, isLoading } = useSWR(
    `/api/categories`,
    fetcher
  );

  return (
    <div className="absolute inset-0 mt-10 flex justify-center w-full">
      <div
        className="relative mt-2 w-full max-w-5xl p-2 bg-white h-screen sm:h-screen md:bg-transparent"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        <div
          className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 xl:bg-white md:bg-white rounded-md md:shadow-lg"
          role="none"
        >
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Skeleton className="w-24 h-6 mb-2" />
                  <Skeleton className="w-full h-6" />
                </div>
              ))
            : category?.data?.map((c) => (
                <a
                  key={c.id}
                  href={`/category/${c.name}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  <p className="text-base">{c.name}</p>
                </a>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Category;