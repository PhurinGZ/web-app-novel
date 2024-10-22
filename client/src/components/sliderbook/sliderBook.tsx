"use client";

//SliderBook.jsx
import React from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Link } from "@nextui-org/react";
import "./style.scss";
import "react-horizontal-scrolling-menu/dist/styles.css";
import Image from "next/image";

interface ArrowProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

interface Novel {
  id: number;
  title: string;
  category: string;
  rate: number; // Change type to number
  author: string;
}

interface Props {
  dataCardNovel: {
    id: number;
    name: string;
    desc: string;
    category: string;
    rate: string;
    rating: number[];
    detail: string;
    tag: string;
    chapter: {
      id: number;
      name: string;
      content: string;
    }[];
    author: string;
    public: boolean;
    updateAt: string;
    createAt: string;
  }[];
}

interface CardProps extends Novel {
  onClick: () => void;
  selected: boolean;
  itemId: number; // Add itemId to the props interface
}

function SliderBook({ dataCardNovel }: Props) {
  const items = dataCardNovel.map((novel) => ({
    id: Number(novel.id),

    title: novel.attributes.name, // Change to novel.title
    category: novel.attributes.category?.data?.attributes?.name,
    rate: novel.attributes.rate.data?.attributes?.name, // Convert rate to number
    author: novel.attributes.user.data?.attributes.username,

  }));
  

  const [selected, setSelected] = React.useState<number[]>([]); // Change to number[]

  const isItemSelected = (id: number) => selected.includes(id); // Simplify condition

  const handleClick = (id: number) => () => {
    setSelected((currentSelected) =>
      isItemSelected(id)
        ? currentSelected.filter((el) => el !== id)
        : [...currentSelected, id]
    );
  };
  return (
    <ScrollMenu
      LeftArrow={LeftArrow}
      RightArrow={RightArrow}
      transitionBehavior={"smooth"}
    >
      {items.map(({ id, title, category, rate, author }) => (
        <Card
          itemId={id}
          title={title}
          category={category}
          rate={rate}
          author={author}
          key={id}
          onClick={handleClick(id)}
          selected={isItemSelected(id)}
          id={0}
        />
      ))}
    </ScrollMenu>
  );
}

function LeftArrow() {

  const visibility = React.useContext(VisibilityContext);
  const isFirstItemVisible = visibility.useIsVisible("first", true);
  const scrollPrev = visibility.scrollPrev

  return (
    <Arrow disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
      <ArrowBack />
    </Arrow>
  );
}

function RightArrow() {
  const visibility = React.useContext(VisibilityContext);
  const isLastItemVisible = visibility.useIsVisible("last", false);
  const scrollNext = visibility.scrollNext
  // console.log(isLastItemVisible)

  return (
    <Arrow disabled={isLastItemVisible} onClick={() => scrollNext()}>
      <ArrowForward />
    </Arrow>
  );
}

function Card({
  onClick,
  selected,
  title,
  category,
  rate,
  author,
  itemId,
}: Readonly<CardProps>) {
  // const { openModal } = useModal(); // Using the useModal hook to access openModal function from context

  const handleCardClick = () => {
    // Call openModal function to open the modal
    // openModal();
    // Additional actions when card is clicked can be placed here
    // For example, you might want to store the selected item ID or perform other operations
    onClick();
  };

  // const handleClick = () => {
  //   // Navigate to the homepage with the modal opened and the corresponding item's ID in the URL
  //   navigate(`/b/${itemId}`);
  // };

  return (
    <div
      onClick={handleCardClick}
      style={{
        width: "160px",
        margin: "10px",
      }}
      tabIndex={0}
    >

      <Link href={`/book/${title}`} style={{ textDecoration: "none" }}>

        <div className={`card ${selected ? "selected" : ""} `}>
          <Image
            src={"/image/imageBook1.png"}
            height={100}
            alt={title}
            width={200}
            className="rounded-lg"
          />

          <h2 className="text-xl font-semibold mt-2">{title}</h2>
          <p className="text-gray-700 mt-2">{author}</p>
          <p className="text-gray-700 mt-2">
            {category} · {rate}
          </p>
        </div>
      </Link>
    </div>
  );
}

function Arrow({ children, disabled, onClick }: ArrowProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        right: "1%",
        opacity: disabled ? "0" : "1",
        userSelect: "none",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        backgroundColor: "#ccc",
        border: "none",
        outline: "none",
      }}
    >
      {children}
    </button>
  );
}

export default SliderBook;
