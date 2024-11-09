"use client"

import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import { Loader, Search, Book, BookOpen, Users } from "lucide-react";

interface Novel {
  _id: string;
  name: string;
  detail: string;
  image_novel: string;
  type: 'novel' | 'webtoon';
  status: 'ongoing' | 'completed' | 'dropped';
  averageRating: number;
  tags: string[];
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  avatar?: string;
}

type SearchResult = {
  novels: Novel[];
  webtoons: Novel[];
  users: User[];
};

const tabs = [
  { id: 'novels', label: 'นิยายรายตอน', icon: Book },
  { id: 'webtoons', label: 'เว็บตูน', icon: BookOpen },
  { id: 'users', label: 'ผู้ใช้', icon: Users },
];

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState('novels');
  const [results, setResults] = useState<SearchResult>({
    novels: [],
    webtoons: [],
    users: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchResults = async (value: string) => {
    if (!value.trim()) {
      setResults({ novels: [], webtoons: [], users: [] });
      return;
    }

    setIsLoading(true);
    try {
      // Updated to include type in the query
      const res = await fetch(`/api/search?search=${encodeURIComponent(value)}&type=${activeTab}`);
      const data = await res.json();

      if (data.success) {
        // Properly categorize the results based on the type field from the database

        console.log(data)
        setResults({
          novels: data.data.filter((item: Novel) => item.type === 'novel') || [],
          webtoons: data.data.filter((item: Novel) => item.type === 'webtoon') || [],
          users: data.users || []
        });
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults({ novels: [], webtoons: [], users: [] });
    } finally {
      setIsLoading(false);
    }
  };

  console.log(results)

  const debouncedFetch = debounce(fetchResults, 300);

  useEffect(() => {
    if (searchTerm) {
      debouncedFetch(searchTerm);
    }
  }, [activeTab]); // Refetch when tab changes

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, []);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    debouncedFetch(value);
  };

  const handleNovelClick = (item: Novel) => {
    window.location.href = `/book/${item._id}`;
  };

  const handleUserClick = (user: User) => {
    window.location.href = `/profile/${user._id}`;
  };

  const renderNovelItem = (item: Novel) => (
    <div
      key={item._id}
      onClick={() => handleNovelClick(item)}
      className="flex gap-4 p-3 bg-white rounded-lg shadow hover:shadow-md cursor-pointer"
    >
      <img
        src={"/image/imageBook1.png"}
        alt={item.name}
        className="w-16 h-20 object-cover rounded"
      />
      <div className="flex flex-col flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{item.detail}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">
            {item.status}
          </span>
          {item.averageRating > 0 && (
            <span className="text-xs text-yellow-500">
              ★ {item.averageRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      );
    }

    if (!searchTerm) {
      return (
        <div className="text-center py-20 text-gray-500">
          ค้นหานิยาย เว็บตูน หรือผู้ใช้
        </div>
      );
    }

    const activeResults = 
      activeTab === 'novels' ? results.novels :
      activeTab === 'webtoons' ? results.webtoons :
      results.users;

    if (activeResults.length === 0) {
      return (
        <div className="text-center py-20 text-gray-500">
          ไม่พบ{activeTab === 'novels' ? 'นิยาย' : activeTab === 'webtoons' ? 'เว็บตูน' : 'ผู้ใช้'}ที่คุณค้นหา
        </div>
      );
    }

    return (
      <div className="grid gap-4 p-4">
        {activeTab === 'users' ? (
          results.users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className="flex items-center gap-3 p-3 bg-white rounded-lg shadow hover:shadow-md cursor-pointer"
            >
              <img
                src={user.avatar || "/image/imageBook1.png"}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{user.username}</span>
            </div>
          ))
        ) : (
          (activeTab === 'novels' ? results.novels : results.webtoons).map(renderNovelItem)
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="ค้นหา..."
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin text-gray-500" />
            ) : (
              <Search className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 border-b mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="ml-1 text-sm text-gray-500">
                ({activeTab === tab.id ? 
                  (activeTab === 'novels' ? results.novels.length :
                   activeTab === 'webtoons' ? results.webtoons.length :
                   results.users.length) : 0})
              </span>
            </button>
          );
        })}
      </div>

      {renderContent()}
    </div>
  );
};

export default SearchPage;