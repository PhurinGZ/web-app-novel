import React from "react";
import SearchBar from "./serchBar";
import DropdownSort from "./dropdownSort";
import DropdownFillter from "./dropdownFillter";
import BookCard from "./BookCard";
import dataWhriter from "@/data/dataWhriter";

function bookWhiter() {
  return (
    <div className="flex flex-col ">
      <div className="flex flex-col md:flex-row md:items-center w-full md:mr-4 mb-4 md:mb-0">
        <div className="mr-0 md:mr-4 mb-4 md:mb-0 w-full">
          <SearchBar />
        </div>
        <div className="mr-0 md:mr-4 md:w-48">
          <DropdownSort />
        </div>
        <div className="md:w-48">
          <DropdownFillter />
        </div>
      </div>
      <div >
        {dataWhriter.map((d) => (
          <BookCard
            key={d.id}
            id={d.id}
            name={d.name}
            updateDate={d.updateDate}
            episodeCount={d.episodeCount}
            status={d.status}
            views={d.views}
            bookshelfCount={d.bookshelfCount}
            commentCount={d.commentCount}
            image={d.image}
          />
        ))}
      </div>
    </div>
  );
}

export default bookWhiter;
