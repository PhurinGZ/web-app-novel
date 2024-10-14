// components/Category.js

import useSWR from "swr";

const Category = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data: category, error: categoryError } = useSWR(
    `http://localhost:1337/api/categories`,
    fetcher
  );

  // console.log(category);

  return (
    <div className="absolute inset-0 mt-10 flex justify-center w-full">
      <div
        className="relative mt-2 w-full max-w-5xl p-2 bg-white h-screen sm:h-screen  md:bg-transparent "
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        <div
          className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 xl:bg-white md:bg-white rounded-md md:shadow-lg "
          role="none"
        >
          {category?.data?.map((c) => (
            <a
              key={c.id}
              href={`/category/${c.attributes.name}`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <p className="text-base">{c.attributes.name}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
