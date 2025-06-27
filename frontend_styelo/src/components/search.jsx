import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';

const Search = ({ onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.trim()) {
      try {
        const res = await axios.get(`/furniture/search?search=${value}`);
        setResults(res.data);
      } catch (err) {
        console.error("Search error", err);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#D9D9D960] flex justify-center items-start pt-24 px-4 md:px-0 "
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-xl text-gray-600 hover:text-red-500"
        >
          ×
        </button>

        {/* Search Input */}
        <div className="relative mb-6">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 text-sm focus:outline-none "
            placeholder="Search..."
            value={searchText}
            onChange={handleChange}
          />
          <FiSearch className="absolute top-2.5 left-3 text-gray-500 text-lg" />
        </div>

        {/* Results */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {results.length === 0 && searchText.trim() && (
            <p className="text-center text-gray-500">No results found.</p>
          )}
          {results.map((item) => (
            <div key={item._id} className="flex items-center gap-4 p-3 border rounded-lg shadow-sm">
              <img
                src={`http://localhost:3001/${item.thumbnail}`}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <span className="text-gray-700 font-medium">Rs:{item.price.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500">
                  Size: {item.specifications?.dimensions?.overall || 'N/A'}
                </p>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
