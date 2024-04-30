"use client";
// home.jsx

import React from "react";
import Navbar from "../navbar/navbar";
import SliderImage from "../sliderImage/sliderImage";
import Searchbar from "../searchbar/searchbar";
import "./homePage.scss"; // Make sure to import your SCSS file
import SliderBook from "../sliderbook/sliderBook";
import dataCardNovel from "../../data/data"; // Importing the data from data.js
import DetailNovel from "../detailNovelPage/detailnovel";
import { useModal } from "../../context/ModalContext";
import Footer from "../footer/footer";

function HomePage() {
  // const { isModalOpen } = useModal();

  return (
    <>
      <nav>
        <div className="relative z-[200] h-[50px] md:h-[60px] ">
          <Navbar position={"fixed"} />
        </div>
      </nav>
      <main className="">
        <div className="pb-24">
          <div className="slider-container-home-page ">
            <SliderImage />
          </div>
          <div className="searchbar-container-home-page">
            <Searchbar />
          </div>
          <div className="content-home">
            <div className="content">
              <h1 className="text-3xl font-bold mb-4">แนะนำ</h1>
              <div className="book-cover-home-page">
                <SliderBook dataCardNovel={dataCardNovel} />
              </div>
            </div>
            <div className="content">
              <h1 className="text-3xl font-bold mb-4">ยอดนิยม</h1>
              <div className="book-cover-home-page">
                <SliderBook dataCardNovel={dataCardNovel} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
