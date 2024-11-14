// components/writerPage/tabs.tsx
import { useState, useEffect } from "react";
import Image from "next/image";
import BookWriter from "./bookWhiter";

interface Stats {
  viewCount: number;
  likeCount: number;
  bookshelfCount: number;
  reviewCount: number;
}

const DEFAULT_STATS: Stats = {
  viewCount: 0,
  likeCount: 0,
  bookshelfCount: 0,
  reviewCount: 0
};

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/writer/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();

        console.log(data)

        // Ensure all required properties exist with fallback to 0
        setStats({
          viewCount: data.stats.viewCount ?? 0,
          likeCount: data.stats.likeCount ?? 0,
          bookshelfCount: data.stats.bookshelfCount ?? 0,
          reviewCount: data.stats.reviewCount ?? 0
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Set default values in case of error
        setStats(DEFAULT_STATS);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const StatBox = ({ icon, label, value }: { icon: string; label: string; value: number }) => (
    <div className="flex space-x-7 border-solid border-2 border-gray-300 rounded-lg items-center p-4 h-fit mr-8 mb-8">
      <div className="flex items-center">
        <Image
          src={`/icon/${icon}.svg`}
          height={100}
          width={100}
          alt={icon}
          className="max-w-8 max-h-8 mr-2"
        />
        <span className="text-2xl font-bold">{label}</span>
      </div>
      <div>
        <span className="text-2xl text-[#F5A524]">
          {loading ? '-' : (value || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );

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
        >
          ยอดขาย
          {activeTab === 1 && (
            <span
              className="absolute bottom-0 left-0 bg-[#F5A524] h-1 w-full"
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      <section>
        <div className="">
          <div className="p-4">
            {activeTab === 0 && (
              <section>
                {error ? (
                  <div className="text-red-500">Error: {error}</div>
                ) : (
                  <div>
                    <div className="flex flex-col md:flex-wrap md:flex-row">
                      <StatBox icon="view" label="ยอดดู" value={stats.viewCount} />
                      <StatBox icon="like" label="ไลค์" value={stats.likeCount} />
                      <StatBox icon="bookshelf" label="ชั้นหนังสือ" value={stats.bookshelfCount} />
                      <StatBox icon="comment" label="คอมเมนต์" value={stats.reviewCount} />
                    </div>
                  </div>
                )}
                <BookWriter />
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