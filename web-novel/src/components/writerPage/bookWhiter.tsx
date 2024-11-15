// components/writerPage/BookWriter.tsx
import React, { useState, useEffect } from "react";
import SearchBar from "./serchBar";
import DropdownSort from "./dropdownSort";
import DropdownFilter from "./dropdownFillter";
import BookCard from "./BookCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Changed from next/router to next/navigation

interface Book {
  id: string;
  name: string;
  updateDate: string;
  episodeCount: number;
  status: string;
  views: number;
  bookshelfCount: number;
  commentCount: number;
  image: string;
}

export default function BookWriter() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/membership");
      return;
    }

    if (status === "authenticated") {
      fetchBooks();
    }
  }, [status, searchTerm, sortBy, filter, page]);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sortBy,
        status: filter,
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/books/my-books?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 401) {
        router.push("/membership");
        return;
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setBooks(data.books);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleSort = (sortOption: string) => {
    setSortBy(sortOption);
    setPage(1);
  };

  const handleFilter = (filterOption: string) => {
    setFilter(filterOption);
    setPage(1);
  };

  if (status === "loading") {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center w-full gap-4">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="md:w-48">
          <DropdownSort onSort={handleSort} />
        </div>
        <div className="md:w-48">
          <DropdownFilter onFilter={handleFilter} />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-4">Loading books...</div>
      ) : books.length === 0 ? (
        <div className="text-center p-4">No books found</div>
      ) : (
        <div className="grid gap-4">
          {books.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
