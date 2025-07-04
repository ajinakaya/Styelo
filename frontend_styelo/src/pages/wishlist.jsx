import React from 'react';
import Navbar from '../layout/navbar';
import { useWishlist } from '../context/wishlistcontext';
import { useCart } from '../context/cartcontext';
import { toast } from "react-toastify";

const Wishlist = () => {
  const { wishlist, loading, error, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();


  const handleAddToCart = async (furnitureId) => {
    try {
      await addToCart(furnitureId, 1);
      console.log('Added to cart successfully');
      toast.success('Added to cart successfully');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center py-16 font-poppins text-lg">Loading wishlist...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="text-center py-16 font-poppins text-red-500 text-lg">{error}</div>
      </>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <>
        <Navbar />
        <div className="text-center py-16 font-poppins text-lg">Your wishlist is empty.</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="font-poppins max-w-7xl mx-auto p-10">
        <h1 className="text-3xl font-medium mb-15 text-center">Wishlist</h1>

        {wishlist.map((item) => {
          const furniture = item?.furniture || {};
          const color = furniture.colorOptions?.[0]?.colorCode || "#ccc";
          const name = furniture.name || "No name";
          const price = typeof furniture.price === 'number' ? furniture.price.toLocaleString() : "N/A";
          const thumbnail = furniture.thumbnail;
          const key = furniture._id || item._id || Math.random();

          return (
            <div key={key} className="flex justify-between items-center border border-black/24 rounded-lg p-4 mb-6 ">
              <div>
                <h2 className="text-[20px] font-semibold">{name}</h2>
               {/* Color */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <p className="text-[15px] font-medium text-black/60">Colors:</p>
                        <div 
                          className="w-5 h-5 rounded-full" 
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    </div>
                <p className="font-medium text-black/80">Rs: {price}</p>
                <button 
                 onClick={() => handleAddToCart(furniture._id)}
                className="bg-black/80 text-white px-4 py-1 mt-2 rounded text-[13px]">Add to cart</button>
                <div className="text-sm mt-2">
                  <button
                    className="text-red-600 text-[13px] "
                    onClick={() => removeFromWishlist(furniture._id)}
                    
                  >
                    Remove item
                  </button>
                </div>
              </div>

             <div className="ml-6 flex-shrink-0">
                    {thumbnail ? (
                      <img
                        src={`http://localhost:3001/${thumbnail}`}
                        alt={name}
                        className="w-55 h-45 object-cover rounded-lg shadow-sm"
                      />
                    ) : (
                      <div className="w-48 h-36 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 shadow-sm">
                        No image
                      </div>
                    )}
                  </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Wishlist;
