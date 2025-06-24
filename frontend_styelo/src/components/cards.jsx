// Productcards.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Productcards = ({ headline, subheading, products }) => {
  const [visibleProducts, setVisibleProducts] = useState(3);

  const handleSeeMore = () => {
    setVisibleProducts((prevVisible) => prevVisible + 3);
  };

  if (!Array.isArray(products)) {
    console.error("Invalid 'products' prop:", products);
    return <p>Error: Invalid product data.</p>;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-16 font-[Poppins]'>
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className='text-4xl font-semibold text-black/90 mb-2'>{headline}</h2>
        {subheading && (
          <p className='text-gray-600 text-lg max-w-2xl mx-auto'>{subheading}</p>
        )}
      </div>

      {/* See More Button */}
      {products && visibleProducts < products.length && (
        <div className="text-center mb-8">
          <button 
            onClick={handleSeeMore} 
            className="bg-[#B88E2F] text-white px-8 py-3 rounded-lg hover:bg-[#9A7528] transition duration-300 font-semibold"
          >
            See More
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-100 ">
        {Array.isArray(products) && products.length > 0 ? (
          products.slice(0, visibleProducts).map((product) => (
            <div 
              key={product._id} 
              className="bg-white border border-black/20 hover:border-[#B88E2F] transition-all duration-300 overflow-hidden group relative rounded-[10px]"
              style={{ width: '469px', height: '263px' }}
            >
              {/* Wishlist Icon */}
              <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors z-10 group-hover:scale-110">
                <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 hover:fill-current transition-colors" />
              </button>

              {/* Card Content  */}
              <div className="flex h-full">
                {/* Product Image */}
                <div className="flex-shrink-0 relative overflow-hidden rounded-2xl m-4" style={{ width: '165px', height: '220px' }}>
                  <img 
                    src={`http://localhost:3001/${product.thumbnail}`}
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                  />
                
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-2xl" />
                </div>

                {/* Product Info */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    {/* Product Name */}
                    <h3 className="font-bold text-xl text-gray-900 mb-3 leading-tight">
                      {product.name}
                    </h3>
                    
                    {/* Size */}
                    <p className="text-sm text-gray-600 mb-2 font-medium">
                      Size: <span className="text-gray-500">{product.size || "66×18×32 inches"}</span>
                    </p>

                    {/* Colors */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm text-gray-600 font-medium">Colors:</span>
                      <div className="flex gap-2">
                        {product.color && product.color.length > 0 ? (
                          product.color.slice(0, 4).map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border-2 border-white ring-1 ring-gray-300 hover:scale-110 transition-transform cursor-pointer"
                              style={{ backgroundColor: color }}
                            />
                          ))
                        ) : (
                          // Default colors if none provided
                          <>
                            <div className="w-4 h-4 rounded-full bg-amber-800 border-2 border-white ring-1 ring-gray-300 hover:scale-110 transition-transform cursor-pointer" />
                            <div className="w-4 h-4 rounded-full bg-amber-200 border-2 border-white ring-1 ring-gray-300 hover:scale-110 transition-transform cursor-pointer" />
                            <div className="w-4 h-4 rounded-full bg-gray-400 border-2 border-white ring-1 ring-gray-300 hover:scale-110 transition-transform cursor-pointer" />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <p className="text-xl font-bold text-gray-900 mb-4">
                      Rs.{product.price?.toLocaleString() || "10,800"}
                    </p>
                  </div>

                  {/* Add to Cart Button - Centered */}
                  <div className="flex justify-center">
                    <button 
                      className="bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 font-semibold text-sm"
                      style={{ width: '109px', height: '32px' }}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No products available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Productcards;