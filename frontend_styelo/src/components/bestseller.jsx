import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BestsellerSection = ({ products = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample data if no products provided
  const defaultImages = [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
  ];

  const images = products.length > 0 
    ? products.slice(0, 4).map(product => `http://localhost:3001/${product.thumbnail}`)
    : defaultImages;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="bg-[#82562540] font-[Poppins]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          
          <div className="lg:col-span-2 space-y-7">
            <h2 className="text-[40px]  font-bold text-gray-800 leading-tight">
              Our All time best
              <br />
              Sellers !
            </h2>
            
            <p className="text-gray-600 text-base leading-relaxed">
              Our designer already made a lot of beautiful prototype of rooms that inspire you
            </p>
            
            <button className="bg-[#B88E2F] hover:bg-[#9A7528] text-white px-8 py-3 font-medium transition-colors duration-300">
              Buy Today
            </button>
          </div>

         
          <div className="lg:col-span-3 relative">
            <div className="relative w-full h-[530px] flex">
              
              
              <div className="relative w-[800px] h-[560px]  mr-6">
                <img
                  src={images[currentSlide]}
                  alt="Main bestseller"
                  className="w-full h-full object-cover"
                />
              </div>

              
              <div className="relative w-[690px] h-[450px]  z-10 mt-12">
                <img
                  src={images[(currentSlide + 1) % images.length]}
                  alt="Background bestseller"
                  className="w-full h-full object-cover"
                />
              </div>

              {currentSlide > 0 && (
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 z-30"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
              )}

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 z-30"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="flex justify-center mt-9 space-x-2 right-30 absolute bottom-1 ">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-[#B88E2F]'
                      : 'bg-black/70 hover:bg-black'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestsellerSection;