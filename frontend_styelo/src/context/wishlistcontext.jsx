import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authconetxt";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { authToken } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authToken) fetchWishlist();
  }, [authToken]);

  // Fetch wishlist
  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:3001/wishlist/get", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setWishlist(res.data?.items || []);
    } catch (err) {
      setError("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  // Add to wishlist
  const addToWishlist = async (furnitureId) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/wishlist/add",
        { furnitureId },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setWishlist(res.data?.items || []);
    } catch (err) {
      console.error("Add to wishlist failed", err);
      setError("Failed to add item to wishlist.");
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (furnitureId) => {
    try {
      const res = await axios.delete("http://localhost:3001/wishlist/remove", {
        headers: { Authorization: `Bearer ${authToken}` },
        data: { furnitureId },
      });
      setWishlist(res.data?.items || []);
    } catch (err) {
      console.error("Remove from wishlist failed", err);
      setError("Failed to remove item from wishlist.");
    }
  };
    const toggleWishlist = async (furnitureId) => {
    const isWishlisted = wishlist.some(
      (item) =>
        item.furniture?._id === furnitureId || item._id === furnitureId
    );
    if (isWishlisted) {
      await removeFromWishlist(furnitureId);
    } else {
      await addToWishlist(furnitureId);
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
        toggleWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
