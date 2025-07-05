import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import { Link } from "react-router-dom";

const Search = ({ onClose }) => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;
    setSearchText(value);
    setHasSearched(true);

    if (value.trim()) {
      try {
        const res = await axios.get(`/furniture/search?search=${value}`);
        setResults(res.data);
      } catch (err) {
        console.error("Search error", err);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  const handleSearchIconClick = () => {
    setHasSearched(true);
    if (searchText.trim()) {
      handleChange({ target: { value: searchText } });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#D9D9D960] flex justify-center items-start pt-25 px-4 md:px-0 font-poppins"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-2xl text-gray-400 hover:text-gray-600 z-10"
        >
          ×
        </button>

        {/* Search Input */}
        <div className="p-6 pb-4">
          <div className="relative">
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl py-3 px-4 pl-12 text-sm focus:outline-none focus:border-gray-300 bg-white"
              placeholder="Search"
              value={searchText}
              onChange={handleChange}
            />
            <button
              onClick={handleSearchIconClick}
              className="absolute top-3 left-4 text-gray-400 text-lg hover:text-gray-600"
            >
              <FiSearch />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 pb-6">
          {!hasSearched ? (
            // No recent searches
            <div className="bg-gray-50 border border-black/20 rounded-xl p-8 min-h-[300px] flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                <FiSearch className="text-gray-400 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Start your search
              </h3>
              <p className="text-gray-500 text-sm text-center max-w-md">
                Search for furniture by name or select a category to browse our
                collection
              </p>
            </div>
          ) : (
            // Search results
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {results.length === 0 && searchText.trim() ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-500 text-sm">No results found</p>
                </div>
              ) : (
                results.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    className="block bg-white border border-black/20 rounded-2xl p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={`http://localhost:3001/${item.thumbnail}`}
                          alt={item.name}
                          className="w-25 h-30 object-cover rounded-xl"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        {/* Product Name and Price */}
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 text-base">
                            {item.name}
                          </h4>
                          <span className="text-gray-900 font-semibold text-sm ml-4">
                            Rs.{item.price.toLocaleString()}
                          </span>
                        </div>

                        {/* Size */}
                        <p className="text-sm text-gray-600 mb-2">
                          Size:{" "}
                          {item.specifications?.dimensions?.overall || "N/A"}
                        </p>

                        {/* Colors */}
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Colors:</p>
                          <div className="flex gap-2">
                            {item.colorOptions
                              ?.slice(0, 4)
                              .map((option, idx) => (
                                <div
                                  key={idx}
                                  className="w-5 h-5 rounded-full border-2 border-white"
                                  style={{ backgroundColor: option.colorCode }}
                                  title={option.color}
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
