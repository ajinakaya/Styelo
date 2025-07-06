import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryContainer = ({ onClose }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (filterType, filterValue) => {
    onClose();
    const params = new URLSearchParams();
    if (filterValue) {
      params.append(filterType, filterValue);
      navigate(`/filter?${params.toString()}`);
    } else {
      navigate('/filter');
    }
  };

  const handleTagClick = (tag) => {
    handleCategoryClick('tag', tag);
  };

  const handleSectorClick = (sector) => {
    handleCategoryClick('sector', sector);
  };

  const handleCategoryHeaderClick = (category) => {
    handleCategoryClick('category', category);
  };

  const handleAllProductsClick = () => {
    handleCategoryClick('', ''); 
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#D9D9D960] flex justify-center items-start pt-24 px-4 font-poppins"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-lg rounded-lg p-4 mx-auto relative"
        style={{ width: '414px', height: '242.92px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-3 gap-4 text-[13px]">
          {/* First Column - Tags */}
          <div className="space-y-1 border-r border-gray-200 pr-3">
            <button 
              onClick={handleAllProductsClick}
              className="block text-gray-800 hover:text-blue-800 font-semibold text-left w-full"
            >
              All Products
            </button>
            <button 
              onClick={() => handleTagClick('New Arrival')}
              className="block text-gray-800 hover:text-blue-600 font-Regular text-left w-full"
            >
              New Arrival
            </button>
            <button 
              onClick={() => handleTagClick('Best Seller')}
              className="block text-gray-800 hover:text-blue-600 font-Regular text-left w-full"
            >
              Best Seller
            </button>
            <button 
              onClick={() => handleTagClick('Recommended')}
              className="block text-gray-800 hover:text-blue-600 font-Regular text-left w-full"
            >
              Recommended
            </button>
            <button 
              onClick={() => handleTagClick('Popular')}
              className="block text-gray-800 hover:text-blue-600 font-Regular text-left w-full"
            >
              Popular
            </button>
            <button 
              onClick={() => handleTagClick('Featured')}
              className="block text-gray-800 hover:text-blue-600 font-Regular text-left w-full"
            >
             Featured
            </button>
          </div>

          {/* Second Column - Living & Office */}
          <div className="space-y-1">
            <button 
              onClick={() => handleCategoryHeaderClick('Living Room')}
              className="text-gray-900 font-semibold mb-1 hover:text-blue-600 text-left w-full"
            >
              Living Room
            </button>
            <button 
              onClick={() => handleSectorClick('Sofas')}
              className="block text-gray-600 hover:text-blue-600 text-left w-full"
            >
              Sofas
            </button>
            <button 
              onClick={() => handleSectorClick('Tables')}
              className="block text-gray-600 hover:text-blue-600 text-left w-full"
            >
              Tables
            </button>
            <button 
              onClick={() => handleSectorClick('Side Tables')}
              className="block text-gray-600 hover:text-blue-600 text-left w-full"
            >
              Side Tables
            </button>
            <button 
              onClick={() => handleSectorClick('Chairs')}
              className="block text-gray-600 hover:text-blue-600 text-left w-full"
            >
              Chairs
            </button>

            {/* Office Category Header - Now Clickable */}
            <button 
              onClick={() => handleCategoryHeaderClick('Office')}
              className="text-gray-900 font-semibold mt-2 mb-1 hover:text-blue-600 text-left w-full"
            >
              Office
            </button>
            <button 
              onClick={() => handleSectorClick('Desks')}
              className="block text-gray-600 hover:text-blue-600 text-left w-full"
            >
              Desks
            </button>
            <button 
              onClick={() => handleSectorClick('Bookcase')}
              className="block text-gray-600 hover:text-blue-600 text-left w-full"
            >
              Bookcase
            </button>
          </div>

          {/* Third Column - Storage & Decor */}
          <div className="space-y-1">
            <button 
              onClick={() => handleCategoryHeaderClick('Storage')}
              className="text-gray-900 font-semibold mb-1 hover:text-blue-600 text-left w-full"
            >
              Storage
            </button>
            <button 
              onClick={() => handleSectorClick('shoes Storage')}
              className="block text-gray-600 hover:text-blue-600 text-left w-full"
            >
              shoes Storage
            </button>
        
            <button 
              onClick={() => handleCategoryHeaderClick('Decor')}
              className="text-gray-900 font-semibold mt-2 mb-1 hover:text-blue-600 text-left w-full"
            >
              Decor
            </button>
            <button 
              onClick={() => handleSectorClick('Mirrors')}
              className="block text-gray-600 hover:text-blue-600 text-left w-full"
            >
              Mirrors
            </button>
            <button 
              onClick={() => handleSectorClick('Wall Art')}
              className="block text-gray-600 hover:text-blue-600 text-left w-full"
            >
              Wall Art
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryContainer;