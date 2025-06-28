import React from 'react';

const CategoryContainer = ({ onClose }) => {
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
        {/* Grid Columns */}
        <div className="grid grid-cols-3 gap-4 text-[13px]">
          {/* First Column */}
          <div className="space-y-1 border-r border-gray-200 pr-3">
            <a href="#" className="block text-gray-800 hover:text-blue-600 font-medium">New</a>
            <a href="#" className="block text-gray-800 hover:text-blue-600 font-medium">Recommended</a>
            <a href="#" className="block text-gray-800 hover:text-blue-600 font-medium">Popular</a>
          </div>

          {/* Second Column */}
          <div className="space-y-1">
            <h3 className="text-gray-900 font-semibold mb-1">Living</h3>
            <a href="#" className="block text-gray-600 hover:text-blue-600">Sofas</a>
            <a href="#" className="block text-gray-600 hover:text-blue-600">Tables</a>
            <a href="#" className="block text-gray-600 hover:text-blue-600">Side Tables</a>
            <a href="#" className="block text-gray-600 hover:text-blue-600">Chairs</a>

            <h3 className="text-gray-900 font-semibold mt-2 mb-1">Office</h3>
            <a href="#" className="block text-gray-600 hover:text-blue-600">Desks</a>
            <a href="#" className="block text-gray-600 hover:text-blue-600">Bookcases</a>
          </div>

          {/* Third Column */}
          <div className="space-y-1">
            <h3 className="text-gray-900 font-semibold mb-1">Outdoor</h3>
            <a href="#" className="block text-gray-600 hover:text-blue-600">Tables</a>
            <a href="#" className="block text-gray-600 hover:text-blue-600">Seating</a>
            <a href="#" className="block text-gray-600 hover:text-blue-600">Lighting</a>

            <h3 className="text-gray-900 font-semibold mt-2 mb-1">Decor</h3>
            <a href="#" className="block text-gray-600 hover:text-blue-600">Mirrors</a>
            <a href="#" className="block text-gray-600 hover:text-blue-600">Wall Art</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryContainer;
