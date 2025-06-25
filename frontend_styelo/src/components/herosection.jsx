import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/herosection.css";

import video1 from "../assets/video1.mp4";
import video2 from "../assets/video3.mp4";
import bgImage from "../assets/image4.jpg";

import circle1 from "../assets/circle1.jpg";
import circle2 from "../assets/circle4.jpg";
import circle3 from "../assets/circle3.jpg";

const slides = [
  {
    title: "3-in-1 Sofa bed",
    subtitle: "Stylish Comfort",
    sale: "LIMITED TIME OFFER",
    button: "Explore",
    type: "video",
    media: video1,
    circle: circle1,
    bgColor: "#9B754F45",
  },
  {
    title: "Wood Book Shelf",
    subtitle: "Book Shelf",
    sale: "SALE UP TO 40% OFF",
    button: "Shop Now",
    type: "image",
    media: bgImage,
    circle: circle2,
    bgColor: "#f5e7ce",
  },
  {
    title: "Lifting Coffee Table",
    subtitle: "Wood Table",
    sale: "NEW COLLECTION 2025",
    button: "View More",
    type: "video",
    media: video2,
    circle: circle3,
    bgColor: "#9B754F72",
  },
];

const HeroSection = () => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setIndex((prev) => (prev + 1) % slides.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const { title, subtitle, sale, button, type, media, circle, bgColor } =
    slides[index];

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (slideIndex) => {
    setIndex(slideIndex);
  };

  return (
    <section 
      className="w-full h-[107vh] flex overflow-hidden font-poppins relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left Section  */}
      <div
        className="w-1/2 flex flex-col justify-center pl-20 space-y-5 z-10"
        style={{ backgroundColor: bgColor }}
      >
        <p key={index + "-subtitle"} className="text-[#d97a00] font-medium text-[15px] fade-in-up">
          {subtitle}
        </p>
        <h1 key={index + "-title"} className="text-[45px] font-semibold leading-tight fade-in-up">
          {title}
        </h1>
        <p className="text-sm">{sale}</p>
        <button
          key={index + "-button"}
          className="flip-button bg-[#421E93A1] text-white px-6 py-2 rounded-full font-semibold w-max hover:bg-[#e4830b] transition"
        >
          {button}
        </button>
      </div>

      {/* Right Section */}
      <div className="w-1/2 relative h-full">
        {type === "video" ? (
          <video
            src={media}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={media}
            alt="Background"
            className="w-full h-full object-cover"
          />
        )}

        {/* Floating Product */}
        <div className="absolute top-1/2 left-[-200px] transform -translate-y-1/2 float-animation z-10">
          <div className="w-[350px] h-[350px] rounded-full shadow-2xl overflow-hidden">
            <img
              src={circle}
              alt="Product"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className={`absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      <button
        onClick={nextSlide}
        className={`absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {slides.map((slide, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className="group relative"
            >
              {/* Dot indicator */}
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === slideIndex
                    ? 'bg-[#d97a00] scale-125'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

    </section>
  );
};

export default HeroSection;