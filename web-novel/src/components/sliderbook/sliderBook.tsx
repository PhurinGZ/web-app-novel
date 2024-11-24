import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

interface ArrowProps {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}

interface Novel {
  id: number;
  title: string;
  category: string;
  rate: string;
  author: string;
}

interface CardProps extends Novel {
  onClick: () => void;
  selected: boolean;
  itemId: string;
}

const Arrow = ({ direction, onClick, disabled }: ArrowProps) => (
  <button
    onClick={onClick}
    className={classNames(
      "hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 justify-center items-center w-10 h-10",
      "bg-white/80 hover:bg-white rounded-full shadow-lg transition-all",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      direction === "left" ? "-left-5" : "-right-5" // Changed from left-2/right-2 to -left-5/-right-5
    )}
    disabled={disabled}
  >
    {direction === "left" ? (
      <ChevronLeft className="w-6 h-6" />
    ) : (
      <ChevronRight className="w-6 h-6" />
    )}
  </button>
);

const SliderBook = ({ dataCardNovel }: { dataCardNovel: any[] }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const dragThreshold = 5;
  const [dragDistance, setDragDistance] = useState(0);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  const items = dataCardNovel.map(
    (novel: {
      _id: string;
      name: string;
      category: { name: string };
      rate: { name: string };
      createdBy: { username: string };
    }) => ({
      id: novel._id,
      title: novel.name,
      category: novel?.category?.name,
      rate: novel?.rate?.name,
      author: novel?.createdBy?.username,
    })
  );

  const isItemSelected = (id: string) => selected.includes(id);

  const handleClick = (id: string) => () => {
    // Changed parameter type to string
    if (Math.abs(dragDistance) < dragThreshold) {
      setSelected((currentSelected) =>
        isItemSelected(id)
          ? currentSelected.filter((el) => el !== id)
          : [...currentSelected, id]
      );
    }
  };

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Touch handlers - only active on mobile
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isMobile) return; // Disable on desktop

    const slider = containerRef.current;
    if (!slider) return;

    setIsDragging(true);
    slider.setPointerCapture(e.pointerId);
    setStartX(e.clientX);
    setScrollLeft(slider.scrollLeft);
    setDragDistance(0);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isMobile || !isDragging) return; // Disable on desktop

    const slider = containerRef.current;
    if (!slider) return;

    const x = e.clientX;
    const distance = x - startX;
    setDragDistance(distance);

    slider.scrollLeft = scrollLeft - distance;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isMobile) return; // Disable on desktop

    const slider = containerRef.current;
    if (!slider) return;

    setIsDragging(false);
    slider.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="relative w-full md:px-8">
      {" "}
      {/* Added px-8 for arrow space */}
      <div className="overflow-hidden">
        {" "}
        {/* Added wrapper div with overflow-hidden */}
        <div
          ref={containerRef}
          className={classNames(
            "flex gap-5 scroll-smooth",
            isMobile ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "",
            isMobile ? "touch-pan-x" : "touch-none",
            "overflow-x-auto" // Keep overflow-x-auto here
          )}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: isMobile ? "touch" : "auto",
            userSelect: "none",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {items.map(({ id, title, category, rate, author }) => (
            <Card
              key={id}
              itemId={id}
              title={title}
              category={category}
              rate={rate}
              author={author}
              onClick={handleClick(id)}
              selected={isItemSelected(id)}
              id={0}
            />
          ))}
        </div>
      </div>
      <Arrow
        direction="left"
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
      />
      <Arrow
        direction="right"
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
      />
    </div>
  );
};

const Card = ({
  onClick,
  selected,
  title,
  category,
  rate,
  author,
  itemId,
}: Readonly<CardProps>) => {
  return (
    <div
      onClick={onClick}
      className="w-40 flex-shrink-0 cursor-pointer"
      tabIndex={0}
    >
      <a
        href={`/book/${itemId}`}
        className="no-underline text-inherit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`card ${selected ? "selected" : ""}`}>
          <img
            src="image/imageBook1.png"
            alt={title}
            className="rounded-lg w-40 h-50 object-cover"
            draggable={false}
          />
          <h2 className="text-xl font-semibold mt-2 truncate">{title}</h2>
          <p className="text-gray-700 mt-2 truncate">{author}</p>
          <p className="text-gray-700 mt-2 truncate">
            {category} · {rate}
          </p>
        </div>
      </a>
    </div>
  );
};

export default SliderBook;
