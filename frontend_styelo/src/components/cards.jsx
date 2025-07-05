import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "../context/wishlistcontext";
import { useCart } from "../context/cartcontext";
import { toast } from "react-toastify";

const Productcards = ({ headline, subheading, products }) => {
  const [visibleProducts, setVisibleProducts] = useState(10);
  const { toggleWishlist, wishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleSeeMore = () => {
    setVisibleProducts((prevVisible) => prevVisible + 10);
  };

  const isInWishlist = (productId) =>
    wishlist?.some(
      (item) => item.furniture?._id === productId || item._id === productId
    );

  const handleWishlistToggle = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    const wasInWishlist = isInWishlist(productId);
    
    try {
      toggleWishlist(productId);
      
      if (wasInWishlist) {
        toast.info("Removed from wishlist");
      } else {
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Wishlist toggle failed", error);
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="max-w-9xl mx-auto px-15 py-9 font-poppins">
      <div className="text-center mb-9">
        <h2 className="text-[33px] font-medium text-black mb-0">{headline}</h2>
        {subheading && (
          <p className="text-[16px] text-black/48 font-Regular">{subheading}</p>
        )}
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {Array.isArray(products) && products.length > 0 ? (
            products.slice(0, visibleProducts).map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="bg-white border border-black/20 hover:border-black/30 transition-all duration-300 overflow-hidden group relative rounded-[10px] flex-shrink-0 cursor-pointer"
                style={{ width: "440px", height: "245px" }}
              >
                <div className="flex h-full">
                  <div
                    className="flex-shrink-0 relative overflow-hidden rounded-2xl m-4"
                    style={{ width: "160px", height: "210px" }}
                  >
                    <img
                      src={`http://localhost:3001/${product.thumbnail}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-2xl" />
                  </div>

                  <div className="flex-1 pl-1 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-[23px] text-gray-900 mb-1 leading-tight ">
                        {product.name}
                      </h3>

                      <p className="text-[16px] text-black/62 mb-1 font-medium">
                        Size:{" "}
                        <span className="text-black/62">
                          {product.specifications?.dimensions?.overall}
                        </span>
                      </p>

                      <div className="mb-2">
                        <p className="text-[16px] text-black/62 mb-1 font-medium">
                          Colors:
                        </p>
                        <div className="flex gap-3 pl-4">
                          {product.colorOptions
                            ?.slice(0, 4)
                            .map((option, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 rounded-full border-2 border-white hover:scale-110 transition-transform cursor-pointer"
                                style={{ backgroundColor: option.colorCode }}
                                title={option.color}
                              />
                            ))}
                        </div>
                      </div>

                      <p className="text-[16px] font-medium text-black/80 mb-2">
                        Rs.{product.price?.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          try {
                            await addToCart(product._id, 1);
                            toast.success("Added to cart successfully");
                          } catch (err) {
                            console.error("Add to cart failed", err);
                            toast.error("Failed to add to cart");
                          }
                        }}
                        className="bg-black/76 text-white hover:bg-black/70 transition-all duration-200 font-medium text-[13px] rounded-lg px-4 py-2 flex items-center justify-center"
                        style={{ width: "109px", height: "32px" }}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>

                {/* Heart Icon */}
                <button
                  onClick={(e) => handleWishlistToggle(e, product._id)}
                  className="absolute bottom-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors z-10"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isInWishlist(product._id)
                        ? "text-red-500 fill-red-500"
                        : "text-black/30"
                    }`}
                    fill={isInWishlist(product._id) ? "red" : "none"}
                  />
                </button>
              </Link>
            ))
          ) : (
            <div className="w-full text-center py-12">
              <p className="text-gray-500 text-lg">No products available.</p>
            </div>
          )}

          {products && visibleProducts < products.length && (
            <div
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: "200px" }}
            >
              <button
                onClick={handleSeeMore}
                className="bg-[#B88E2F] text-white px-8 py-3 rounded-lg hover:bg-[#9A7528] transition duration-300 font-semibold whitespace-nowrap"
              >
                See More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Productcards;