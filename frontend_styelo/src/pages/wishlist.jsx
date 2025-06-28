import React from 'react';
import Navbar from '../layout/navbar';
import { useWishlist } from '../context/wishlistcontext';

const Wishlist = () => {
  const { wishlist, loading, error, removeFromWishlist } = useWishlist();

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
      <div className="font-poppins max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6 text-center">Wishlist</h1>

        {wishlist.map((item) => {
          const furniture = item?.furniture || {};
          const color = furniture.colorOptions?.[0]?.colorCode || "#ccc";
          const name = furniture.name || "No name";
          const price = typeof furniture.price === 'number' ? furniture.price.toLocaleString() : "N/A";
          const thumbnail = furniture.thumbnail;
          const key = furniture._id || item._id || Math.random();

          return (
            <div key={key} className="flex justify-between items-center border rounded-lg p-4 mb-6 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold">{name}</h2>
                <p className="text-sm">Colors:</p>
                <div className="w-5 h-5 rounded-full mb-2" style={{ backgroundColor: color }}></div>
                <p className="font-medium">Rs: {price}</p>
                <button className="bg-black text-white px-4 py-1 mt-2 rounded">Add to cart</button>
                <div className="text-sm mt-2">
                  <button
                    className="text-red-600"
                    onClick={() => removeFromWishlist(furniture._id)}
                  >
                    Remove item
                  </button>
                </div>
              </div>

              {thumbnail ? (
                <img
                  src={`http://localhost:3001/${thumbnail}`}
                  alt={name}
                  className="w-48 rounded-lg object-cover"
                />
              ) : (
                <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  No image
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Wishlist;
