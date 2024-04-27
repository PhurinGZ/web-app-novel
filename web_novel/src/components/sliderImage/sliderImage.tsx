'use client'
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import Slider, { Settings } from "react-slick";

import "./style.scss";

const NextArrow: React.FC<React.HTMLProps<HTMLDivElement>> = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}
      style={{ ...style, position: "absolute", right: "28px", zIndex: 1 }}
    >
      <div
        style={{
          width: "200%", // Adjust the width and height as needed
          height: "200%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Change the alpha value (0.5 for 50% opacity)
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ArrowForwardIos style={{ color: "white" }} />
      </div>
    </div>
  );
};

const PrevArrow: React.FC<React.HTMLProps<HTMLDivElement>> = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}
      style={{ ...style, position: "absolute", left: "8px", zIndex: 1 }}
    >
      <div
        style={{
          width: "200%", // Adjust the width and height as needed
          height: "200%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Change the alpha value (0.5 for 50% opacity)
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ArrowBackIosNew style={{ color: "white" }} />
      </div>
    </div>
  );
};

const SliderImage: React.FC = () => {
  const settings: Settings = {
    className: "center",
    centerMode: true,
    centerPadding: "150px",
    slidesToShow: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // Adjust breakpoints as needed
        settings: {
          centerPadding: "100px", // Adjust centerPadding for smaller screens
        },
      },
      {
        breakpoint: 768,
        settings: {
          centerPadding: "50px", // Adjust centerPadding for even smaller screens
        },
      },
      {
        breakpoint: 480,
        settings: {
          centerPadding: "20px", // Adjust centerPadding for mobile screens
        },
      },
    ],
  };

  return (
    <div
      className="slider-container"
      style={{
        width: "100%",
        maxWidth: "1000px", // Adjust maximum width as per your design
        margin: "5%",
        position: "relative",
      }}
    >
      <Slider {...settings}>
        <div>
          <img
            src="/image/image1.png"
            alt=""
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div>
          <img
            src="/image/image2.png"
            alt=""
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div>
          <img
            src="/image/image1.png"
            alt=""
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div>
          <img
            src="/image/image2.png"
            alt=""
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div>
          <img
            src="/image/image1.png"
            alt=""
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div>
          <img
            src="/image/image2.png"
            alt=""
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </Slider>
    </div>
  );
};

export default SliderImage;
