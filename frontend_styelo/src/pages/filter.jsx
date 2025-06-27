import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart, User, Sliders } from 'lucide-react';

// Mock Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 font-poppins">
      <div className="max-w-screen-xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-semibold text-black">STYELO</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-orange-500 font-medium hover:text-orange-600 transition-colors">
              Furniture
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">
              Decors
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">
              Contact
            </a>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <User className="w-5 h-5 text-gray-700 hover:text-orange-500 cursor-pointer transition-colors" />
            <Search className="w-5 h-5 text-gray-700 hover:text-orange-500 cursor-pointer transition-colors" />
            <Heart className="w-5 h-5 text-gray-700 hover:text-orange-500 cursor-pointer transition-colors" />
            <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-orange-500 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </nav>
  );
};

// Mock Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 font-poppins">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <span className="text-black font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-semibold">STYELO</span>
            </div>
            <p className="text-gray-400 text-sm">Made in Nepal - Premium furnishing brand</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Furniture</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Decors</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Living Room</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Office Furniture</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dining Tables</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Storage</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Kathmandu, Nepal</p>
              <p>info@styelo.com</p>
              <p>+977 98XXXXXXXX</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Styelo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="w-6 h-6 text-gray-600 hover:text-red-500 cursor-pointer" />
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
        <p className="text-xl font-bold text-gray-900 mb-4">Rs:{product.price.toLocaleString()}</p>
        <button className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors font-medium">
          Add to cart
        </button>
      </div>
    </div>
  );
};

// Main Furniture Filter Component
const FurnitureFilter = () => {
  const [filters, setFilters] = useState({
    minPrice: 10000,
    maxPrice: 60000,
    category: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Mock furniture data
  const [furniture, setFurniture] = useState([
    {
      id: 1,
      name: "Ashlie Solid Wood",
      price: 15735,
      category: "Office Furniture",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      name: "Pebble Nightstand",
      price: 24999,
      category: "Living Room",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      name: "Shoe Storage Cabinet",
      price: 15735,
      category: "Storage",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 4,
      name: "Storage Bookcase",
      price: 24999,
      category: "Office Furniture",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 5,
      name: "Rounded Bedside",
      price: 31056,
      category: "Living Room",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 6,
      name: "Arboré Credenza",
      price: 10800,
      category: "Dining Tables",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ]);

  const [filteredFurniture, setFilteredFurniture] = useState(furniture);

  const categories = [
    "New Arrivals",
    "Recommended",
    "Popular",
    "Living Room",
    "Office Furniture",
    "Outdoor",
    "Dining Tables",
    "Mirrors",
    "Wall Arts"
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    let filtered = [...furniture];

    // Price filter
    filtered = filtered.filter(item => 
      item.price >= filters.minPrice && item.price <= filters.maxPrice
    );

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Sort
    filtered.sort((a, b) => {
      if (filters.sortBy === 'price') {
        return filters.sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else {
        return filters.sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });

    setFilteredFurniture(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <>
      <Navbar />
      
      <main className="px-6 lg:px-12 py-16 max-w-screen-xl mx-auto font-poppins">
        <h2 className="text-3xl font-semibold text-center mb-14">NEW ARRIVALS</h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg"
            >
              <Sliders className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filters Sidebar */}
          <div className={`lg:w-64 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Price Filter */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-4">Filter by price</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="range"
                    min="10000"
                    max="60000"
                    step="1000"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Rs: {filters.minPrice.toLocaleString()}</span>
                    <span>Rs: {filters.maxPrice.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <input
                    type="range"
                    min="10000"
                    max="60000"
                    step="1000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-4">Category</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className={`block w-full text-left py-2 px-3 rounded-lg transition-colors ${
                    filters.category === '' 
                      ? 'bg-orange-100 text-orange-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange('category', category)}
                    className={`block w-full text-left py-2 px-3 rounded-lg transition-colors ${
                      filters.category === category 
                        ? 'bg-orange-100 text-orange-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-4">Sort by</h3>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredFurniture.length} products
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFurniture.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredFurniture.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                <button
                  onClick={() => setFilters({
                    minPrice: 10000,
                    maxPrice: 60000,
                    category: '',
                    sortBy: 'name',
                    sortOrder: 'asc'
                  })}
                  className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
};

export default FurnitureFilter;