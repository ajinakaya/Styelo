import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader2, Filter, X, ArrowUpDown } from 'lucide-react';
import Navbar from '../layout/navbar';
import FilterCard from '../components/flitercard';

const FurnitureFilter = () => {
  const location = useLocation();
  
  const [filters, setFilters] = useState({ 
    minPrice: 0, 
    maxPrice: 200000, 
    color: '',
    category: '', 
    sector: '', 
    tag: '', 
    sortBy: 'name', 
    sortOrder: 'asc' 
  });

  const [furniture, setFurniture] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [availableColors, setAvailableColors] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('All Products');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const API_BASE_URL = 'http://localhost:3001';
  const availableTags = ['New Arrival', 'Best Seller', 'Featured', 'Popular', 'Recommended'];

  const MAX_PRICE = 200000;
  const MIN_PRICE = 0;
  const PRICE_GAP = 1000;

  const sortOptions = [
    { value: 'name-asc', label: 'Name A-Z', sortBy: 'name', sortOrder: 'asc' },
    { value: 'name-desc', label: 'Name Z-A', sortBy: 'name', sortOrder: 'desc' },
    { value: 'price-asc', label: 'Price Low to High', sortBy: 'price', sortOrder: 'asc' },
    { value: 'price-desc', label: 'Price High to Low', sortBy: 'price', sortOrder: 'desc' },
    { value: 'newest', label: 'Newest First', sortBy: 'createdAt', sortOrder: 'desc' },
    { value: 'oldest', label: 'Oldest First', sortBy: 'createdAt', sortOrder: 'asc' }
  ];

  const findSectorIdByName = (sectorName) => {
    const sector = sectors.find(s => s.sector?.toLowerCase() === sectorName.toLowerCase());
    return sector ? sector._id : null;
  };

  const findCategoryIdByName = (categoryName) => {
    const category = categories.find(c => c.category?.toLowerCase() === categoryName.toLowerCase());
    return category ? category._id : null;
  };

  const fetchColors = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/furniture/colors`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Colors loaded:', data);
      setAvailableColors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching colors:', err);
      setAvailableColors([]);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([fetchCategories(), fetchSectors(), fetchColors()]); // Added fetchColors
      setDataLoaded(true);
    };
    initializeData();
  }, []);

  useEffect(() => {
    if (!dataLoaded) return;

    const urlParams = new URLSearchParams(location.search);
    const newFilters = { 
      minPrice: 0, 
      maxPrice: 200000, 
      color: '',
      category: '', 
      sector: '', 
      tag: '', 
      sortBy: 'name', 
      sortOrder: 'asc' 
    };

    if (urlParams.get('tag')) {
      newFilters.tag = urlParams.get('tag');
      setTitle(urlParams.get('tag'));
    }
    
    if (urlParams.get('sector')) {
      const sectorParam = urlParams.get('sector');
      const sectorId = findSectorIdByName(sectorParam);
      newFilters.sector = sectorId || sectorParam;
      setTitle(sectorParam);
    }

    if (urlParams.get('category')) {
      const categoryParam = urlParams.get('category');
      const categoryId = findCategoryIdByName(categoryParam);
      newFilters.category = categoryId || categoryParam;
      setTitle(categoryParam);
    }

    setFilters(newFilters);

    if (!urlParams.get('tag') && !urlParams.get('sector') && !urlParams.get('category')) {
      setTitle('All Products');
    }
  }, [location.search, dataLoaded, categories, sectors]);

  useEffect(() => {
    if (dataLoaded) {
      const timeout = setTimeout(() => fetchFurniture(), 500);
      return () => clearTimeout(timeout);
    }
  }, [filters, dataLoaded]);

  const fetchFurniture = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.minPrice > 0) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice < MAX_PRICE) params.append('maxPrice', filters.maxPrice);
      if (filters.color) params.append('color', filters.color);
      if (filters.category) params.append('category', filters.category);
      if (filters.sector) params.append('sector', filters.sector);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      let url = `${API_BASE_URL}/furniture`;
      if (params.toString()) {
        url = `${API_BASE_URL}/furniture/filter?${params.toString()}`;
      } else {
        url = `${API_BASE_URL}/furniture/all`;
      }

      console.log('Fetching furniture with URL:', url);

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Ensure data is always an array
      if (Array.isArray(data)) {
        setFurniture(data);
      } else if (data && Array.isArray(data.furniture)) {
        setFurniture(data.furniture);
      } else if (data && Array.isArray(data.data)) {
        setFurniture(data.data);
      } else {
        console.warn('Unexpected data format:', data);
        setFurniture([]);
      }
    } catch (err) {
      console.error('Error fetching furniture:', err);
      setFurniture([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/category`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Categories loaded:', data);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  const fetchSectors = async (categoryId = '') => {
    try {
      const url = categoryId
        ? `${API_BASE_URL}/sector?category=${categoryId}`
        : `${API_BASE_URL}/sector`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Sectors loaded:', data);
      setSectors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching sectors:', err);
      setSectors([]);
    }
  };

  const handleFilterChange = (key, value) => {
    console.log(`Filter change: ${key} = ${value}`);
    
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      if (key === 'category' && value) {
        const categoryObj = categories.find(c => c._id === value);
        setTitle(categoryObj ? categoryObj.category : 'Category');
      } else if (key === 'sector' && value) {
        const sectorObj = sectors.find(s => s._id === value);
        setTitle(sectorObj ? sectorObj.sector : 'Sector');
      } else if (key === 'tag' && value) {
        setTitle(value);
      } else if (!value && (key === 'tag' || key === 'sector' || key === 'category')) {
        // Check if any other filters are active
        const hasActiveFilters = Object.entries(updated).some(([filterKey, filterValue]) => {
          if (filterKey === 'minPrice' && filterValue > MIN_PRICE) return true;
          if (filterKey === 'maxPrice' && filterValue < MAX_PRICE) return true;
          if (filterKey === 'color' && filterValue) return true;
          if (filterKey === 'tag' && filterValue) return true;
          if (filterKey === 'sector' && filterValue) return true;
          if (filterKey === 'category' && filterValue) return true;
          return false;
        });
        
        if (!hasActiveFilters) {
          setTitle('All Products');
        }
      }

      return updated;
    });
  };

  const handleMinPriceChange = (value) => {
    const newMin = parseInt(value);
    setFilters(prev => ({
      ...prev,
      minPrice: newMin,
      maxPrice: Math.max(newMin + PRICE_GAP, prev.maxPrice)
    }));
  };

  const handleMaxPriceChange = (value) => {
    const newMax = parseInt(value);
    setFilters(prev => ({
      ...prev,
      maxPrice: newMax,
      minPrice: Math.min(prev.minPrice, newMax - PRICE_GAP)
    }));
  };

  const handleSortChange = (sortValue) => {
    const option = sortOptions.find(opt => opt.value === sortValue);
    if (option) {
      setFilters(prev => ({ 
        ...prev, 
        sortBy: option.sortBy, 
        sortOrder: option.sortOrder 
      }));
    }
  };

  const clearFilters = () => {
    setFilters({ 
      minPrice: MIN_PRICE, 
      maxPrice: MAX_PRICE, 
      color: '', 
      category: '', 
      sector: '', 
      tag: '', 
      sortBy: 'name', 
      sortOrder: 'asc' 
    });
    setTitle('All Products');
    fetchSectors(); 
  };

  const FilterSection = ({ className = "" }) => (
    <div className={`space-y-4 ${className}`}>
      {/* Price Filter */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-md font-semibold mb-4 text-gray-900">Filter by price</h3>
        <div className="relative mb-6 px-2">
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div 
              className="absolute h-2 bg-orange-500 rounded-full"
              style={{
                left: `${(filters.minPrice / MAX_PRICE) * 100}%`,
                width: `${((filters.maxPrice - filters.minPrice) / MAX_PRICE) * 100}%`
              }}
            />
          </div>
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step="1000"
            value={filters.minPrice}
            onChange={(e) => handleMinPriceChange(e.target.value)}
            className="range-slider range-slider-min absolute top-0 w-full h-2"
          />
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step="1000"
            value={filters.maxPrice}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
            className="range-slider range-slider-max absolute top-0 w-full h-2"
          />
        </div>
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
          <span>Rs {filters.minPrice.toLocaleString()}</span>
          <span>Rs {filters.maxPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Rs {MIN_PRICE.toLocaleString()}</span>
          <span>Rs {MAX_PRICE.toLocaleString()}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-md font-semibold mb-3 text-gray-900">Tags</h3>
        <div className="flex flex-wrap gap-1.5">
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleFilterChange('tag', filters.tag === tag ? '' : tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filters.tag === tag ? 'bg-black/75 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-md font-semibold mb-3 text-gray-900">Category</h3>
        <select
          className="w-full px-3 py-2 text-sm bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          value={filters.category}
          onChange={(e) => {
            console.log('Category selected:', e.target.value);
            handleFilterChange('category', e.target.value);
          }}
        >
          <option value="">All Categories</option>
          {categories.map(s => (
            <option key={s._id} value={s._id}>
              {s.category}
            </option>
          ))}
        </select>
        {categories.length === 0 && (
          <p className="text-xs text-gray-500 mt-2">Loading categories...</p>
        )}
      </div>

      {/* Sector */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-md font-semibold mb-3 text-gray-900">Sector</h3>
        <select
          className="w-full px-3 py-2 text-sm bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
          value={filters.sector}
          onChange={(e) => {
            console.log('Sector selected:', e.target.value);
            handleFilterChange('sector', e.target.value);
          }}
        >
          <option value="">All Sectors</option>
          {sectors.map(s => (
            <option key={s._id} value={s._id}>
              {s.sector}
            </option>
          ))}
        </select>
        {sectors.length === 0 && (
          <p className="text-xs text-gray-500 mt-2">Loading sectors...</p>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-md font-semibold mb-3 text-gray-900">Color</h3>
        {availableColors.length === 0 ? (
          <p className="text-xs text-gray-500">Loading colors...</p>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {availableColors.map(color => (
              <button
                key={color.name}
                onClick={() => handleFilterChange('color', filters.color === color.name ? '' : color.name)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  filters.color === color.name
                    ? 'border-black/20 scale-110'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{
                  backgroundColor: color.code
                }}
                title={color.name}
              />
            ))}
          </div>
        )}
        {filters.color && (
          <div className="mt-2 text-xs text-gray-600">Selected: {filters.color}</div>
        )}
      </div>

      <button
        onClick={clearFilters}
        className="w-full bg-gray-100 text-gray-800 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );

  const currentSortValue = `${filters.sortBy}-${filters.sortOrder}`;

  // Debug information
  console.log('Current filters:', filters);
  console.log('Categories:', categories);
  console.log('Sectors:', sectors);
  console.log('Available colors:', availableColors);
  console.log('Data loaded:', dataLoaded);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8 font-poppins">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center space-x-2 bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block lg:w-72">
            <FilterSection />
          </aside>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Filters</h2>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <FilterSection />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <section className="flex-1">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-[35px] font-medium text-gray-900 mb-2">{title}</h1>
                  <p className="text-gray-600">
                    {loading ? 'Loading...' : `${Array.isArray(furniture) ? furniture.length : 0} products found`}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowUpDown size={20} className="text-gray-500" />
                  <select
                    value={currentSortValue}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-4 py-2 bg-white border border-black/20 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="animate-spin w-12 h-12 text-black" />
              </div>
            ) : furniture.length === 0 ? (
              <div className="col-span-full text-center py-24">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {furniture.map(product => (
                  <FilterCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default FurnitureFilter;