import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const { title, subtitle, sale, button, type, media, circle, bgColor } =
    slides[index];

  return (
    <section className="w-full h-[90vh] flex overflow-hidden font-['Poppins'] relative">
      {/* Left Section */}
      <div
        key={index} // forces re-render for animation
        className="w-1/2 flex flex-col justify-center pl-20 space-y-5 z-10 fade-in"
        style={{ backgroundColor: bgColor }}
      >
        <p className="text-[#d97a00] font-medium text-[19px]">{subtitle}</p>
        <h1 className="text-[48px] font-bold leading-tight">{title}</h1>
        <p className="text-sm">{sale}</p>
        <button className="flip-button bg-[#421E93A1] text-white px-6 py-2 rounded-full font-semibold w-max hover:bg-[#e4830b] transition">
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
    </section>
  );
};

export default HeroSection;
